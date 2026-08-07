const tent = {
  id: "Tent",
  label: "Tent",
  icons: { departure: "⛺", arrival: "🏕️", leaving: "↗", arrivalHome: "🏠" },
  dashboard: { garageLabel: "Equipment", checklistLabel: "Checklists" },
  garageTypes: [
    { type: "Car", icon: "🚗", defaultModel: "New Car", fields: ["registration", "manufacturer", "model", "year", "mileage", "serviceDate", "mot", "insurance", "tyres", "notes"] },
    { type: "Tent", icon: "⛺", defaultModel: "New Tent", fields: ["manufacturer", "model", "year", "capacity", "bedrooms", "colour", "waterproofRating", "purchaseDate", "notes"] },
    { type: "Trailer", icon: "🛻", defaultModel: "New Trailer", fields: ["manufacturer", "model", "year", "tyres", "serviceDate", "notes"] },
  ],
  checklists: {
    departure: { id: "tentDepartureChecklist", title: "Departure Checklist", items: ["Pack tent and groundsheet", "Pack tent pegs and mallet", "Pack sleeping bags and mats", "Pack cooking stove and fuel", "Pack cool box", "Pack food and water", "Pack torches and spare batteries", "Check weather forecast", "Lock home and load vehicle"] },
    arrival: { id: "tentArrivalChecklist", title: "Arrival Checklist", items: ["Choose a level pitch", "Pitch tent and fit groundsheet", "Secure all pegs and guy lines", "Set up sleeping area", "Set up cooking area safely", "Store food securely", "Locate toilets and water point", "Check campsite rules"] },
    leaving: { id: "tentLeavingChecklist", title: "Leaving Campsite", items: ["Pack away dry bedding", "Clean and pack cooking equipment", "Check tent is dry and clean", "Remove all pegs and guy lines", "Fold tent and groundsheet", "Dispose of rubbish", "Check pitch for belongings", "Final walk-around"] },
    arrivalHome: { id: "tentArrivalHomeChecklist", title: "Arrival Home", items: ["Air and dry tent", "Clean groundsheet", "Wash cooking equipment", "Charge torches", "Store sleeping bags dry", "Restock camping supplies", "Check tent for damage", "Book next trip"] },
  },
};

export default tent;
