const caravan = {
  id: "Caravan",
  label: "Caravan",
  icons: { departure: "🚐", arrival: "🏕️", leaving: "↗", arrivalHome: "🏠" },
  dashboard: { garageLabel: "Garage", checklistLabel: "Checklists" },
  garageTypes: [
    { type: "Tow Car", icon: "🚗", defaultModel: "New Tow Car", fields: ["registration", "manufacturer", "model", "year", "mileage", "serviceDate", "mot", "insurance", "tyres", "notes"] },
    { type: "Caravan", icon: "🚐", defaultModel: "New Caravan", fields: ["manufacturer", "model", "year", "crisNumber", "battery", "waterPump", "tyres", "serviceDate", "notes"] },
  ],
  checklists: {
    departure: { id: "departureChecklist", title: "Departure Checklist", items: ["Hitch locked", "Breakaway cable attached", "Jockey wheel raised", "Corner steadies raised", "TV aerial down", "Windows locked", "Roof lights closed", "Fridge switched to 12V", "Water disconnected", "Gas bottles turned off"] },
    arrival: { id: "arrivalChecklist", title: "Arrival Checklist", items: ["Level caravan", "Apply handbrake", "Lower corner steadies", "Connect electric hook-up", "Connect water", "Turn gas on", "Open roof vents"] },
    leaving: { id: "leavingChecklist", title: "Leaving Campsite", items: ["Disconnect electric hook-up", "Disconnect water", "Drain waste water", "Empty toilet cassette", "Turn gas off", "Close roof vents", "Lock windows", "Lower TV aerial", "Raise corner steadies", "Remove wheel chocks", "Secure loose items", "Check pitch for forgotten items", "Attach breakaway cable", "Final walk-around"] },
    arrivalHome: { id: "arrivalHomeChecklist", title: "Arrival Home", items: ["Empty caravan", "Empty fridge", "Leave fridge door open", "Drain fresh water system", "Drain water heater", "Empty waste water", "Empty toilet cassette", "Clean toilet", "Turn off battery isolator", "Remove valuables", "Vacuum caravan", "Check for damage", "Lock caravan", "Book next trip"] },
  },
};

export default caravan;
