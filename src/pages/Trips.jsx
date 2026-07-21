import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Trips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

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

  return (
    <div className="container">
      <h2>🏕️ Upcoming Trips</h2>

      <p>Your upcoming camping adventures.</p>

      {trips.length === 0 ? (
        <div className="card trip">
          <p>No trips added yet.</p>
        </div>
      ) : (
        trips.map((trip) => (
          <div
            key={trip.id}
            className="card trip"
            style={{
              marginBottom: "15px",
              cursor: "pointer",
            }}
          >
            <h3>{trip.campsite}</h3>

            <p>📍 {trip.town}</p>

            <p>
              📅 {formatDate(trip.arrival)} – {formatDate(trip.departure)}
            </p>
          </div>
        ))
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