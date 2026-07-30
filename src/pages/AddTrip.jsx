import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddTrip() {
  const navigate = useNavigate();
const { id } = useParams();
  const [campsite, setCampsite] = useState("");
  const [town, setTown] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
useEffect(() => {
  if (!id) return;

  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  const trip = trips.find((t) => t.id === Number(id));

  if (!trip) return;

  setCampsite(trip.campsite);
  setTown(trip.town);
  setArrival(trip.arrival);
  setDeparture(trip.departure);
}, [id]);
  function saveTrip() {
    if (!campsite || !arrival) {
      alert("Please enter a campsite and arrival date.");
      return;
    }

    const trips = JSON.parse(localStorage.getItem("trips")) || [];

if (id) {
  const index = trips.findIndex((trip) => trip.id === Number(id));

 trips[index] = {
  ...trips[index],
  campsite,
  town,
  arrival,
  departure,
};
} else {
 trips.push({
  id: Date.now(),
  created: new Date().toISOString(),
  campsite,
  town,
  arrival,
  departure,
});
}

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