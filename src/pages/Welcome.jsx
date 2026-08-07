import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="shopping-page">
      <div className="shopping-title">
        <h1>Welcome to CampCheck</h1>
        <p>Let's get your camping group set up.</p>
      </div>

      <button
        className="save-trip-btn"
        onClick={() => navigate("/create-group")}
      >
        Create Camping Group
      </button>

      <button
        className="add-checklist-btn"
        style={{ marginTop: "16px" }}
        onClick={() => navigate("/join-group")}
      >
        Join Camping Group
      </button>
    </div>
  );
}

export default Welcome;