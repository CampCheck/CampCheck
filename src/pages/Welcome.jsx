import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState("");

  function continueToCreate() {
    const name = displayName.trim();

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    navigate("/create-group", {
      state: { displayName: name },
    });
  }

  function continueToJoin() {
    const name = displayName.trim();

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    navigate("/join-group", {
      state: { displayName: name },
    });
  }

  return (
    <div className="shopping-page">
      <div className="shopping-title">
        <h1>Welcome to CampCheck</h1>
        <p>Let's get your camping group set up.</p>
      </div>

      <div className="dashboard-card">
        <h3>What's your name?</h3>

        <input
          className="edit-input"
          type="text"
          placeholder="Enter your name"
          value={displayName}
          onChange={(event) =>
            setDisplayName(event.target.value)
          }
          maxLength={40}
        />
      </div>

      <button
        className="save-trip-btn"
        onClick={continueToCreate}
      >
        Create Camping Group
      </button>

      <button
        className="add-checklist-btn"
        style={{ marginTop: "16px" }}
        onClick={continueToJoin}
      >
        Join Camping Group
      </button>
    </div>
  );
}

export default Welcome;