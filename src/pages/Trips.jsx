import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
function deleteTrip(id) {
  if (!window.confirm("Delete this trip?")) return;

  const updatedTrips = trips.filter((trip) => trip.id !== id);

  localStorage.setItem("trips", JSON.stringify(updatedTrips));
  setTrips(updatedTrips);
}
  return (
    <div className="container">
      <h2>🏕️ Upcoming Trips</h2>

      <p>Your upcoming camping adventures.</p>

      {upcomingTrips.length === 0 ? (
        <div className="card trip">
          <p>No trips added yet.</p>
        </div>
      ) : (
        upcomingTrips.map((trip) => (
          <div
            key={trip.id}
            className="card trip"
            style={{
              marginBottom: "15px",
              cursor: "pointer",
            }}
          >
            <h3 className="trip-campsite">{trip.campsite}</h3>

<p>📍 {trip.town}</p>

<p>
  📅 {formatDate(trip.arrival)} – {formatDate(trip.departure)}
</p>

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
    <h2 style={{ marginTop: "35px" }}>📖 Previous Trips</h2>

    {previousTrips.map((trip) => (
      <div
        key={trip.id}
        className="card trip"
        style={{ marginBottom: "15px", opacity: 0.75 }}
      >
        <h3 className="trip-campsite">{trip.campsite}</h3>

        <p>📍 {trip.town}</p>

        <p>
          📅 {formatDate(trip.arrival)} – {formatDate(trip.departure)}
        </p>
      </div>
    ))}
  </>
)}
      <button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/trips/new")}
      >
        ➕ Add Trip
      </button>
    </div>
  );
}

export default Trips;