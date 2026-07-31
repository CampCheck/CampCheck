import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JourneyBar from "../components/JourneyBar";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";


function Trips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingTrips = trips.filter(
  (trip) => new Date(trip.departure) >= today
);

const previousTrips = trips.filter(
  (trip) => new Date(trip.departure) < today
);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem("trips")) || [];

    savedTrips.sort(
      (a, b) => new Date(a.arrival) - new Date(b.arrival)
    );

    setTrips(savedTrips);
  }, []);

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  function daysUntil(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tripDate = new Date(date);
  tripDate.setHours(0, 0, 0, 0);

  return Math.ceil(
    (tripDate - today) / (1000 * 60 * 60 * 24)
  );
}
function deleteTrip(id) {
  if (!window.confirm("Delete this trip?")) return;

  const updatedTrips = trips.filter((trip) => trip.id !== id);

  localStorage.setItem("trips", JSON.stringify(updatedTrips));
  setTrips(updatedTrips);
}function getCaravanPosition(days) {
  if (days <= 0) return 100;
  if (days <= 1) return 98;
  if (days <= 3) return 95;
  if (days <= 7) return 90;
  if (days <= 14) return 85;
  if (days <= 30) return 60;
  if (days <= 65) return 40;
  if (days <= 90) return 25;

  return 0;
}
  return (
    <div className="dashboard trips-page">
     <div className="section-header">
  <h2>Upcoming Trips</h2>

  <span className="trip-count">
    {upcomingTrips.length}
  </span>
</div>

      

      {upcomingTrips.length === 0 ? (
        <div className="card trip next-trip">
          <p>No trips added yet.</p>
        </div>
      ) : (
        upcomingTrips.map((trip) => (
          <div
            key={trip.id}
            className="card trip next-trip"
             
          >
            <div className="trip-header">
  <h3 className="trip-campsite">{trip.campsite}</h3>

  <div className="trip-badge">
    {daysUntil(trip.arrival)} DAYS
  </div>
</div>

<p>
  <FaMapMarkerAlt className="inline-icon" />
  {trip.town}
</p>

<p>
  <FaCalendarAlt className="inline-icon" />
  {formatDate(trip.arrival)} – {formatDate(trip.departure)}
</p>
<JourneyBar
  progress={getCaravanPosition(daysUntil(trip.arrival))}
/>

<div className="trip-buttons">
  <button onClick={() => navigate(`/trips/edit/${trip.id}`)}>
  Edit
</button>

  <button onClick={() => deleteTrip(trip.id)}>
  Delete
</button>
</div>
              
          </div>
        ))
      )}
{previousTrips.length > 0 && (
  <>
    <div className="section-header previous-section">
  <div>
    <h2>Previous Trips</h2>
    
  </div>

  <span className="trip-count">
    {previousTrips.length}
  </span>
</div>

    {previousTrips.map((trip) => (
  <div
    key={trip.id}
    className="card trip previous-trip"
    style={{ marginBottom: "15px", opacity: 0.75 }}
  >
    <h3 className="trip-campsite">{trip.campsite}</h3>

    <p>📍 {trip.town}</p>

    <p>
      📅 {formatDate(trip.arrival)} – {formatDate(trip.departure)}
    </p>

    <div className="trip-buttons">
      <button onClick={() => deleteTrip(trip.id)}>
        Delete
      </button>
    </div>
  </div>
))}
  </>
)}
      <button
  className="floating-add-trip"
  onClick={() => navigate("/trips/new")}
>
  +
</button>
    </div>
  );
}

export default Trips;