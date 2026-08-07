const motorhome = {
  id: "Motorhome",
  label: "Motorhome",
  icons: { departure: "🚐", arrival: "🏕️", leaving: "↗", arrivalHome: "🏠" },
  dashboard: { garageLabel: "Motorhome", checklistLabel: "Checklists" },
  garageTypes: [
    { type: "Motorhome", icon: "🚐", defaultModel: "New Motorhome", fields: ["registration", "manufacturer", "model", "mileage", "engineService", "habitationService", "tyres", "battery", "solar", "notes"] },
  ],
  checklists: {
    departure: { id: "motorhomeDepartureChecklist", title: "Departure Checklist", items: ["Close windows and roof lights", "Secure loose items", "Stow step", "Disconnect hook-up", "Fill fresh water as needed", "Empty waste water", "Turn gas off", "Check tyre pressures", "Check lights and mirrors", "Final walk-around"] },
    arrival: { id: "motorhomeArrivalChecklist", title: "Arrival Checklist", items: ["Level motorhome", "Apply handbrake", "Connect electric hook-up", "Set up water connection", "Open roof vents", "Turn gas on", "Set up step and awning", "Check campsite facilities"] },
    leaving: { id: "motorhomeLeavingChecklist", title: "Leaving Campsite", items: ["Empty toilet cassette", "Empty grey water", "Disconnect water", "Disconnect electric hook-up", "Stow awning and step", "Close windows and roof lights", "Secure cupboards", "Turn gas off", "Final walk-around"] },
    arrivalHome: { id: "motorhomeArrivalHomeChecklist", title: "Arrival Home", items: ["Empty toilet cassette", "Drain and clean water tanks", "Empty fridge", "Clean kitchen and bathroom", "Charge leisure battery", "Check for damage", "Restock consumables", "Book servicing if needed"] },
  },
};

export default motorhome;
