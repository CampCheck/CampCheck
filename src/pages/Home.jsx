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
import { getWeather, weatherDescription, weatherIcon, dayName } from "../utils/weather";
import logo from "../assets/campcheck-logo.png";

function Home() {
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "30px",
          paddingTop: "10px",
        }}
      >
        <img
          src={logo}
          alt="CampCheck"
          style={{
            width: "170px",
            maxWidth: "70%",
            height: "auto",
            display: "block",
          }}
        />
      </div>

      <div
  className="card weather"
  onClick={() => setShowForecast(!showForecast)}
  style={{
    cursor: "pointer",
    overflow: "hidden",
    transition: "0.3s ease",
  }}
>
  <div className="card-header">
    <h3>
      <WiDaySunny className="card-icon" />
      Weather
    </h3>

    <FaChevronRight
      className="card-arrow"
      style={{
        transform: showForecast ? "rotate(90deg)" : "rotate(0deg)",
        transition: "0.3s",
      }}
    />
  </div>

  {loadingWeather ? (
    <p>Loading weather...</p>
  ) : weather ? (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "15px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              lineHeight: 1,
            }}
          >
            {weather.temperature}°
          </div>

          <div
            style={{
              fontSize: "1.1rem",
              marginTop: "6px",
            }}
          >
            {weatherDescription(weather.code)}
          </div>

          <div
            style={{
              opacity: 0.7,
              marginTop: "4px",
            }}
          >
            📍 {weather.location}
          </div>
        </div>

        {!showForecast && (
          <div
            style={{
              color: "#7ED957",
              fontWeight: "600",
              textAlign: "right",
            }}
          >
            
            <br />
            
          </div>
        )}
      </div>

      {showForecast && weather.forecast && (
        <div
          style={{
            marginTop: "25px",
          }}
        >
          {weather.forecast.map((day) => (
            <div
              key={day.date}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>
                  {weatherIcon(day.code)}
                </span>

                <strong>{dayName(day.date)}</strong>
              </div>

              <div>
                <strong>{day.max}°</strong>

                <span
                  style={{
                    opacity: 0.6,
                    marginLeft: "10px",
                  }}
                >
                  {day.min}°
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  ) : weatherError ? (
    <p>Unable to load weather.</p>
  ) : (
    <p>Add a town to your trip to see the weather.</p>
  )}
</div>

      {trip ? (
        <div className="card trip" onClick={() => navigate("/trips")}>
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

      <div className="card trip" onClick={() => navigate("/caravan")}>
        <div className="card-header">
          <h3>
            <FaCaravan className="card-icon" />
            Caravan Checklists
          </h3>

          <FaChevronRight className="card-arrow" />
        </div>

        <p>Departure, arrival, packing and maintenance.</p>
      </div>

      <div className="card trip" onClick={() => navigate("/shopping")}>
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