function ChecklistItem({ checked, text, onToggle }) {
  return (
    <div className={`checklist-item ${checked ? "checked" : ""}`}>
      <input
        id={text}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
      />

      <label htmlFor={text}>
        {text}
      </label>
    </div>
  );
}

export default ChecklistItem;