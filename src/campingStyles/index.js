import caravan from "./caravan";
import tent from "./tent";
import motorhome from "./motorhome";

const campingStyles = { Caravan: caravan, Tent: tent, Motorhome: motorhome };
export const DEFAULT_CAMPING_STYLE = caravan.id;

export function getCampingStyle(style) {
  return campingStyles[style] || campingStyles[DEFAULT_CAMPING_STYLE];
}

export function getVehicleTypeConfig(campingStyle, vehicleType) {
  const selected = getCampingStyle(campingStyle).garageTypes.find((item) => item.type === vehicleType);
  if (selected) return selected;
  return Object.values(campingStyles)
    .flatMap((style) => style.garageTypes)
    .find((item) => item.type === vehicleType);
}

export { campingStyles };
