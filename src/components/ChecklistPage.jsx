import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import ProgressBar from "./ProgressBar";
import ChecklistItem from "./ChecklistItem";

function ChecklistPage({ title, storageKey, items, backLink }) {
  const defaultChecks = Object.fromEntries(
    items.map((item) => [item, false])
  );

  const [checks, setChecks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultChecks;
  });

  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checks));
  }, [checks, storageKey]);

  function toggle(item) {
    setChecks((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  }

  function resetChecklist() {
    setChecks(defaultChecks);
    setShowResetDialog(false);
  }

  const completed = items.filter((item) => checks[item]).length;
  const total = items.length;

  return (
    <div className="container">
      <h1>{title}</h1>

      <ProgressBar completed={completed} total={total} />

      {items.map((item) => (
        <ChecklistItem
          key={item}
          checked={checks[item]}
          text={item}
          onToggle={() => toggle(item)}
        />
      ))}

      <br />

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowResetDialog(true)}>
          🔄 Reset Checklist
        </button>

        <br />
        <br />

        <Link to={backLink}>
          <button>⬅️ Back</button>
        </Link>
      </div>

      <ConfirmDialog
        open={showResetDialog}
        title="🚐 CampCheck"
        message="Are you sure you want to reset this checklist? This will untick every item."
        onConfirm={resetChecklist}
        onCancel={() => setShowResetDialog(false)}
      />
    </div>
  );
}

export default ChecklistPage;