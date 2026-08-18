import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JourneyBar from "../components/JourneyBar";
import { FaMapMarkerAlt, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { subscribeTrips, deleteTrip as deleteTripFromFirestore, updateTrip, } from "../firebase/trips";
import { resetChecklist } from "../firebase/checklists";
import {
  updateTripNotes,
  deleteTripNotes,
} from "../firebase/tripNotes";
import { useGroup } from "../auth/GroupProvider";
import { getCampingStyle } from "../campingStyles";

function Trips() {
  const navigate = useNavigate();
  const { groupId, campingStyle } = useGroup();
const style = getCampingStyle(campingStyle);
  const [trips, setTrips] = useState([]);
  const [editingNotesId, setEditingNotesId] =
  useState(null);

const [editingNotes, setEditingNotes] =
  useState("");
  const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingTrips = trips.filter(
  (trip) => new Date(trip.departure) >= today
);

const previousTrips = trips
  .filter((trip) => new Date(trip.departure) < today)
  .sort(
    (a, b) =>
      new Date(b.departure) -
      new Date(a.departure)
  );

  useEffect(() => {
  if (!groupId) return;

  return subscribeTrips(
    groupId,
    setTrips,
    console.error
  );
}, [groupId]);
useEffect(() => {
  if (!groupId || trips.length === 0) return;

  async function checkForFinishedTrip() {
    const finishedTrip = trips.find((trip) => {
      const departureDate = new Date(trip.departure);
      departureDate.setHours(0, 0, 0, 0);

      return (
        departureDate < today &&
        trip.checklistsReset !== true
      );
    });

    if (!finishedTrip) return;

    

    try {
      await Promise.all(
  Object.values(style.checklists).map(
    (checklist) =>
      resetChecklist(
        groupId,
        checklist.id
      )
  )
);

      await updateTrip(
        groupId,
        finishedTrip.id,
        {
          checklistsReset: true,
        }
      );

      
    } catch (error) {
      console.error(
        "CHECKLIST RESET FAILED:",
        error
      );
    }
  }

  checkForFinishedTrip();
}, [groupId, trips]);
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
    (tripDate - today) /
      (1000 * 60 * 60 * 24)
  );
}

async function deleteTrip(id) {
  if (!window.confirm("Delete this trip?")) return;

  try {
    await deleteTripFromFirestore(
      groupId,
      id
    );
  } catch (error) {
    console.error(error);
    alert(
      "Failed to delete trip. Please try again."
    );
  }
}

async function saveTripNotes(tripId) {
  try {
    await updateTripNotes(
      groupId,
      tripId,
      editingNotes.trim()
    );

    setEditingNotesId(null);
    setEditingNotes("");
  } catch (error) {
    console.error(error);
    alert("Failed to save trip notes.");
  }
}

async function removeTripNotes(tripId) {
  if (
    !window.confirm(
      "Delete these trip notes?\n\nThis cannot be undone."
    )
  ) {
    return;
  }

  try {
    await deleteTripNotes(
      groupId,
      tripId
    );

    setEditingNotesId(null);
    setEditingNotes("");
  } catch (error) {
    console.error(error);
    alert("Failed to delete trip notes.");
  }
}
function getJourneyPosition(days) {
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
  <>
    <div className="dashboard trips-page">
      <div className="section-header-card">
  <span className="section-title">
    Upcoming Trips
  </span>

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
  progress={getJourneyPosition(daysUntil(trip.arrival))}
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
    <div className="section-header-card past-trips-header">
  <span className="section-title">
    Past Trips
  </span>

  <span className="trip-count">
    {previousTrips.length}
  </span>
</div>

    {previousTrips.map((trip) => (
  <div
    key={trip.id}
    className="card trip previous-trip"
  >
    <h3 className="trip-campsite">
      {trip.campsite}
    </h3>

    <p>📍 {trip.town}</p>

    <p>
      📅 {formatDate(trip.arrival)} –{" "}
      {formatDate(trip.departure)}
    </p>

    {/* TRIP NOTES */}

    <div className="trip-notes">

      <div className="trip-notes-header">
        <strong>📝 Trip Notes</strong>

        {editingNotesId !== trip.id && (
  <div
    style={{
      display: "flex",
      gap: "8px",
    }}
  >
    <button
      className="trip-notes-edit-btn"
      onClick={() => {
        setEditingNotesId(trip.id);
        setEditingNotes(
          trip.notes || ""
        );
      }}
    >
      Edit
    </button>

    {trip.notes && (
      <button
  className="delete-btn"
  onClick={() =>
    removeTripNotes(trip.id)
  }
  aria-label="Delete trip notes"
>
  <FaTrash />
</button>
    )}
  </div>
)}
      </div>

      {editingNotesId === trip.id ? (

        <div className="trip-notes-editor">

          <textarea
            value={editingNotes}
            onChange={(event) =>
              setEditingNotes(
                event.target.value
              )
            }
            placeholder="Add notes about this stay..."
            autoFocus
          />

          <div className="trip-notes-buttons">

            <button
              className="trip-notes-save"
              onClick={() =>
                saveTripNotes(trip.id)
              }
            >
              Save
            </button>

            <button
              className="trip-notes-cancel"
              onClick={() => {
                setEditingNotesId(null);
                setEditingNotes("");
              }}
            >
              Cancel
            </button>

          </div>

        </div>

      ) : (

        <p className="trip-notes-text">
          {trip.notes ||
            "No notes added yet."}
        </p>

      )}

    </div>

    <div className="trip-buttons">
      <button
        onClick={() =>
          deleteTrip(trip.id)
        }
      >
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
  </>
);
}

export default Trips;
