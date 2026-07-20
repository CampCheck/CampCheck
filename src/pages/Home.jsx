import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWeather, weatherDescription } from "../utils/weather";

function Home() {
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    async function loadData() {
      const savedTrip = JSON.parse(localStorage.getItem("nextTrip"));

      if (!savedTrip) return;

      setTrip(savedTrip);

      if (!savedTrip.town) return;

      try {
        setLoadingWeather(true);
        setWeatherError(false);

        const result = await getWeather(savedTrip.town);

        setWeather(result);
      } catch (error) {
        console.error(error);
        setWeatherError(true);
      } finally {
        setLoadingWeather(false);
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

    const diff = tripDate - today;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="dashboard">
      <h2>Good evening</h2>

      <p className="subtitle">
        Ready for your next adventure?
      </p>

      <div className="card weather">
        <h3>🌤 Weather</h3>

        {loadingWeather ? (
          <p>Loading weather...</p>
        ) : weather ? (
          <>
            <p>
              <strong>{weather.temperature}°C</strong>
            </p>

            <p>{weatherDescription(weather.code)}</p>

            <p>{weather.location}</p>
          </>
        ) : weatherError ? (
          <p>Unable to load weather.</p>
        ) : (
          <p>Add a town to your trip to see the weather.</p>
        )}
      </div>

      <div
        className="card trip"
        onClick={() => navigate("/trips")}
        style={{ cursor: "pointer" }}
      >
        <h3>📅 Next Trip</h3>

        {trip ? (
          <>
            <p>
              <strong>{trip.destination}</strong>
            </p>

            <p>{trip.campsite}</p>

            <p>📍 {trip.town}</p>

            <p>
              📅 {trip.arrival} → {trip.departure}
            </p>

            <p>⏳ {daysUntil(trip.arrival)} days to go</p>

            <p className="action">View Trip →</p>
          </>
        ) : (
          <>
            <p>No trip planned.</p>

            <p className="action">Tap to add one →</p>
          </>
        )}
      </div>

      <div className="card tasks">
        <h3>⚠️ Outstanding Tasks</h3>
        <p>You're all caught up!</p>
      </div>

      <div className="card notes">
        <h3>📝 Recent Notes</h3>
        <p>No notes yet.</p>
      </div>
    </div>
  );
}

export default Home;