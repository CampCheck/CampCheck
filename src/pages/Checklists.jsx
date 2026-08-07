import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useGroup } from "../auth/GroupProvider";
import { getCampingStyle } from "../campingStyles";

const checklistRoutes = {
  departure: "/caravan/departure",
  arrival: "/caravan/arrival",
  leaving: "/caravan/leaving",
  arrivalHome: "/caravan/home",
};

function Checklists() {
  const navigate = useNavigate();
  const { campingStyle } = useGroup();
  const style = getCampingStyle(campingStyle);

  return (
    <div className="container">
      <div className="shopping-title">
        <h1>Checklists</h1>
        <p>Select the checklist you want to use.</p>
      </div>
      {Object.entries(style.checklists).map(([key, checklist]) => (
        <div key={key} className="dashboard-card" onClick={() => navigate(checklistRoutes[key])} style={{ cursor: "pointer", marginBottom: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ fontSize: "28px", color: "#39a64b" }}>{style.icons?.[key] || "✓"}</div>
            <div style={{ flex: 1 }}><h3>{checklist.title}</h3></div>
            <FaArrowRight color="#999" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Checklists;
