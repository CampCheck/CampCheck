import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { createCampingGroup } from "../services/groupService";
import { campingStyles } from "../campingStyles";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [campingStyle, setCampingStyle] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleCreateGroup() {
    if (!groupName || !campingStyle) {
      alert("Please complete all fields.");
      return;
    }

    try {
      await createCampingGroup(
        user,
        groupName,
        campingStyle
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create camping group.");
    }
  }

  return (
    <div className="container">
      <div className="shopping-title">
        <h1>Create Camping Group</h1>
        <p>Let's get your camping group set up.</p>
      </div>

      <div className="dashboard-card">
        <label className="form-label">
          Camping Group Name
        </label>

        <input
          className="edit-input"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g. The Owen Family"
        />

        <label
          className="form-label"
          style={{ marginTop: 20 }}
        >
          Camping Style
        </label>

        {Object.values(campingStyles).map((style) => (
          <button
            key={style.id}
            className={`add-checklist-btn ${campingStyle === style.id ? "selected" : ""}`}
            onClick={() => setCampingStyle(style.id)}
          >
            {style.icons.departure} {style.label}
          </button>
        ))}

        <button
          className="save-trip-btn"
          style={{ marginTop: 24 }}
          onClick={handleCreateGroup}
        >
          Create Camping Group
        </button>
      </div>
    </div>
  );
}

export default CreateGroup;
