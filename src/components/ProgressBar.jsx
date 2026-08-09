function ProgressBar({ completed, total }) {
  const percent = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="progress-wrapper">
      <div
        className="progress-fill"
        style={{ width: `${percent}%` }}
      />

      <p className="progress-text">
        {completed} / {total} Complete
      </p>
    </div>
  );
}

export default ProgressBar;