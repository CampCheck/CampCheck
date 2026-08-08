import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet } from "react-modal-sheet";
import { useAuth } from "../auth/AuthProvider";
import { useGroup } from "../auth/GroupProvider";
import { subscribeGroupMembers } from "../services/groupService";

function SettingRow({ title, subtitle, danger = false, onClick }) {
  return (
    <div
      className="dashboard-card"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
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
          <h3 style={{ color: danger ? "#d32f2f" : undefined }}>
            {title}
          </h3>

          {subtitle && (
            <p style={{ marginTop: 4, color: "#666" }}>
              {subtitle}
            </p>
          )}
        </div>

        
      </div>
    </div>
  );
}

function Settings() {
  const navigate = useNavigate();

  const [showUnits, setShowUnits] = useState(false);
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
        <h1>Settings</h1>
        <p>Manage your CampCheck preferences.</p>
      </div>

      {/* ACCOUNT */}
      <SettingRow
  title="Account"
  subtitle={displayName || "Anonymous account"}
  onClick={() => navigate("/settings/account")}
/>

      

      {/* OTHER SETTINGS */}
      <SettingRow
        title="Appearance"
        subtitle="Light Theme"
      />

      <SettingRow
        title="Units"
        subtitle="Miles · KG"
        onClick={() => setShowUnits(true)}
      />

      <SettingRow
        title="Notifications"
        subtitle="Trip, shopping and checklist reminders"
      />

      <SettingRow
        title="Backup & Sync"
        subtitle="Cloud sync"
      />

      <SettingRow title="Rate CampCheck" />

      <SettingRow title="Report a Bug" />

      <SettingRow title="Privacy Policy" />

      {/* RESET AT THE VERY BOTTOM */}
      <details
        className="dashboard-card settings-reset-card"
        style={{
          marginTop: 32,
          cursor: "pointer",
        }}
      >
        <summary
          style={{
            listStyle: "none",
            cursor: "pointer",
          }}
        >
          <h3 style={{ color: "#333" }}>
            Reset
          </h3>

          <p
            style={{
              marginTop: 4,
              color: "#777",
            }}
          >
            Reset or delete CampCheck data
          </p>
        </summary>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <SettingRow
            title="Reset Shopping List"
            danger
          />

          <SettingRow
            title="Reset Checklists"
            danger
          />

          <SettingRow
            title="Delete All Trips"
            danger
          />

          <SettingRow
            title="Delete All Garage Vehicles"
            danger
          />

          <SettingRow
            title="Reset Entire App"
            danger
          />
        </div>
      </details>

      {/* UNITS */}
      <Sheet
  isOpen={showUnits}
  onClose={() => setShowUnits(false)}
  detent="content-height"
>
        <Sheet.Container>
          <Sheet.Header />

          <Sheet.Content>
            <div style={{ padding: 20 }}>
              <h2>Units</h2>

              <h3 style={{ marginTop: 20 }}>
                Distance
              </h3>

              <label>
                <input
                  type="radio"
                  name="distance"
                  defaultChecked
                />{" "}
                Miles
              </label>

              <br />

              <label>
                <input
                  type="radio"
                  name="distance"
                />{" "}
                Kilometres
              </label>

              <h3 style={{ marginTop: 25 }}>
                Weight
              </h3>

              <label>
                <input
                  type="radio"
                  name="weight"
                  defaultChecked
                />{" "}
                KG
              </label>

              <br />

              <label>
                <input
                  type="radio"
                  name="weight"
                />{" "}
                LB
              </label>

              <button
                className="save-trip-btn"
                style={{ marginTop: 30 }}
                onClick={() =>
                  setShowUnits(false)
                }
              >
                Save
              </button>
            </div>
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
}

export default Settings;