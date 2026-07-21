import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTrip() {
  const navigate = useNavigate();

  const [campsite, setCampsite] = useState("");
  const [town, setTown] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  function saveTrip() {
    if (!campsite || !arrival) {
      alert("Please enter a campsite and arrival date.");
      return;
    }

    const trips = JSON.parse(localStorage.getItem("trips")) || [];

    trips.push({
      id: Date.now(),
      campsite,
      town,
      arrival,
      departure,
    });

    trips.sort((a, b) => new Date(a.arrival) - new Date(b.arrival));

    localStorage.setItem("trips", JSON.stringify(trips));

    navigate("/trips");
  }

  return (
    <div className="container">
      <h2>➕ Add Trip</h2>

      <label>Campsite</label>
      <input
        placeholder="Park Cliffe Caravan Estate"
        value={campsite}
        onChange={(e) => setCampsite(e.target.value)}
      />

      <label>Town / City</label>
      <input
        placeholder="Windermere"
        value={town}
        onChange={(e) => setTown(e.target.value)}
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

      <button
        onClick={saveTrip}
        style={{ marginTop: "20px" }}
      >
        💾 Save Trip
      </button>
    </div>
  );
}

export default AddTrip;