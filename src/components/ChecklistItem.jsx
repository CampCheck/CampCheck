import { useState } from "react";
import {
  FaRegPenToSquare,
  FaRegTrashCan,
  FaCheck,
  FaXmark,
} from "react-icons/fa6";

function ChecklistItem({
  checked,
  text,
  isCustom,
  onToggle,
  onEdit,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  function save() {
    if (!value.trim()) return;

    onEdit(text, value.trim());
    setEditing(false);
  }

  function cancel() {
    setValue(text);
    setEditing(false);
  }

  return (
    <div className="checklist-item">
      <label className="checklist-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
        />

        {editing ? (
          <input
            className="edit-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
            }}
            autoFocus
          />
        ) : (
          <span>{text}</span>
        )}
      </label>

      <div className="checklist-actions">
        {editing ? (
          <>
            <button className="save-btn" onClick={save}>
              <FaCheck />
            </button>

            <button className="cancel-btn" onClick={cancel}>
              <FaXmark />
            </button>
          </>
        ) : (
          <>
            <button
  className="edit-btn"
  onClick={() => {
    if (!isCustom) {
      alert("Default checklist items can't be edited.");
      return;
    }

    setEditing(true);
  }}
>
  <FaRegPenToSquare />
</button>

            {isCustom && (
  <button
    className="delete-btn"
    onClick={onDelete}
  >
    <FaRegTrashCan />
  </button>
)}
          </>
        )}
      </div>
    </div>
  );
}

export default ChecklistItem;