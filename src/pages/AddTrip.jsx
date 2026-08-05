import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTrip, addTrip, updateTrip } from "../firebase/trips";

function AddTrip() {
  const navigate = useNavigate();
const { id } = useParams();
  const [campsite, setCampsite] = useState("");
  const [town, setTown] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const departureRef = useRef(null);
useEffect(() => {
  if (!id) return;

  let cancelled = false;

  getTrip(id).then((trip) => {
    if (cancelled || !trip) return;

    setCampsite(trip.campsite ?? "");
    setTown(trip.town ?? "");
    setArrival(trip.arrival ?? "");
    setDeparture(trip.departure ?? "");
  });

  return () => {
    cancelled = true;
  };
}, [id]);
  async function saveTrip() {
    console.log("Save button clicked");
    if (!campsite || !arrival) {
      alert("Please enter a campsite and arrival date.");
      return;
    }

    const tripData = {
      campsite,
      town,
      arrival,
      departure,
    };

    try {
      if (id) {
        await updateTrip(id, tripData);
      } else {
        await addTrip({
          ...tripData,
          created: new Date().toISOString(),
        });
      }

      navigate("/trips");
    } catch (error) {
      console.error(error);
      alert("Failed to save trip. Please try again.");
    }
  }

  return (
    <div className="container">
      <div className="shopping-title">
  <h1>{id ? "✏️ Edit Trip" : "🚐 New Trip"}</h1>
  <p>Plan your next adventure</p>
</div>

<div className="card" style={{ padding: "20px" }}></div>

      <label className="form-label">Campsite</label>
      <input
        placeholder="Park Cliffe Caravan Estate"
        value={campsite}
        onChange={(e) => setCampsite(e.target.value)}
      />

      <label className="form-label">Town / City</label>
      <input
        placeholder="Windermere"
        value={town}
        onChange={(e) => setTown(e.target.value)}
      />

      <label className="form-label">Arrival Date</label>
      <input
  type="date"
  value={arrival}
  onChange={(e) => {
    setArrival(e.target.value);

    setTimeout(() => {
      departureRef.current?.focus();
      departureRef.current?.showPicker?.();
    }, 100);
  }}
/>

      <label className="form-label">Departure Date</label>
      <input
  ref={departureRef}
  type="date"
  value={departure}
  onChange={(e) => setDeparture(e.target.value)}
/>

      <button
  className="save-trip-btn"
  onClick={saveTrip}
>
  💾 {id ? "Update Trip" : "Save Trip"}
</button>
    </div>
  );
}

export default AddTrip;