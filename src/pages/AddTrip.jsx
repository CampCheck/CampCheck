import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTrip, addTrip, updateTrip } from "../firebase/trips";
import { useGroup } from "../auth/GroupProvider";

function AddTrip() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { groupId } = useGroup();

  const [campsite, setCampsite] = useState("");
  const [town, setTown] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  const departureRef = useRef(null);

  useEffect(() => {
    if (!id || !groupId) return;

    let cancelled = false;

    async function loadTrip() {
      const trip = await getTrip(groupId, id);

      if (cancelled || !trip) return;

      setCampsite(trip.campsite ?? "");
      setTown(trip.town ?? "");
      setArrival(trip.arrival ?? "");
      setDeparture(trip.departure ?? "");
    }

    loadTrip();

    return () => {
      cancelled = true;
    };
  }, [id, groupId]);

  async function saveTrip() {
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
        await updateTrip(groupId, id, tripData);
      } else {
        await addTrip(groupId, {
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
        <h1>{id ? "Edit Trip" : "Add Trip"}</h1>
        <p>Plan your next adventure.</p>
      </div>

      <label className="form-label">Campsite</label>
      <input
        className="edit-input"
        placeholder="Park Cliffe Caravan Estate"
        value={campsite}
        onChange={(e) => setCampsite(e.target.value)}
      />

      <label className="form-label">Town / City</label>
      <input
        className="edit-input"
        placeholder="Windermere"
        value={town}
        onChange={(e) => setTown(e.target.value)}
      />

      <label className="form-label">Arrival Date</label>
      <input
        className="edit-input"
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
        className="edit-input"
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