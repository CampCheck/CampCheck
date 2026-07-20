import { useState, useEffect } from "react";

function Trips() {
  const [destination, setDestination] = useState("");
  const [campsite, setCampsite] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nextTrip"));

    if (saved) {
      setDestination(saved.destination || "");
      setCampsite(saved.campsite || "");
      setArrival(saved.arrival || "");
      setDeparture(saved.departure || "");
    }
  }, []);

  function saveTrip() {
    const trip = {
      destination,
      campsite,
      arrival,
      departure,
    };

    localStorage.setItem("nextTrip", JSON.stringify(trip));

    alert("✅ Trip saved!");
  }

  return (
    <div className="container">
      <h2>🏕️ Next Trip</h2>

      <label>Destination</label>
      <input
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <label>Campsite</label>
      <input
        type="text"
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

      <button onClick={saveTrip}>💾 Save Trip</button>
    </div>
  );
}

export default Trips;