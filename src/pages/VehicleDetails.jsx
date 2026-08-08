import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGroup } from "../auth/GroupProvider";
import { getVehicle, updateVehicle } from "../firebase/garage";
import { getVehicleTypeConfig } from "../campingStyles";

const FIELD_LABELS = {
  registration: "Registration",
  manufacturer: "Manufacturer",
  model: "Model",
  year: "Year",
  serviceDate: "Service Date",
  mot: "MOT Expiry",
  insurance: "Insurance Expiry",
  tyres: "Tyres",
  crisNumber: "CRiS Number",
  battery: "Battery",
  waterPump: "Water Pump",
  capacity: "Capacity",
  bedrooms: "Bedrooms",
  colour: "Colour",
  waterproofRating: "Waterproof Rating",
  purchaseDate: "Purchase Date",
  engineService: "Engine Service",
  habitationService: "Habitation Service",
  solar: "Solar",

  // Weights
  miro: "MIRO (kg)",
  mtplm: "MTPLM (kg)",
  payload: "Payload (kg)",
  noseWeight: "Recommended Nose Weight (kg)",
  maxBrakedTow: "Max Braked Tow Weight (kg)",
  maxUnbrakedTow: "Max Unbraked Tow Weight (kg)",
  maxNoseWeight: "Maximum Nose Weight (kg)",
  kerbWeight: "Kerb Weight (kg)",
  gvw: "Gross Vehicle Weight (GVW)",
  gtw: "Gross Train Weight (GTW)",

  // Dimensions
  shippingLength: "Shipping Length (m)",
  bodyLength: "Body Length (m)",
  width: "Width (m)",
  height: "Height (m)",
  awningSize: "Awning Size (cm)",
  length: "Length (m)",
  packedLength: "Packed Length (cm)",
  packedWidth: "Packed Width (cm)",
  packedHeight: "Packed Height (cm)",

  // Tent / other
  tentSize: "Tent Size",
  berths: "Berths",

  notes: "Notes",
};

const DATE_FIELDS = new Set([
  "serviceDate",
  "mot",
  "insurance",
  "purchaseDate",
  "engineService",
  "habitationService",
]);

const WEIGHT_FIELDS = new Set([
  "miro",
  "mtplm",
  "payload",
  "noseWeight",
  "maxBrakedTow",
  "maxUnbrakedTow",
  "maxNoseWeight",
  "kerbWeight",
  "gvw",
  "gtw",
]);

const DIMENSION_FIELDS = new Set([
  "shippingLength",
  "bodyLength",
  "width",
  "height",
  "awningSize",
  "length",
  "packedLength",
  "packedWidth",
  "packedHeight",
]);

const TYRE_FIELDS = new Set([
  "tyres",
  "tyreSize",
  "frontTyrePressure",
  "rearTyrePressure",
  "spareTyrePressure",
  "wheelTorque",
  "boltPattern",
]);

function VehicleField({ field, vehicle, update }) {
  const label = FIELD_LABELS[field] || field;

  if (field === "notes") {
    return (
      <label className="form-label">
        {label}
        <textarea
          className="edit-input"
          rows="5"
          value={vehicle[field] || ""}
          onChange={(event) => update(field, event.target.value)}
        />
      </label>
    );
  }

  return (
    <label className="form-label">
      {label}
      <input
        className="edit-input"
        type={DATE_FIELDS.has(field) ? "date" : "text"}
        value={vehicle[field] || ""}
        onChange={(event) => update(field, event.target.value)}
      />
    </label>
  );
}

function VehicleDetails() {
  const { id } = useParams();
  const { groupId, campingStyle } = useGroup();

  const [loading, setLoading] = useState(true);

  const [vehicle, setVehicle] = useState({
    type: "",
    manufacturer: "",
    model: "",
    year: "",
    notes: "",
  });

  useEffect(() => {
    if (!groupId) return undefined;

    let active = true;

    getVehicle(groupId, id)
      .then((savedVehicle) => {
        if (active && savedVehicle) {
          setVehicle((current) => ({
            ...current,
            ...savedVehicle,
          }));
        }
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [groupId, id]);

  const vehicleType = getVehicleTypeConfig(
    campingStyle,
    vehicle.type
  );

  const fields =
    vehicleType?.fields || [
      "manufacturer",
      "model",
      "year",
      "notes",
    ];

  const generalFields = fields.filter(
    (field) =>
      !WEIGHT_FIELDS.has(field) &&
      !DIMENSION_FIELDS.has(field) &&
      !TYRE_FIELDS.has(field) &&
      field !== "notes"
  );

  const weightFields = fields.filter((field) =>
    WEIGHT_FIELDS.has(field)
  );

  const dimensionFields = fields.filter((field) =>
    DIMENSION_FIELDS.has(field)
  );

  const tyreFields = fields.filter((field) =>
    TYRE_FIELDS.has(field)
  );

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
    setVehicle((current) => ({
      ...current,
      [field]: value,
    }));
  }

  if (loading) {
    return (
      <div className="container vehicle-details-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container vehicle-details-page">
      <div className="shopping-title">
        <h1>{vehicle.type || "Vehicle"}</h1>
        <p>Edit your vehicle information.</p>
      </div>

      {generalFields.length > 0 && (
        <div className="dashboard-card">
          <h3>General</h3>

          {generalFields.map((field) => (
            <VehicleField
              key={field}
              field={field}
              vehicle={vehicle}
              update={update}
            />
          ))}
        </div>
      )}

      {weightFields.length > 0 && (
        <div className="dashboard-card">
          <h3>Weights</h3>

          {weightFields.map((field) => (
            <VehicleField
              key={field}
              field={field}
              vehicle={vehicle}
              update={update}
            />
          ))}
        </div>
      )}

      {dimensionFields.length > 0 && (
        <div className="dashboard-card">
          <h3>Dimensions</h3>

          {dimensionFields.map((field) => (
            <VehicleField
              key={field}
              field={field}
              vehicle={vehicle}
              update={update}
            />
          ))}
        </div>
      )}

      {tyreFields.length > 0 && (
        <div className="dashboard-card">
          <h3>Tyres</h3>

          {tyreFields.map((field) => (
            <VehicleField
              key={field}
              field={field}
              vehicle={vehicle}
              update={update}
            />
          ))}
        </div>
      )}

      {fields.includes("notes") && (
        <div className="dashboard-card">
          <h3>Notes</h3>

          <VehicleField
            field="notes"
            vehicle={vehicle}
            update={update}
          />
        </div>
      )}

      <button
        className="save-trip-btn"
        onClick={saveVehicle}
      >
        Save Vehicle
      </button>
    </div>
  );
}

export default VehicleDetails;