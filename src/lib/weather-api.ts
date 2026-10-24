import type { GeocodingResult, WeatherData } from "@/types/weather";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface WeatherResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
    is_day?: number;
  };
}

export async function searchCity(
  city: string,
): Promise<GeocodingResult | null> {
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    return null;
  }

  const url = new URL(GEOCODING_API_URL);

  url.searchParams.set("name", trimmedCity);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Unable to search for that location.");
  }

  const data: GeocodingResponse = await response.json();

  return data.results?.[0] ?? null;
}

export async function getWeather(
  location: GeocodingResult,
): Promise<WeatherData> {
  const url = new URL(WEATHER_API_URL);

  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
      "is_day",
    ].join(","),
  );
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Unable to retrieve weather data.");
  }

  const data: WeatherResponse = await response.json();

  if (!data.current) {
    throw new Error("Weather data is unavailable for this location.");
  }

  return {
    location: {
      name: location.name,
      country: location.country ?? "",
      latitude: location.latitude,
      longitude: location.longitude,
    },
    current: {
      temperature: data.current.temperature_2m ?? 0,
      apparentTemperature: data.current.apparent_temperature ?? 0,
      humidity: data.current.relative_humidity_2m ?? 0,
      windSpeed: data.current.wind_speed_10m ?? 0,
      weatherCode: data.current.weather_code ?? 0,
      isDay: data.current.is_day === 1,
    },
  };
}
