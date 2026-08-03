import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function DashboardCard({
  title,
  icon,
  completed,
  total,
  link,
}) {
  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  let status = "Not Started";

  if (completed === total && total > 0) {
    status = "Complete";
  } else if (completed > 0) {
    status = "In Progress";
  }

  return (
    <div className="dashboard-card">

      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">{icon}</span>
          <h2>{title}</h2>
        </div>

        <span className="card-count">
          {completed}/{total}
        </span>
      </div>

      <div className="card-progress">
        <div
          className="card-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="card-footer">

        <span className="card-status">
          {status}
        </span>

        {link && (
          <Link to={link}>
            <button className="open-btn">
              Open Checklist <FaArrowRight />
            </button>
          </Link>
        )}

      </div>

    </div>
  );
}

export default DashboardCard;