import { FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Sheet } from "react-modal-sheet";
import { useGroup } from "../auth/GroupProvider";
import { subscribeCampingGroup, subscribeGroupMembers } from "../services/groupService";

function SettingRow({ title, subtitle, danger = false, onClick }) {
  return (
    <div
      className="dashboard-card"
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginBottom: "12px",
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
            <p
              style={{
                marginTop: "4px",
                color: "#666",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <FaChevronRight color="#999" />
      </div>
    </div>
  );
}

function Settings() {
  const [showUnits, setShowUnits] = useState(false);
  const { groupId } = useGroup();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!groupId) return undefined;
    const unsubscribeGroup = subscribeCampingGroup(groupId, setGroup, console.error);
    const unsubscribeMembers = subscribeGroupMembers(groupId, setMembers, console.error);
    return () => {
      unsubscribeGroup();
      unsubscribeMembers();
    };
  }, [groupId]);

  return (
    <div className="shopping-page">
      <div className="shopping-title">
        <h1>Settings</h1>
        <p>Manage your CampCheck preferences.</p>
      </div>

      <SettingRow
        title="Account"
        subtitle="Anonymous account"
      />

      <div style={{ marginTop: "32px", marginBottom: "12px" }}>
        <h2>Camping Group</h2>
      </div>

      <div className="dashboard-card" style={{ marginBottom: "12px" }}>
        <h3>{group?.name || "Camping Group"}</h3>
        <p style={{ marginTop: "4px", color: "#666" }}>Invite code: {group?.inviteCode || "Loading..."}</p>
        <p style={{ marginTop: "12px", color: "#666" }}>Members</p>
        {members.map((member) => (
          <p key={member.uid} style={{ marginTop: "4px" }}>
            {member.uid.slice(0, 8)}… — {member.uid === group?.owner || member.uid === group?.createdBy ? "Owner" : member.role === "admin" ? "Admin" : "Member"}
          </p>
        ))}
      </div>

      <SettingRow title="Invite Member" subtitle="Coming soon" />
      <SettingRow title="Leave Group" subtitle="Coming soon" />
      <SettingRow title="Transfer Ownership" subtitle="Coming soon" />

      <SettingRow
        title="Appearance"
        subtitle="Light Theme"
      />

      <SettingRow
        title="Units"
        subtitle="Miles • KG"
        onClick={() => setShowUnits(true)}
      />

      <SettingRow
        title="Notifications"
        subtitle="Trip reminders & alerts"
      />

      <SettingRow
        title="Backup & Sync"
        subtitle="Cloud sync"
      />

      <SettingRow title="Rate CampCheck" />

      <SettingRow title="Report a Bug" />

      <SettingRow title="Contact Us" />

      <SettingRow title="Privacy Policy" />
           <div
        style={{
          marginTop: "32px",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ color: "#d32f2f" }}>
          Danger Zone
        </h2>
      </div>

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

      <Sheet
        isOpen={showUnits}
        onClose={() => setShowUnits(false)}
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
                />
                {" "}Miles
              </label>

              <br />

              <label>
                <input
                  type="radio"
                  name="distance"
                />
                {" "}Kilometres
              </label>

              <h3 style={{ marginTop: 25 }}>
                Weight
              </h3>

              <label>
                <input
                  type="radio"
                  name="weight"
                  defaultChecked
                />
                {" "}KG
              </label>

              <br />

              <label>
                <input
                  type="radio"
                  name="weight"
                />
                {" "}LB
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
