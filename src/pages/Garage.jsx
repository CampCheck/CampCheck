import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/garage.css";
import {
  FaPlus,
  FaCar,
  FaCaravan,
  FaCampground,
  FaShuttleVan,
  FaTrash,
} from "react-icons/fa";

import {
  subscribeGarage,
  addVehicle,
  deleteVehicle,
} from "../firebase/garage";

async function removeVehicle(vehicle) {
  if (
    !window.confirm(
      `Delete "${vehicle.model || vehicle.type}"?\n\nThis cannot be undone.`
    )
  ) {
    return;
  }

  try {
    await deleteVehicle(vehicle.id);
  } catch (err) {
    console.error(err);
    alert("Failed to delete vehicle.");
  }
}
function Garage() {
  const navigate = useNavigate();

  const [showSelector, setShowSelector] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeGarage(
      setVehicles,
      console.error
    );

    return unsubscribe;
  }, []);

  function vehicleIcon(type) {
    switch (type) {
      case "Tow Car":
        return <FaCar size={28} color="#39a64b" />;
      case "Caravan":
        return <FaCaravan size={28} color="#39a64b" />;
      case "Tent":
        return <FaCampground size={28} color="#39a64b" />;
      case "Motorhome":
        return <FaShuttleVan size={28} color="#39a64b" />;
      default:
        return <FaCar size={28} color="#39a64b" />;
    }
  }

  async function createVehicle(type) {
    await addVehicle({
      type,
      manufacturer: "",
      model: `New ${type}`,
      year: "",
      created: Date.now(),
    });

    setShowSelector(false);
  }

  return (
    <div className="garage-page">
      <div className="shopping-title">
        <h1>Garage</h1>
        <p>Manage all of your camping vehicles and equipment.</p>
      </div>

      <button
        className="add-checklist-btn"
        onClick={() => setShowSelector(true)}
      >
        <FaPlus /> Add Vehicle
      </button>

      {showSelector && (
        <div className="dashboard-card">
          <h3>Select Vehicle Type</h3>

          <button
            className="add-checklist-btn"
            onClick={() => createVehicle("Tow Car")}
          >
            🚗 Tow Car
          </button>

          <button
            className="add-checklist-btn"
            onClick={() => createVehicle("Caravan")}
          >
            🚐 Caravan
          </button>

          <button
            className="add-checklist-btn"
            onClick={() => createVehicle("Tent")}
          >
            ⛺ Tent
          </button>

          <button
            className="add-checklist-btn"
            onClick={() => createVehicle("Motorhome")}
          >
            🚍 Motorhome
          </button>

          <button
            className="untick"
            onClick={() => setShowSelector(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="dashboard-card">
          <h3>No vehicles added yet</h3>
          <p>Tap "Add Vehicle" to get started.</p>
        </div>
      ) : (
        vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="dashboard-card"
            onClick={() => navigate(`/garage/${vehicle.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {vehicleIcon(vehicle.type)}

              <div style={{ flex: 1 }}>
                <h3>{vehicle.model || "Unnamed Vehicle"}</h3>
                <p>{vehicle.type}</p>
              </div>

              <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }}
>
  <button
    className="delete-btn"
    onClick={(e) => {
  e.stopPropagation();
  removeVehicle(vehicle);
}}
  >
    <FaTrash />
  </button>

  <span style={{ color: "#999", fontSize: "22px" }}>
    
  </span>
</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Garage;