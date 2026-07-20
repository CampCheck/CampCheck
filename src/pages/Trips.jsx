import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Trips() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [town, setTown] = useState("");
  const [campsite, setCampsite] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nextTrip"));

    if (saved) {
      setDestination(saved.destination || "");
      setTown(saved.town || "");
      setCampsite(saved.campsite || "");
      setArrival(saved.arrival || "");
      setDeparture(saved.departure || "");
    }
  }, []);

  function saveTrip() {
    const trip = {
      destination,
      town,
      campsite,
      arrival,
      departure,
    };

    localStorage.setItem("nextTrip", JSON.stringify(trip));

    alert("✅ Trip saved!");

    navigate("/");
  }

  function deleteTrip() {
    if (!window.confirm("Delete your saved trip?")) return;

    localStorage.removeItem("nextTrip");

    setDestination("");
    setTown("");
    setCampsite("");
    setArrival("");
    setDeparture("");

    alert("🗑 Trip deleted!");

    navigate("/");
  }

  return (
    <div className="container">
      <h2>🏕️ Next Trip</h2>

      <p>Plan your next camping adventure.</p>

      <label>Holiday Destination</label>
      <input
        type="text"
        placeholder="Lake District"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <label>Town / City (used for weather)</label>
      <input
        type="text"
        placeholder="Stourport-on-Severn"
        value={town}
        onChange={(e) => setTown(e.target.value)}
      />

      <label>Campsite</label>
      <input
        type="text"
        placeholder="Lickhill Manor Caravan Park"
        value={campsite}
        onChange={(e) => setCampsite(e.target.value)}
      />

      <label>Arrival Date</label>
      <input
        type="date"
        value={arrival}
        onChange={(e) => setArrival(e.target.value)}
      />

      <label>Departure Date</label>
      <input
        type="date"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button onClick={saveTrip}>
          💾 Save Trip
        </button>

        <button
          onClick={deleteTrip}
          style={{
            background: "#b00020",
          }}
        >
          🗑 Delete Trip
        </button>
      </div>
    </div>
  );
}

export default Trips;