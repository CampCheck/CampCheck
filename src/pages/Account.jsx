import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useGroup } from "../auth/GroupProvider";
import { subscribeGroupMembers } from "../services/groupService";
import { deleteCampCheckAccount } from "../services/accountService";

function Account() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [members, setMembers] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");

    try {
  await deleteCampCheckAccount(user, groupId);

  setShowDeleteDialog(false);

  // Return to the welcome screen
  navigate("/");
} catch (error) {
      console.error("Failed to delete account:", error);

      if (error.code === "auth/requires-recent-login") {
        setDeleteError(
          "For security, please restart CampCheck and try deleting your account again."
        );
      } else {
        setDeleteError(
          "We couldn't delete your account. Please try again."
        );
      }

      setDeleting(false);
    }
  }

  return (
    <div
      className="shopping-page"
      style={{ paddingBottom: 140 }}
    >
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
            color: "var(--cc-text-secondary, #666)",
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
                color: "var(--cc-text-secondary, #666)",
              }}
            >
              Manage your camping group
            </p>
          </div>
        </div>
      </div>

      {/* DELETE ACCOUNT */}
      <div
        className="dashboard-card"
        style={{
          marginTop: 32,
          border: "1px solid #f1b5b5",
        }}
      >
        <h3 style={{ color: "#d32f2f" }}>
          Delete Account
        </h3>

        <p
          style={{
            marginTop: 6,
            color: "var(--cc-text-secondary, #666)",
          }}
        >
          Permanently delete your CampCheck account and
          associated account data.
        </p>

        <button
          className="delete-account-btn"
          onClick={() => {
            setDeleteError("");
            setShowDeleteDialog(true);
          }}
          disabled={deleting}
        >
          Delete My Account
        </button>
      </div>

      {/* DELETE CONFIRMATION */}
      {showDeleteDialog && (
        <div className="delete-account-overlay">
          <div className="delete-account-dialog">
            <h2>Delete your account?</h2>

            <p>
              This will permanently delete your CampCheck
              account and remove you from your camping group.
            </p>

            <p>
              Your shared camping group data will remain
              available to the other members.
            </p>

            <p>
              <strong>This action cannot be undone.</strong>
            </p>

            {deleteError && (
              <p className="delete-account-error">
                {deleteError}
              </p>
            )}

            <div className="delete-account-actions">
              <button
                className="delete-cancel-btn"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteError("");
                }}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-btn"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;