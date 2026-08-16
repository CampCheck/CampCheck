  const caravan = {
    id: "Caravan",
    label: "Caravan",
    icons: { departure: "🚐", arrival: "🏕️", leaving: "↗", arrivalHome: "🏠" },
    dashboard: { garageLabel: "Garage", checklistLabel: "Checklists" },
    garageTypes: [
      { type: "Tow Car", icon: "🚗", defaultModel: "New Tow Car", fields: ["registration", "manufacturer", "model", "year", "serviceDate", "mot", "insurance", "tyres", "notes"] },
      { 
  type: "Caravan",
  icon: "🚐",
  defaultModel: "New Caravan",
  fields: [
    "manufacturer",
    "model",
    "year",
    "crisNumber",
    "battery",
    "miro",
    "mtplm",
    "payload",
    "noseWeight",
    "shippingLength",
    "bodyLength",
    "width",
    "height",
    "awningSize",
    "tyres",
    "serviceDate",
    "notes"
  ]
},
    ],
    checklists: {
      departure: { id: "departureChecklist", title: "Departure Checklist", items: ["Lock Windows", "Roof Vents Closed", "Lower Aerial", "Fridge Switched To 12V", "Gas Turned Off", "Caravan Packed Correctly", "Door Locked", "Towing Cover On", "Corner Steadies Raised", "Hitch locked", "Break Away Cable Attached", "Electrics Attached To Vehicle", "Motor Mover Disengaged", "Jockey Wheel Raised", "Handbrake Off", "Wheel Torque Checked", "Towing Mirrors On", "Route Planned", "Check Lights", "Final Walk Round", "Have a safe journey"] },
      arrival: { id: "arrivalChecklist", title: "Arrival Checklist", items: ["Apply Handbrake", "Level Caravan", "Lower Corner Steadies", "Connect Electric Hook-Up", "Close Water Drain Tap", "Connect Water", "Turn Gas On", "Switch Fridge To ELectric/Gas", "Adjust Aerial", "Put Up Awning","Have A Drink & Relax"] },
      leaving: { id: "leavingChecklist", title: "Leaving Campsite", items: ["Empty Toilet Flush", "Disconnect water", "Open Drain Tap", "Disconnect Electric", "Turn gas off", "Close roof vents", "Lock windows", "Lower aerial", "Fridge Switched To 12v", "Caravan Packed Correctly", "Door Locked", "Towing Cover On", "Raise corner steadies", "Hitch Locked", "Break Away Cable Attached", "Electrics Attached to Vehicle", "Motor Mover Disengaged", "Jockey Wheel Raised", "Handbrake Off", "Towing Mirrors On", "Check pitch for forgotten items", "Route Planned", "Check Lights", "Final walk-around", "Have A Safe Journey"] },
      arrivalHome: { id: "arrivalHomeChecklist", title: "Arrival Home", items: ["Empty caravan", "Empty fridge", "Leave fridge door open", "Clean Caravan", "Check For Any Damage", "Lock caravan", "Apply Hitchlock", "Apply Wheel Lock", "Book next trip"] },
    },
  };

  export default caravan;
