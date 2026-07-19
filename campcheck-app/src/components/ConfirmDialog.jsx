function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>{title}</h2>

        <p>{message}</p>

        <div className="dialog-buttons">
          <button onClick={onConfirm}>
            🔄 Reset
          </button>

          <button onClick={onCancel}>
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;