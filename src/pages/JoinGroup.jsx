import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import {
  joinCampingGroup,
  updateMemberName,
} from "../services/groupService";

function JoinGroup() {
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const displayName = location.state?.displayName || "";

  async function handleJoinGroup() {
    if (!inviteCode.trim()) {
      alert("Please enter an invite code.");
      return;
    }

    if (!displayName) {
      alert("Please go back and enter your name.");
      return;
    }

    setJoining(true);

    try {
      const groupId = await joinCampingGroup(
        user,
        inviteCode
      );

      await updateMemberName(
        groupId,
        user.uid,
        displayName
      );

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error.message === "INVALID_INVITE_CODE"
          ? "That invite code was not found."
          : "Unable to join this camping group."
      );
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="shopping-page">
      <div className="shopping-title">
        <h1>Join Camping Group</h1>
        <p>Enter your invite code.</p>
      </div>

      <div className="dashboard-card">
        <label className="form-label">
          Invite Code
        </label>

        <input
          className="edit-input"
          value={inviteCode}
          onChange={(e) =>
            setInviteCode(
              e.target.value.toUpperCase()
            )
          }
          placeholder="AB12CD"
        />

        <button
          className="save-trip-btn"
          style={{ marginTop: 24 }}
          onClick={handleJoinGroup}
          disabled={joining}
        >
          {joining ? "Joining..." : "Join Group"}
        </button>
      </div>
    </div>
  );
}

export default JoinGroup;