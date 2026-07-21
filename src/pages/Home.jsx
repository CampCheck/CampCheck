import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChevronRight,
  FaMapMarkerAlt,
  FaCaravan,
  FaShoppingCart,
} from "react-icons/fa";
import { WiDaySunny } from "react-icons/wi";
import { getWeather, weatherDescription } from "../utils/weather";

function Home() {
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    async function loadData() {
      const trips = JSON.parse(localStorage.getItem("trips")) || [];

      if (trips.length > 0) {
        trips.sort((a, b) => new Date(a.arrival) - new Date(b.arrival));

        const nextTrip = trips[0];
        setTrip(nextTrip);

        if (nextTrip.town) {
          try {
            setLoadingWeather(true);
            setWeatherError(false);

            const result = await getWeather(nextTrip.town);
            setWeather(result);
          } catch (error) {
            console.error(error);
            setWeatherError(true);
          } finally {
            setLoadingWeather(false);
          }
        }
      }
    }

    loadData();
  }, []);

  function daysUntil(date) {
    if (!date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tripDate = new Date(date);
    tripDate.setHours(0, 0, 0, 0);

    return Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="dashboard">

      <div className="card weather">
        <div className="card-header">
          <h3>
            <WiDaySunny className="card-icon" />
            Weather
          </h3>
        </div>

        {loadingWeather ? (
          <p>Loading weather...</p>
        ) : weather ? (
          <>
            <p><strong>{weather.temperature}°C</strong></p>
            <p>{weatherDescription(weather.code)}</p>
            <p>{weather.location}</p>
          </>
        ) : weatherError ? (
          <p>Unable to load weather.</p>
        ) : (
          <p>Add a town to your trip to see the weather.</p>
        )}
      </div>

      {trip ? (
        <div
          className="card trip"
          onClick={() => navigate("/trips")}
        >
          <div className="card-header">
            <h3>
              <FaCalendarAlt className="card-icon" />
              Next Trip
            </h3>

            <FaChevronRight className="card-arrow" />
          </div>

          <h3>{trip.campsite}</h3>

          <p>
            <FaMapMarkerAlt className="inline-icon" />
            {trip.town}
          </p>

          <p>
            {formatDate(trip.arrival)} – {formatDate(trip.departure)}
          </p>

          <p>
            <strong>{daysUntil(trip.arrival)} days to go</strong>
          </p>
        </div>
      ) : (
        <div className="card trip">
          <div className="card-header">
            <h3>
              <FaCalendarAlt className="card-icon" />
              Next Trip
            </h3>
          </div>

          <p>No trips planned.</p>

          <button onClick={() => navigate("/trips/new")}>
            Add Your First Trip
          </button>
        </div>
      )}

      <div
        className="card trip"
        onClick={() => navigate("/caravan")}
      >
        <div className="card-header">
          <h3>
            <FaCaravan className="card-icon" />
            Caravan Checklists
          </h3>

          <FaChevronRight className="card-arrow" />
        </div>

        <p>Departure, arrival, packing and maintenance.</p>
      </div>

      <div
        className="card trip"
        onClick={() => navigate("/shopping")}
      >
        <div className="card-header">
          <h3>
            <FaShoppingCart className="card-icon" />
            Shopping List
          </h3>

          <FaChevronRight className="card-arrow" />
        </div>

        <p>Things to buy before your next trip.</p>
      </div>

    </div>
  );
}

export default Home;