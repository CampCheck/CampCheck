import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet } from "react-modal-sheet";
import { useAuth } from "../auth/AuthProvider";
import { useGroup } from "../auth/GroupProvider";
import { subscribeGroupMembers } from "../services/groupService";
import { useTheme } from "../theme/ThemeProvider";

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
          <h3
            style={{
              color: danger ? "#d32f2f" : undefined,
            }}
          >
            {title}
          </h3>

          {subtitle && (
            <p
              style={{
                marginTop: 4,
                color: danger ? "#d32f2f" : "#666",
              }}
            >
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
  const [showAppearance, setShowAppearance] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [members, setMembers] = useState([]);

  const { user } = useAuth();
  const { groupId } = useGroup();
  const { theme, setTheme } = useTheme();

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

  function getAppearanceLabel() {
    if (theme === "dark") return "Dark Theme";
    if (theme === "system") return "System Default";
    return "Light Theme";
  }

  function selectTheme(value) {
    setTheme(value);
    setShowAppearance(false);
  }

  return (
    <div>
      <h1>Settings</h1>

      <p style={{ marginBottom: 20 }}>
        Manage your CampCheck preferences.
      </p>

      {/* ACCOUNT */}
      <SettingRow
        title="Account"
        subtitle={displayName || "Anonymous account"}
        onClick={() => navigate("/settings/account")}
      />

      {/* APPEARANCE */}
      <SettingRow
        title="Appearance"
        subtitle={getAppearanceLabel()}
        onClick={() => setShowAppearance(true)}
      />

      {/* UNITS */}
      <SettingRow
        title="Units"
        subtitle="Miles · KG"
        onClick={() => setShowUnits(true)}
      />

      {/* OTHER SETTINGS */}
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
          onClick={(event) => event.stopPropagation()}
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

      {/* APPEARANCE SHEET */}
      <Sheet
        isOpen={showAppearance}
        onClose={() => setShowAppearance(false)}
        detent="content-height"
      >
        <Sheet.Container>
          <Sheet.Header />

          <Sheet.Content>
            <div
              style={{
                padding: 20,
              }}
            >
              <h2>Appearance</h2>

              <p
                style={{
                  marginTop: 6,
                  color: "var(--cc-text-secondary, #666)",
                }}
              >
                Choose how CampCheck looks.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <button
                  className="add-checklist-btn"
                  onClick={() => selectTheme("light")}
                  style={{
                    opacity: theme === "light" ? 1 : 0.7,
                    outline:
                      theme === "light"
                        ? "3px solid rgba(0, 150, 100, 0.25)"
                        : "none",
                  }}
                >
                  ☀️ Light
                </button>

                <button
                  className="add-checklist-btn"
                  onClick={() => selectTheme("dark")}
                  style={{
                    opacity: theme === "dark" ? 1 : 0.7,
                    outline:
                      theme === "dark"
                        ? "3px solid rgba(0, 150, 100, 0.25)"
                        : "none",
                  }}
                >
                  🌙 Dark
                </button>

                <button
                  className="add-checklist-btn"
                  onClick={() => selectTheme("system")}
                  style={{
                    opacity: theme === "system" ? 1 : 0.7,
                    outline:
                      theme === "system"
                        ? "3px solid rgba(0, 150, 100, 0.25)"
                        : "none",
                  }}
                >
                  ⚙️ System Default
                </button>
              </div>

              <button
                className="save-trip-btn"
                style={{
                  marginTop: 20,
                }}
                onClick={() => setShowAppearance(false)}
              >
                Done
              </button>
            </div>
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop />
      </Sheet>

      {/* UNITS SHEET */}
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
                onClick={() => setShowUnits(false)}
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