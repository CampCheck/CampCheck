import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChevronRight,
  FaMapMarkerAlt,
  FaCaravan,
  FaShoppingCart,
} from "react-icons/fa";
import { getWeather, weatherDescription, weatherIcon, dayName, weatherTheme } from "../utils/weather";
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
        className={`card weather weather-${weather ? weatherTheme(weather.code) : "default"} ${showForecast ? "weather-open" : ""}`}
        onClick={() => weather && setShowForecast(!showForecast)}
        role={weather ? "button" : undefined}
        tabIndex={weather ? 0 : undefined}
        onKeyDown={(event) => {
          if (weather && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            setShowForecast(!showForecast);
          }
        }}
      >
        {weather && (
          <div className="weather-scene" aria-hidden="true">
            <div className="weather-sun" />
            <div className="weather-cloud weather-cloud-one" />
            <div className="weather-cloud weather-cloud-two" />

            {(weatherTheme(weather.code) === "rain" || weatherTheme(weather.code) === "storm") && (
              <div className="weather-rain">
                {Array.from({ length: 12 }).map((_, index) => (
                  <i key={index} />
                ))}
              </div>
            )}

            {weatherTheme(weather.code) === "snow" && (
              <div className="weather-snow">
                {Array.from({ length: 14 }).map((_, index) => (
                  <i key={index}>•</i>
                ))}
              </div>
            )}

            {weatherTheme(weather.code) === "storm" && <div className="weather-lightning" />}
          </div>
        )}

        <div className="weather-content">
          <div className="weather-header">
            <h3>Weather</h3>
            
          </div>

          {loadingWeather ? (
            <p className="weather-message">Loading weather...</p>
          ) : weather ? (
            <>
              <div className="weather-current">
                <div className="weather-temperature">{weather.temperature}°</div>
                <div className="weather-description">{weatherDescription(weather.code)}</div>
                <div className="weather-high-low">
                  <span>↑ {weather.todayMax}°</span>
                  <span>/</span>
                  <span>↓ {weather.todayMin}°</span>
                </div>
                <div className="weather-today-rain">
  💧 {weather.forecast[0]?.rain ?? 0}% chance of rain
</div>
                <div className="weather-location">
                  <FaMapMarkerAlt />
                  <span>{weather.location}</span>
                </div>
              </div>
              <div className="weather-five-day">
  {weather.forecast.slice(0, 5).map((day) => (
    <div className="weather-five-day-item" key={day.date}>
      <span className="weather-five-day-name">
        {dayName(day.date)}
      </span>

      <span className="weather-five-day-icon">
        {weatherIcon(day.code)}
      </span>

      <strong>{day.max}°</strong>

      <span className="weather-five-day-rain">
        💧 {day.rain ?? 0}%
      </span>
    </div>
  ))}
</div>

              <div className={`weather-forecast ${showForecast ? "weather-forecast-open" : ""}`}>
                <div className="weather-forecast-inner">
                  <div className="weather-forecast-title">7-day forecast</div>
                  {weather.forecast.map((day) => (
                    <div className="weather-forecast-row" key={day.date}>
                      <div className="weather-forecast-day">
                        <span className="weather-forecast-icon">{weatherIcon(day.code)}</span>
                        <span>
                          <strong>{dayName(day.date)}</strong>
                          <small>{weatherDescription(day.code)}</small>
                        </span>
                      </div>
                      <div className="weather-forecast-values">
                        <span className="weather-rain-chance">💧 {day.rain ?? 0}%</span>
                        <strong>{day.max}°</strong>
                        <span>{day.min}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : weatherError ? (
            <p className="weather-message">Unable to load weather.</p>
          ) : (
            <p className="weather-message">Add a town to your trip to see the weather.</p>
          )}
        </div>
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