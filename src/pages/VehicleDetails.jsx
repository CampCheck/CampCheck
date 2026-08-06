import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { updateVehicle } from "../firebase/garage";

function VehicleDetails() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [vehicle, setVehicle] = useState({
    type: "",
    manufacturer: "",
    model: "",
    year: "",
    registration: "",
    fuel: "",
    transmission: "",
    berths: "",
    tentSize: "",
    bedrooms: "",
    notes: "",
  });

  useEffect(() => {
    async function loadVehicle() {
      const snap = await getDoc(doc(db, "garage", id));

      if (snap.exists()) {
        setVehicle((prev) => ({
          ...prev,
          ...snap.data(),
        }));
      }

      setLoading(false);
    }

    loadVehicle();
  }, [id]);

  async function saveVehicle() {
    await updateVehicle(id, vehicle);
    alert("Vehicle saved.");
  }

  function update(field, value) {
    setVehicle((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="shopping-title">
        <h1>{vehicle.type}</h1>
        <p>Edit your vehicle information.</p>
      </div>

      <div className="dashboard-card">
        <h3>General</h3>

        <label className="form-label">Manufacturer</label>
        <input
          className="edit-input"
          value={vehicle.manufacturer}
          onChange={(e) => update("manufacturer", e.target.value)}
        />

        <label className="form-label">Model</label>
        <input
          className="edit-input"
          value={vehicle.model}
          onChange={(e) => update("model", e.target.value)}
        />

        <label className="form-label">Year</label>
        <input
          className="edit-input"
          value={vehicle.year}
          onChange={(e) => update("year", e.target.value)}
        />

        {vehicle.type === "Tow Car" && (
          <>
            <label className="form-label">Registration</label>
            <input
              className="edit-input"
              value={vehicle.registration}
              onChange={(e) => update("registration", e.target.value)}
            />

            <label className="form-label">Fuel</label>
            <input
              className="edit-input"
              value={vehicle.fuel}
              onChange={(e) => update("fuel", e.target.value)}
            />

            <label className="form-label">Transmission</label>
            <input
              className="edit-input"
              value={vehicle.transmission}
              onChange={(e) => update("transmission", e.target.value)}
            />
          </>
        )}

        {(vehicle.type === "Caravan" ||
          vehicle.type === "Motorhome") && (
          <>
            <label className="form-label">Berths</label>
            <input
              className="edit-input"
              value={vehicle.berths}
              onChange={(e) => update("berths", e.target.value)}
            />
          </>
        )}

        {vehicle.type === "Tent" && (
          <>
            <label className="form-label">Tent Size</label>
            <input
              className="edit-input"
              value={vehicle.tentSize}
              onChange={(e) => update("tentSize", e.target.value)}
            />

            <label className="form-label">Bedrooms</label>
            <input
              className="edit-input"
              value={vehicle.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
            />
          </>
        )}
      </div>

      <div className="dashboard-card">
  <h3>Weights</h3>

  {vehicle.type === "Tow Car" && (
    <>
      <label className="form-label">Kerb Weight (kg)</label>
      <input
        className="edit-input"
        value={vehicle.kerbWeight || ""}
        onChange={(e) => update("kerbWeight", e.target.value)}
      />

      <label className="form-label">Gross Vehicle Weight (GVW)</label>
      <input
        className="edit-input"
        value={vehicle.gvw || ""}
        onChange={(e) => update("gvw", e.target.value)}
      />

      <label className="form-label">Gross Train Weight (GTW)</label>
      <input
        className="edit-input"
        value={vehicle.gtw || ""}
        onChange={(e) => update("gtw", e.target.value)}
      />

      <label className="form-label">Max Braked Tow Weight</label>
      <input
        className="edit-input"
        value={vehicle.maxBrakedTow || ""}
        onChange={(e) => update("maxBrakedTow", e.target.value)}
      />

      <label className="form-label">Max Unbraked Tow Weight</label>
      <input
        className="edit-input"
        value={vehicle.maxUnbrakedTow || ""}
        onChange={(e) => update("maxUnbrakedTow", e.target.value)}
      />

      <label className="form-label">Maximum Nose Weight</label>
      <input
        className="edit-input"
        value={vehicle.maxNoseWeight || ""}
        onChange={(e) => update("maxNoseWeight", e.target.value)}
      />
    </>
  )}

  {vehicle.type === "Caravan" && (
    <>
      <label className="form-label">MIRO (kg)</label>
      <input
        className="edit-input"
        value={vehicle.miro || ""}
        onChange={(e) => update("miro", e.target.value)}
      />

      <label className="form-label">MTPLM (kg)</label>
      <input
        className="edit-input"
        value={vehicle.mtplm || ""}
        onChange={(e) => update("mtplm", e.target.value)}
      />

      <label className="form-label">Payload (kg)</label>
      <input
        className="edit-input"
        value={vehicle.payload || ""}
        onChange={(e) => update("payload", e.target.value)}
      />

      <label className="form-label">Recommended Nose Weight (kg)</label>
      <input
        className="edit-input"
        value={vehicle.noseWeight || ""}
        onChange={(e) => update("noseWeight", e.target.value)}
      />
    </>
  )}

  {vehicle.type === "Motorhome" && (
    <>
      <label className="form-label">MIRO (kg)</label>
      <input
        className="edit-input"
        value={vehicle.miro || ""}
        onChange={(e) => update("miro", e.target.value)}
      />

      <label className="form-label">MTPLM (kg)</label>
      <input
        className="edit-input"
        value={vehicle.mtplm || ""}
        onChange={(e) => update("mtplm", e.target.value)}
      />

      <label className="form-label">Payload (kg)</label>
      <input
        className="edit-input"
        value={vehicle.payload || ""}
        onChange={(e) => update("payload", e.target.value)}
      />
    </>
  )}

  {vehicle.type === "Tent" && (
    <p>No weight information required.</p>
  )}
</div>

      <div className="dashboard-card">
  <h3>Dimensions</h3>

  {(vehicle.type === "Caravan" ||
    vehicle.type === "Motorhome") && (
    <>
      <label className="form-label">Shipping Length (m)</label>
      <input
        className="edit-input"
        value={vehicle.shippingLength || ""}
        onChange={(e) => update("shippingLength", e.target.value)}
      />

      <label className="form-label">Body Length (m)</label>
      <input
        className="edit-input"
        value={vehicle.bodyLength || ""}
        onChange={(e) => update("bodyLength", e.target.value)}
      />

      <label className="form-label">Width (m)</label>
      <input
        className="edit-input"
        value={vehicle.width || ""}
        onChange={(e) => update("width", e.target.value)}
      />

      <label className="form-label">Height (m)</label>
      <input
        className="edit-input"
        value={vehicle.height || ""}
        onChange={(e) => update("height", e.target.value)}
      />

      {vehicle.type === "Caravan" && (
        <>
          <label className="form-label">Awning Size (cm)</label>
          <input
            className="edit-input"
            value={vehicle.awningSize || ""}
            onChange={(e) => update("awningSize", e.target.value)}
          />
        </>
      )}
    </>
  )}

  {vehicle.type === "Tow Car" && (
    <>
      <label className="form-label">Length (m)</label>
      <input
        className="edit-input"
        value={vehicle.length || ""}
        onChange={(e) => update("length", e.target.value)}
      />

      <label className="form-label">Width (m)</label>
      <input
        className="edit-input"
        value={vehicle.width || ""}
        onChange={(e) => update("width", e.target.value)}
      />

      <label className="form-label">Height (m)</label>
      <input
        className="edit-input"
        value={vehicle.height || ""}
        onChange={(e) => update("height", e.target.value)}
      />
    </>
  )}

  {vehicle.type === "Tent" && (
    <>
      <label className="form-label">Packed Length (cm)</label>
      <input
        className="edit-input"
        value={vehicle.packedLength || ""}
        onChange={(e) => update("packedLength", e.target.value)}
      />

      <label className="form-label">Packed Width (cm)</label>
      <input
        className="edit-input"
        value={vehicle.packedWidth || ""}
        onChange={(e) => update("packedWidth", e.target.value)}
      />

      <label className="form-label">Packed Height (cm)</label>
      <input
        className="edit-input"
        value={vehicle.packedHeight || ""}
        onChange={(e) => update("packedHeight", e.target.value)}
      />
    </>
  )}
</div>

      <div className="dashboard-card">
  <h3>Tyres</h3>

  {(vehicle.type === "Tow Car" ||
    vehicle.type === "Caravan" ||
    vehicle.type === "Motorhome") && (
    <>
      <label className="form-label">Tyre Size</label>
      <input
        className="edit-input"
        value={vehicle.tyreSize || ""}
        onChange={(e) => update("tyreSize", e.target.value)}
        placeholder="e.g. 205/55 R16"
      />

      <label className="form-label">Front Tyre Pressure (PSI)</label>
      <input
        className="edit-input"
        value={vehicle.frontTyrePressure || ""}
        onChange={(e) => update("frontTyrePressure", e.target.value)}
      />

      <label className="form-label">Rear Tyre Pressure (PSI)</label>
      <input
        className="edit-input"
        value={vehicle.rearTyrePressure || ""}
        onChange={(e) => update("rearTyrePressure", e.target.value)}
      />

      <label className="form-label">Spare Tyre Pressure (PSI)</label>
      <input
        className="edit-input"
        value={vehicle.spareTyrePressure || ""}
        onChange={(e) => update("spareTyrePressure", e.target.value)}
      />

      <label className="form-label">Wheel Nut Torque (Nm)</label>
      <input
        className="edit-input"
        value={vehicle.wheelTorque || ""}
        onChange={(e) => update("wheelTorque", e.target.value)}
      />

      <label className="form-label">Bolt Pattern / PCD</label>
      <input
        className="edit-input"
        value={vehicle.boltPattern || ""}
        onChange={(e) => update("boltPattern", e.target.value)}
        placeholder="e.g. 5x112"
      />
    </>
  )}

  {vehicle.type === "Tent" && (
    <p>No tyre information required.</p>
  )}
</div>

      <div className="dashboard-card">
        <h3>Notes</h3>

        <textarea
          className="edit-input"
          rows="5"
          value={vehicle.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>

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