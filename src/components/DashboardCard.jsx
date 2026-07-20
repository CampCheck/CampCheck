import { Link } from "react-router-dom";

function DashboardCard({
  title,
  icon,
  completed,
  total,
  link,
}) {
  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  let status = "⚪ Not Started";

  if (completed === total && total > 0) {
    status = "✅ Complete";
  } else if (completed > 0) {
    status = "⏳ In Progress";
  }

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2>
          {icon} {title}
        </h2>

        <span className="card-status">
          {status}
        </span>
      </div>

      <div className="card-progress">
        <div
          className="card-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p>
        {completed} / {total} Complete
      </p>

      {link && (
        <Link to={link}>
          <button>Open</button>
        </Link>
      )}
    </div>
  );
}

export default DashboardCard;