import type {
  DailyForecast,
  GeocodingResult,
  WeatherData,
} from "@/types/weather";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

const REVERSE_GEOCODING_API_URL = "https://nominatim.openstreetmap.org/reverse";

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ReverseGeocodingResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    region?: string;
    country?: string;
  };
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
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
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

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<Pick<GeocodingResult, "name" | "admin1" | "country"> | null> {
  const url = new URL(REVERSE_GEOCODING_API_URL);

  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "10");
  url.searchParams.set("accept-language", "en");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Unable to identify your current location.");
  }

  const data: ReverseGeocodingResponse = await response.json();
  const address = data.address;

  if (!address) {
    return null;
  }

  const name =
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.county;

  if (!name) {
    return null;
  }

  return {
    name,
    admin1: address.state ?? address.region,
    country: address.country,
  };
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

  url.searchParams.set(
    "daily",
    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "wind_speed_10m_max",
    ].join(","),
  );

  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Unable to retrieve weather data.");
  }

  const data: WeatherResponse = await response.json();

  if (!data.current || !data.daily) {
    throw new Error("Weather data is unavailable for this location.");
  }

  const dates = data.daily.time ?? [];
  const weatherCodes = data.daily.weather_code ?? [];
  const temperatureMax = data.daily.temperature_2m_max ?? [];
  const temperatureMin = data.daily.temperature_2m_min ?? [];
  const precipitationProbability =
    data.daily.precipitation_probability_max ?? [];
  const windSpeed = data.daily.wind_speed_10m_max ?? [];

  const daily: DailyForecast[] = dates.map((date, index) => ({
    date,
    weatherCode: weatherCodes[index] ?? 0,
    temperatureMax: temperatureMax[index] ?? 0,
    temperatureMin: temperatureMin[index] ?? 0,
    precipitationProbability: precipitationProbability[index] ?? 0,
    windSpeed: windSpeed[index] ?? 0,
  }));

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
    daily,
  };
}
