import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { useAuth } from "../auth/AuthProvider";
import { useGroup } from "../auth/GroupProvider";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  campingStyles,
  getCampingStyle,
} from "../campingStyles";
import {
  regenerateInviteCode,
  removeGroupMember,
  subscribeCampingGroup,
  subscribeGroupMembers,
  updateCampingStyle,
  leaveCampingGroup,
} from "../services/groupService";

function CampingGroup() {
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [qrCode, setQrCode] = useState("");
  const [transferTarget, setTransferTarget] = useState("");

  const { user } = useAuth();
  const { groupId, campingStyle } = useGroup();

  const style = getCampingStyle(campingStyle);

  const isOwner = user?.uid === group?.owner;

  useEffect(() => {
    if (!groupId) return undefined;

    const stopGroup = subscribeCampingGroup(
      groupId,
      setGroup,
      console.error
    );

    const stopMembers = subscribeGroupMembers(
      groupId,
      setMembers,
      console.error
    );

    return () => {
      stopGroup();
      stopMembers();
    };
  }, [groupId]);

  useEffect(() => {
    if (!group?.inviteCode) return undefined;

    QRCode.toDataURL(
      `CampCheck invite: ${group.inviteCode}`,
      {
        width: 180,
        margin: 1,
      }
    )
      .then(setQrCode)
      .catch(console.error);

    return undefined;
  }, [group?.inviteCode]);

  async function copyInviteCode() {
    try {
      await navigator.clipboard.writeText(
        group.inviteCode
      );

      alert("Invite code copied.");
    } catch {
      alert(`Invite code: ${group.inviteCode}`);
    }
  }

  async function shareInviteCode() {
    const text =
      `Join my CampCheck camping group with invite code: ` +
      group.inviteCode;

    if (navigator.share) {
      await navigator.share({
        title: "CampCheck invite",
        text,
      });
    } else {
      await copyInviteCode();
    }
  }

  async function changeStyle(event) {
    try {
      await updateCampingStyle(
        groupId,
        event.target.value
      );
    } catch (error) {
      console.error(error);
      alert("Unable to change camping style.");
    }
  }

  async function regenerateCode() {
    if (
      !window.confirm(
        "Generate a new invite code? Existing codes will stop working."
      )
    ) {
      return;
    }

    try {
      await regenerateInviteCode(groupId);
    } catch (error) {
      console.error(error);
      alert(
        "Unable to generate a new invite code."
      );
    }
  }

  async function removeMember(member) {
    if (
      member.uid === user.uid ||
      !window.confirm(
        "Remove this member from the camping group?"
      )
    ) {
      return;
    }

    try {
      await removeGroupMember(
        groupId,
        member.uid
      );
    } catch (error) {
      console.error(error);
      alert(
        "Unable to remove this member."
      );
    }
  }

  function memberStatus(member) {
    const lastSeen = member.lastSeen?.toDate?.();

    const online =
      member.online &&
      lastSeen &&
      Date.now() - lastSeen.getTime() < 180000;

    return online
      ? "Online"
      : lastSeen
      ? `Last seen ${lastSeen.toLocaleDateString(
          "en-GB"
        )}`
      : "Offline";
  }
async function transferOwnership() {
  if (!transferTarget) {
    alert("Please select a member.");
    return;
  }

  const member = members.find(
    (item) => item.uid === transferTarget
  );

  if (!member) return;

  if (
    !window.confirm(
      `Transfer ownership of this camping group to ${
        member.displayName || "this member"
      }?\n\nYou will become a normal member of the group.`
    )
  ) {
    return;
  }

  try {
    await transferGroupOwnership(
      groupId,
      transferTarget
    );

    setTransferTarget("");

    alert("Group ownership transferred.");
  } catch (error) {
    console.error(error);
    alert("Unable to transfer group ownership.");
  }
}


async function leaveGroup() {
  if (
    !window.confirm(
      "Are you sure you want to leave this camping group?\n\nYou will need a new invite code to join it again."
    )
  ) {
    return;
  }

  try {
    await leaveCampingGroup(
      groupId,
      user.uid
    );

    navigate("/settings");
  } catch (error) {
    console.error(error);
    alert("Unable to leave the camping group.");
  }
}
  return (
    <div className="shopping-page">
      <div className="shopping-title">
        <h1>Camping Group</h1>
        <p>Manage your camping group.</p>
      </div>

      {/* BACK */}
      <button
        className="untick"
        onClick={() => navigate("/settings")}
        style={{ marginBottom: 12 }}
      >
        ← Back to Settings
      </button>

      {/* GROUP */}
      <div
        className="dashboard-card"
        style={{ marginBottom: 12 }}
      >
        <h3>
          {group?.name || "Camping Group"}
        </h3>

        <p
          style={{
            marginTop: 4,
            color: "#666",
          }}
        >
          Camping style: {style.label}
        </p>

        <p
          style={{
            marginTop: 4,
            color: "#666",
          }}
        >
          Invite code:{" "}
          {group?.inviteCode || "Loading..."}
        </p>

        {qrCode && (
          <img
            src={qrCode}
            alt="Camping group invite QR code"
            style={{
              display: "block",
              width: 180,
              margin: "16px 0",
            }}
          />
        )}

        <button
          className="add-checklist-btn"
          onClick={copyInviteCode}
        >
          Copy Invite Code
        </button>

        <button
          className="add-checklist-btn"
          onClick={shareInviteCode}
        >
          Share Invite
        </button>

        <button
          className="untick"
          onClick={() =>
            alert(
              "QR scanning will be available in a future update."
            )
          }
        >
          Scan QR Code
        </button>
      </div>

      {/* MEMBERS */}
      <div
        className="dashboard-card"
        style={{ marginBottom: 12 }}
      >
        <h3>Members</h3>

        {members.map((member) => (
          <div
            key={member.uid}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              gap: 8,
              marginTop: 12,
            }}
          >
            <p>
              {member.online
                ? "🟢"
                : "⚪"}{" "}
              {member.displayName ||
                `Member ${member.uid.slice(
                  0,
                  8
                )}`}{" "}
              (
              {member.uid ===
                group?.owner ||
              member.uid ===
                group?.createdBy
                ? "Owner"
                : member.role === "admin"
                ? "Admin"
                : "Member"}
              )
              <br />

              <small>
                {memberStatus(member)} ·
                Joined{" "}
                {member.joinedAt
                  ?.toDate?.()
                  .toLocaleDateString(
                    "en-GB"
                  ) || "recently"}
              </small>
            </p>

            {isOwner &&
              member.uid !== user.uid && (
                <button
  className="delete-btn"
  onClick={() => removeMember(member)}
  aria-label={`Remove ${member.displayName || "member"}`}
>
  <FaRegTrashCan />
</button>
              )}
          </div>
        ))}
      </div>

      {/* OWNER SETTINGS */}
      {isOwner && (
        <div
          className="dashboard-card"
          style={{ marginBottom: 12 }}
        >
          <h3>Camping Style</h3>

          <select
            className="edit-input"
            value={campingStyle}
            onChange={changeStyle}
            style={{ marginTop: 12 }}
          >
            {Object.keys(campingStyles).map(
              (name) => (
                <option
                  key={name}
                  value={name}
                >
                  {name}
                </option>
              )
            )}
          </select>

          <button
            className="add-checklist-btn"
            onClick={regenerateCode}
            style={{ marginTop: 12 }}
          >
            Regenerate Invite Code
          </button>
        </div>
      )}

      {/* OTHER GROUP OPTIONS */}
      {isOwner && (
  <div
    className="dashboard-card"
    style={{ marginBottom: 12 }}
  >
    <h3>Transfer Ownership</h3>

    <p
      style={{
        marginTop: 4,
        color: "#666",
      }}
    >
      Transfer ownership of this camping group to another member.
    </p>

    <select
      className="edit-input"
      value={transferTarget}
      onChange={(event) =>
        setTransferTarget(event.target.value)
      }
      style={{ marginTop: 12 }}
    >
      <option value="">
        Select a member
      </option>

      {members
        .filter((member) => member.uid !== user.uid)
        .map((member) => (
          <option
            key={member.uid}
            value={member.uid}
          >
            {member.displayName || "Member"}
          </option>
        ))}
    </select>

    <button
      className="add-checklist-btn"
      onClick={transferOwnership}
      disabled={!transferTarget}
      style={{ marginTop: 12 }}
    >
      Transfer Ownership
    </button>
  </div>
)}
{/* LEAVE GROUP */}
{!isOwner && (
  <div
    className="dashboard-card"
    style={{
      marginBottom: 12,
      cursor: "pointer",
    }}
    onClick={leaveGroup}
  >
    <h3 style={{ color: "#d32f2f" }}>
      Leave Group
    </h3>

    <p
      style={{
        marginTop: 4,
        color: "#666",
      }}
    >
      Leave this camping group
    </p>
  </div>
)}

      {isOwner && (
        <div
          className="dashboard-card"
          style={{ marginBottom: 12 }}
          onClick={() =>
            window.confirm(
              "Deleting groups is not available yet."
            )
          }
        >
          <h3 style={{ color: "#d32f2f" }}>
            Delete Group
          </h3>

          <p
            style={{
              marginTop: 4,
              color: "#666",
            }}
          >
            Coming soon — confirmation required
          </p>
        </div>
      )}

      
</div>
  );
}

export default CampingGroup;