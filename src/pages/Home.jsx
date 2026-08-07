import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  getWeather,
  weatherDescription,
  weatherIcon,
  dayName,
  weatherTheme,
} from "../utils/weather";

import logo from "../assets/campcheck-logo.png";

import { HiOutlineShoppingBag } from "react-icons/hi2";
import {
  LuCalendarDays,
  LuClipboardCheck,
} from "react-icons/lu";
import JourneyBar from "../components/JourneyBar";

import { subscribeTrips } from "../firebase/trips";
import { subscribeShopping } from "../firebase/shopping";
import { initialiseChecklist, subscribeChecklist } from "../firebase/checklists";
import { useGroup } from "../auth/GroupProvider";
import { getCampingStyle } from "../campingStyles";

function Home() {
  const navigate = useNavigate();
  const { groupId, campingStyle } = useGroup();
  const style = getCampingStyle(campingStyle);

  const [trip, setTrip] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

  const [shoppingProgress, setShoppingProgress] = useState({
    total: 0,
    completed: 0,
  });
  const [checklistProgress, setChecklistProgress] = useState({});

  useEffect(() => {
    if (!groupId) return undefined;
    const unsubscribe = subscribeShopping(
      groupId,
      (shoppingItems) => {
        const shoppingCompleted =
          shoppingItems.filter((item) => item.checked).length;

        setShoppingProgress({
          total: shoppingItems.length,
          completed: shoppingCompleted,
        });
      },
      console.error
    );

    return unsubscribe;
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return undefined;

    const unsubscribers = Object.entries(style.checklists).map(([key, checklist]) => {
      initialiseChecklist(groupId, checklist.id, checklist.items).catch(console.error);
      return subscribeChecklist(groupId, checklist.id, (items) => {
        setChecklistProgress((current) => ({
          ...current,
          [key]: { total: items.length, completed: items.filter((item) => item.checked).length },
        }));
      }, console.error);
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [groupId, style]);

  useEffect(() => {
    if (!groupId) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return subscribeTrips(
      groupId,
      (trips) => {
        const upcomingTrips = trips.filter(
          (trip) => new Date(trip.departure) >= today
        );

        if (upcomingTrips.length === 0) {
          setTrip(null);
          return;
        }

        setTrip(upcomingTrips[0]);
      },
      console.error
    );
  }, [groupId]);

  useEffect(() => {
    if (!trip?.town) {
      setWeather(null);
      setWeatherError(false);
      setLoadingWeather(false);
      return;
    }

    let cancelled = false;

    async function loadWeather() {
      try {
        setLoadingWeather(true);
        setWeatherError(false);

        const result = await getWeather(trip.town);

        if (!cancelled) {
          setWeather(result);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setWeatherError(true);
        }
      } finally {
        if (!cancelled) {
          setLoadingWeather(false);
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [trip?.town]);

  function daysUntil(date) {
    if (!date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tripDate = new Date(date);
    tripDate.setHours(0, 0, 0, 0);

    return Math.ceil(
      (tripDate - today) / (1000 * 60 * 60 * 24)
    );
  }
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
const shoppingLeft =
  shoppingProgress.total - shoppingProgress.completed;

const shoppingPercent =
  shoppingProgress.total > 0
    ? Math.round(
        (shoppingProgress.completed / shoppingProgress.total) * 100
      )
    : 0;
    let journeyPosition = 0;

if (trip?.arrival) {
  const days = daysUntil(trip.arrival);

 if (days <= 0) {
  journeyPosition = 97;
} else if (days <= 1) {
  journeyPosition = 95;
} else if (days <= 3) {
  journeyPosition = 92;
} else if (days <= 7) {
  journeyPosition = 88;
} else if (days <= 14) {
  journeyPosition = 82;
} else if (days <= 30) {
  journeyPosition = 60;
} else if (days <= 65) {
  journeyPosition = 40;
} else if (days <= 90) {
  journeyPosition = 25;
} else {
  journeyPosition = 2;
}
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
        <div className="card trip next-trip" onClick={() => navigate("/trips")}>
          <div className="floating-card-icon">
  <LuCalendarDays />
</div>

          <h3 className="trip-campsite">{trip.campsite}</h3>

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
         



  <JourneyBar
  progress={journeyPosition}
/>
        </div>
        
      ) : (
        
        <div className="card trip">
          <div className="next-trip-top">
  <div className="next-trip-icon">
    <FaCalendarAlt />
  </div>
</div>

          <p>No trips planned.</p>

          <button onClick={() => navigate("/trips/new")}>
            Add Your First Trip
          </button>
        </div>
      )}

      {Object.entries(style.checklists).map(([key, checklist]) => {
        const progress = checklistProgress[key] || { completed: 0, total: checklist.items.length };
        const percent = progress.total ? Math.round((progress.completed / progress.total) * 100) : 0;
        return (
          <div key={key} className="card trip caravan-card" onClick={() => navigate("/checklists")}>
            <div className="caravan-card-top">
              <h3>{checklist.title}</h3>
              <div className="caravan-card-icon"><LuClipboardCheck /></div>
            </div>
            <div className="caravan-progress-text">{progress.completed} of {progress.total} completed</div>
            <div className="caravan-progress-bar"><div className="caravan-progress-fill" style={{ width: `${percent}%` }} /></div>
            <div className="caravan-progress-percent">{percent}% complete</div>
          </div>
        );
      })}

      <div
  className="card shopping-card"
  onClick={() => navigate("/shopping")}
>
  
  <div className="floating-card-icon">

  <HiOutlineShoppingBag />
</div>
<div className="shopping-card-top">
  <h3>Shopping</h3>
</div>
  <div className="shopping-progress-text">
    {shoppingLeft} {shoppingLeft === 1 ? "item" : "items"} left
  </div>

  <div className="shopping-progress-bar">
    <div
      className="shopping-progress-fill"
      style={{ width: `${shoppingPercent}%` }}
    />
  </div>

  <div className="shopping-progress-percent">
    {shoppingPercent}% complete
  </div>
</div>
    </div>
  );
}

export default Home;
