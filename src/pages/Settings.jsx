import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Sheet } from "react-modal-sheet";
import QRCode from "qrcode";
import { useAuth } from "../auth/AuthProvider";
import { useGroup } from "../auth/GroupProvider";
import { campingStyles, getCampingStyle } from "../campingStyles";
import {
  regenerateInviteCode,
  removeGroupMember,
  subscribeCampingGroup,
  subscribeGroupMembers,
  updateCampingStyle,
} from "../services/groupService";

function SettingRow({ title, subtitle, danger = false, onClick }) {
  return <div className="dashboard-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default", marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div><h3 style={{ color: danger ? "#d32f2f" : undefined }}>{title}</h3>{subtitle && <p style={{ marginTop: 4, color: "#666" }}>{subtitle}</p>}</div>
      {onClick && <FaChevronRight color="#999" />}
    </div>
  </div>;
}

function Settings() {
  const [showUnits, setShowUnits] = useState(false);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [qrCode, setQrCode] = useState("");
  const { user } = useAuth();
  const { groupId, campingStyle } = useGroup();
  const style = getCampingStyle(campingStyle);
  const isOwner = user?.uid === group?.owner || user?.uid === group?.createdBy;

  useEffect(() => {
    if (!groupId) return undefined;
    const stopGroup = subscribeCampingGroup(groupId, setGroup, console.error);
    const stopMembers = subscribeGroupMembers(groupId, setMembers, console.error);
    return () => { stopGroup(); stopMembers(); };
  }, [groupId]);

  useEffect(() => {
    if (!group?.inviteCode) return undefined;
    QRCode.toDataURL(`CampCheck invite: ${group.inviteCode}`, { width: 180, margin: 1 }).then(setQrCode).catch(console.error);
    return undefined;
  }, [group?.inviteCode]);

  async function copyInviteCode() {
    try { await navigator.clipboard.writeText(group.inviteCode); alert("Invite code copied."); }
    catch { alert(`Invite code: ${group.inviteCode}`); }
  }

  async function shareInviteCode() {
    const text = `Join my CampCheck camping group with invite code: ${group.inviteCode}`;
    if (navigator.share) await navigator.share({ title: "CampCheck invite", text });
    else await copyInviteCode();
  }

  async function changeStyle(event) {
    try { await updateCampingStyle(groupId, event.target.value); }
    catch (error) { console.error(error); alert("Unable to change camping style."); }
  }

  async function regenerateCode() {
    if (!window.confirm("Generate a new invite code? Existing codes will stop working.")) return;
    try { await regenerateInviteCode(groupId); }
    catch (error) { console.error(error); alert("Unable to generate a new invite code."); }
  }

  async function removeMember(member) {
    if (member.uid === user.uid || !window.confirm("Remove this member from the camping group?")) return;
    try { await removeGroupMember(groupId, member.uid); }
    catch (error) { console.error(error); alert("Unable to remove this member."); }
  }

  function memberStatus(member) {
    const lastSeen = member.lastSeen?.toDate?.();
    const online = member.online && lastSeen && Date.now() - lastSeen.getTime() < 180000;
    return online ? "Online" : lastSeen ? `Last seen ${lastSeen.toLocaleDateString("en-GB")}` : "Offline";
  }

  return <div className="shopping-page">
    <div className="shopping-title"><h1>Settings</h1><p>Manage your CampCheck preferences.</p></div>
    <SettingRow title="Account" subtitle="Anonymous account" />

    <div style={{ marginTop: 32, marginBottom: 12 }}><h2>Camping Group</h2></div>
    <div className="dashboard-card" style={{ marginBottom: 12 }}>
      <h3>{group?.name || "Camping Group"}</h3>
      <p style={{ marginTop: 4, color: "#666" }}>Camping style: {style.label}</p>
      <p style={{ marginTop: 4, color: "#666" }}>Invite code: {group?.inviteCode || "Loading..."}</p>
      {qrCode && <img src={qrCode} alt="Camping group invite QR code" style={{ display: "block", width: 180, margin: "16px 0" }} />}
      <button className="add-checklist-btn" onClick={copyInviteCode}>Copy Invite Code</button>
      <button className="add-checklist-btn" onClick={shareInviteCode}>Share Invite</button>
      <button className="untick" onClick={() => alert("QR scanning will be available in a future update.")}>Scan QR Code</button>
      {isOwner && <><label className="form-label" style={{ marginTop: 16 }}>Camping Style</label><select className="edit-input" value={campingStyle} onChange={changeStyle}>{Object.keys(campingStyles).map((name) => <option key={name} value={name}>{name}</option>)}</select><button className="add-checklist-btn" onClick={regenerateCode}>Regenerate Invite Code</button></>}
      <p style={{ marginTop: 16, color: "#666" }}>Members</p>
      {members.map((member) => <div key={member.uid} style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 8 }}>
        <p>{member.online ? "🟢" : "⚪"} {member.displayName || `Member ${member.uid.slice(0, 8)}`} ({member.uid === group?.owner || member.uid === group?.createdBy ? "Owner" : member.role === "admin" ? "Admin" : "Member"})<br /><small>{memberStatus(member)} · Joined {member.joinedAt?.toDate?.().toLocaleDateString("en-GB") || "recently"}</small></p>
        {isOwner && member.uid !== user.uid && <button className="delete-btn" onClick={() => removeMember(member)}>Remove</button>}
      </div>)}
    </div>
    <SettingRow title="Invite Member" subtitle="Share your invite code above" />
    <SettingRow title="Leave Group" subtitle="Coming soon" />
    {isOwner && <SettingRow title="Transfer Ownership" subtitle="Coming soon" />}
    {isOwner && <SettingRow title="Delete Group" subtitle="Coming soon — confirmation required" danger onClick={() => window.confirm("Deleting groups is not available yet.")} />}
    <SettingRow title="Appearance" subtitle="Light Theme" />
    <SettingRow title="Units" subtitle="Miles · KG" onClick={() => setShowUnits(true)} />
    <SettingRow title="Notifications" subtitle="Trip, shopping and checklist reminders" />
    <SettingRow title="Backup & Sync" subtitle="Cloud sync" />
    <SettingRow title="Rate CampCheck" /><SettingRow title="Report a Bug" /><SettingRow title="Contact Us" /><SettingRow title="Privacy Policy" />
    <div style={{ marginTop: 32, marginBottom: 12 }}><h2 style={{ color: "#d32f2f" }}>Danger Zone</h2></div>
    <SettingRow title="Reset Shopping List" danger /><SettingRow title="Reset Checklists" danger /><SettingRow title="Delete All Trips" danger /><SettingRow title="Delete All Garage Vehicles" danger /><SettingRow title="Reset Entire App" danger />
    <Sheet isOpen={showUnits} onClose={() => setShowUnits(false)}><Sheet.Container><Sheet.Header /><Sheet.Content><div style={{ padding: 20 }}><h2>Units</h2><h3 style={{ marginTop: 20 }}>Distance</h3><label><input type="radio" name="distance" defaultChecked /> Miles</label><br /><label><input type="radio" name="distance" /> Kilometres</label><h3 style={{ marginTop: 25 }}>Weight</h3><label><input type="radio" name="weight" defaultChecked /> KG</label><br /><label><input type="radio" name="weight" /> LB</label><button className="save-trip-btn" style={{ marginTop: 30 }} onClick={() => setShowUnits(false)}>Save</button></div></Sheet.Content></Sheet.Container><Sheet.Backdrop /></Sheet>
  </div>;
}

export default Settings;
