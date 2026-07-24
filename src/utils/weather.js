export async function getWeather(location) {
  if (!location) return null;

  // Find coordinates
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      location
    )}&count=1`
  );

  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Location not found");
  }

  const { latitude, longitude, name } = geoData.results[0];

  // Current weather + 5-day forecast
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7`
  );

  const weatherData = await weatherResponse.json();

  const forecast = weatherData.daily.time.map((date, index) => ({
    date,
    code: weatherData.daily.weather_code[index],
    max: Math.round(weatherData.daily.temperature_2m_max[index]),
    min: Math.round(weatherData.daily.temperature_2m_min[index]),
    rain: weatherData.daily.precipitation_probability_max[index],
  }));

  return {
    location: name,

    temperature: Math.round(weatherData.current.temperature_2m),

    code: weatherData.current.weather_code,

    todayMax: forecast[0].max,

    todayMin: forecast[0].min,

    forecast,
  };
}

export function weatherDescription(code) {
  const descriptions = {
    0: "Sunny",
    1: "Mostly Sunny",
    2: "Partly Cloudy",
    3: "Cloudy",

    45: "Fog",
    48: "Freezing Fog",

    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",

    56: "Freezing Drizzle",
    57: "Heavy Freezing Drizzle",

    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",

    66: "Freezing Rain",
    67: "Heavy Freezing Rain",

    71: "Light Snow",
    73: "Snow",
    75: "Heavy Snow",
    77: "Snow Grains",

    80: "Rain Showers",
    81: "Heavy Showers",
    82: "Violent Showers",

    85: "Snow Showers",
    86: "Heavy Snow Showers",

    95: "Thunderstorm",
    96: "Thunder & Hail",
    99: "Severe Thunderstorm",
  };

  return descriptions[code] || "Unknown";
}

export function weatherIcon(code) {
  if ([0].includes(code)) return "☀️";
  if ([1].includes(code)) return "🌤️";
  if ([2].includes(code)) return "⛅";
  if ([3].includes(code)) return "☁️";

  if ([45, 48].includes(code)) return "🌫️";

  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";

  if ([61, 63, 65, 66, 67].includes(code)) return "🌧️";

  if ([71, 73, 75, 77].includes(code)) return "❄️";

  if ([80, 81, 82].includes(code)) return "🌦️";

  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌤️";
}

export function dayName(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
  });
}