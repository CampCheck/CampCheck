import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGroup } from "../auth/GroupProvider";
import { getVehicle, updateVehicle } from "../firebase/garage";
import { getVehicleTypeConfig } from "../campingStyles";

const FIELD_LABELS = {
  registration: "Registration", manufacturer: "Manufacturer", model: "Model", year: "Year",
  mileage: "Mileage", serviceDate: "Service Date", mot: "MOT Expiry", insurance: "Insurance Expiry",
  tyres: "Tyres", crisNumber: "CRiS Number", battery: "Battery", waterPump: "Water Pump",
  capacity: "Capacity", bedrooms: "Bedrooms", colour: "Colour", waterproofRating: "Waterproof Rating",
  purchaseDate: "Purchase Date", engineService: "Engine Service", habitationService: "Habitation Service",
  solar: "Solar", notes: "Notes",
};

const DATE_FIELDS = new Set(["serviceDate", "mot", "insurance", "purchaseDate", "engineService", "habitationService"]);

function VehicleDetails() {
  const { id } = useParams();
  const { groupId, campingStyle } = useGroup();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState({ type: "", manufacturer: "", model: "", year: "", notes: "" });

  useEffect(() => {
    if (!groupId) return undefined;
    let active = true;
    getVehicle(groupId, id).then((savedVehicle) => {
      if (active && savedVehicle) setVehicle((current) => ({ ...current, ...savedVehicle }));
    }).catch(console.error).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [groupId, id]);

  const vehicleType = getVehicleTypeConfig(campingStyle, vehicle.type);
  const fields = vehicleType?.fields || ["manufacturer", "model", "year", "notes"];

  async function saveVehicle() {
    try {
      await updateVehicle(groupId, id, vehicle);
      alert("Vehicle saved.");
    } catch (error) {
      console.error(error);
      alert("Failed to save vehicle.");
    }
  }

  function update(field, value) {
    setVehicle((current) => ({ ...current, [field]: value }));
  }

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="shopping-title">
        <h1>{vehicle.type || "Vehicle"}</h1>
        <p>Edit your vehicle information.</p>
      </div>
      <div className="dashboard-card">
        <h3>Details</h3>
        {fields.map((field) => (
          <label className="form-label" key={field}>
            {FIELD_LABELS[field] || field}
            {field === "notes" ? (
              <textarea className="edit-input" rows="5" value={vehicle[field] || ""} onChange={(event) => update(field, event.target.value)} />
            ) : (
              <input className="edit-input" type={DATE_FIELDS.has(field) ? "date" : "text"} value={vehicle[field] || ""} onChange={(event) => update(field, event.target.value)} />
            )}
          </label>
        ))}
      </div>
      <button className="save-trip-btn" onClick={saveVehicle}>Save Vehicle</button>
    </div>
  );
}

export default VehicleDetails;
