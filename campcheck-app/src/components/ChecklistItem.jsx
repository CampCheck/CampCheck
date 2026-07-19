function ChecklistItem({ checked, text, onToggle }) {
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
      />
      {text}
    </label>
  );
}

export default ChecklistItem;