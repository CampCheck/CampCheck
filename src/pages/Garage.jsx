import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../styles/garage.css";
import { addVehicle, deleteVehicle, subscribeGarage } from "../firebase/garage";
import { useGroup } from "../auth/GroupProvider";
import { getCampingStyle } from "../campingStyles";

function Garage() {
  const navigate = useNavigate();
  const { groupId, campingStyle } = useGroup();
  const style = getCampingStyle(campingStyle);
  const [showSelector, setShowSelector] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (!groupId) return undefined;
    return subscribeGarage(groupId, setVehicles, console.error);
  }, [groupId]);

  async function createVehicle(vehicleType) {
    try {
      await addVehicle(groupId, {
        type: vehicleType.type,
        manufacturer: "",
        model: vehicleType.defaultModel,
        year: "",
        created: Date.now(),
      });
      setShowSelector(false);
    } catch (error) {
      console.error(error);
      alert("Failed to add vehicle.");
    }
  }

  async function removeVehicle(event, vehicle) {
    event.stopPropagation();
    if (!window.confirm(`Delete "${vehicle.model || vehicle.type}"?\n\nThis cannot be undone.`)) return;
    try {
      await deleteVehicle(groupId, vehicle.id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete vehicle.");
    }
  }

  return (
    <div className="garage-page">
      <div className="shopping-title">
        <h1>Garage</h1>
        <p>Manage your {style.label.toLowerCase()} vehicles and equipment.</p>
      </div>

      <button className="add-checklist-btn" onClick={() => setShowSelector(true)}>
        <FaPlus /> Add Vehicle
      </button>

      {showSelector && (
        <div className="dashboard-card">
          <h3>Select Vehicle Type</h3>
          {style.garageTypes.map((vehicleType) => (
            <button key={vehicleType.type} className="add-checklist-btn" onClick={() => createVehicle(vehicleType)}>
              {vehicleType.icon} {vehicleType.type}
            </button>
          ))}
          <button className="untick" onClick={() => setShowSelector(false)}>Cancel</button>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="dashboard-card">
          <h3>No vehicles added yet</h3>
          <p>Tap “Add Vehicle” to get started.</p>
        </div>
      ) : vehicles.map((vehicle) => {
        const type = style.garageTypes.find((item) => item.type === vehicle.type);
        return (
          <div key={vehicle.id} className="dashboard-card" onClick={() => navigate(`/garage/${vehicle.id}`)} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>{type?.icon || "🚗"}</span>
              <div style={{ flex: 1 }}>
  <h3>{vehicle.manufacturer || "Unknown Manufacturer"}</h3>

  <p style={{ margin: "2px 0" }}>
    {vehicle.model || "Unnamed Vehicle"}
  </p>

  {vehicle.registration && (
    <p style={{ margin: "2px 0", fontSize: "14px" }}>
      {vehicle.registration}
    </p>
  )}
</div>
              <button className="delete-btn" onClick={(event) => removeVehicle(event, vehicle)} aria-label={`Delete ${vehicle.model || vehicle.type}`}>
                <FaTrash />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Garage;
