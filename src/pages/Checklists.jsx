import { useNavigate } from "react-router-dom";
import {
  FaCaravan,
  FaCampground,
  FaArrowRight,
  FaHome,
} from "react-icons/fa";

function Checklists() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Before Leaving Home",
      icon: <FaCaravan />,
      route: "/caravan/departure",
    },
    {
      title: "Arrival at Campsite",
      icon: <FaCampground />,
      route: "/caravan/arrival",
    },
    {
      title: "Leaving Campsite",
      icon: <FaArrowRight />,
      route: "/caravan/leaving",
    },
    {
      title: "Arrival Home",
      icon: <FaHome />,
      route: "/caravan/home",
    },
  ];

  return (
    <div className="container">
      <div className="shopping-title">
        <h1>Checklists</h1>
        <p>Select the checklist you want to use.</p>
      </div>

      {cards.map((card) => (
        <div
          key={card.title}
          className="dashboard-card"
          onClick={() => navigate(card.route)}
          style={{ cursor: "pointer", marginBottom: "15px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                color: "#39a64b",
              }}
            >
              {card.icon}
            </div>

            <div style={{ flex: 1 }}>
              <h3>{card.title}</h3>
            </div>

            <FaArrowRight color="#999" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Checklists;