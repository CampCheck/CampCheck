export async function getWeather(location) {
  if (!location) return null;

  // Find the campsite coordinates
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
  );

  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Location not found");
  }

  const { latitude, longitude, name } = geoData.results[0];

  // Get current weather
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&forecast_days=1`
  );

  const weatherData = await weatherResponse.json();

  return {
    location: name,
    temperature: weatherData.current.temperature_2m,
    code: weatherData.current.weather_code,
  };
}

export function weatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Snow",
    80: "Rain showers",
    95: "Thunderstorm",
  };

  return descriptions[code] || "Unknown";
}