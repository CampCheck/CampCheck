import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useGroup } from "../auth/GroupProvider";
import { subscribeGroupMembers } from "../services/groupService";

function Account() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [members, setMembers] = useState([]);

  const { user } = useAuth();
  const { groupId } = useGroup();

  useEffect(() => {
    if (!groupId) return undefined;

    const stopMembers = subscribeGroupMembers(
      groupId,
      setMembers,
      console.error
    );

    return () => stopMembers();
  }, [groupId]);

  useEffect(() => {
    const currentMember = members.find(
      (member) => member.uid === user?.uid
    );

    if (currentMember?.displayName) {
      setDisplayName(currentMember.displayName);
    }
  }, [members, user]);

  return (
    <div className="shopping-page">
      <div className="shopping-title">
        <h1>Account</h1>
        <p>Manage your account.</p>
      </div>

      {/* ACCOUNT NAME */}
      <div
        className="dashboard-card"
        style={{ marginBottom: 12 }}
      >
        <h3>Your Name</h3>

        <p
          style={{
            marginTop: 4,
            color: "#666",
          }}
        >
          {displayName || "Anonymous account"}
        </p>
      </div>

      {/* CAMPING GROUP */}
      <div
        className="dashboard-card"
        onClick={() =>
          navigate("/settings/camping-group")
        }
        style={{
          cursor: "pointer",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3>Camping Group</h3>

            <p
              style={{
                marginTop: 4,
                color: "#666",
              }}
            >
              Manage your camping group
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Account;