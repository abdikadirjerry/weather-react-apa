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
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    wind_speed_10m?: number;
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
    throw new Error("Unable to search for that city.");
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
    country: address.country ?? "",
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
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
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

  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Unable to load weather data.");
  }

  const data: WeatherResponse = await response.json();

  if (!data.current || !data.daily) {
    throw new Error("Weather data is unavailable right now.");
  }

  const {
    temperature_2m: temperature,
    relative_humidity_2m: humidity,
    apparent_temperature: apparentTemperature,
    weather_code: weatherCode,
    wind_speed_10m: windSpeed,
    is_day: isDay,
  } = data.current;

  const {
    time,
    weather_code: weatherCodes,
    temperature_2m_max: maxTemperatures,
    temperature_2m_min: minTemperatures,
    precipitation_probability_max: precipitationProbabilities,
    wind_speed_10m_max: dailyWindSpeeds,
  } = data.daily;

  if (
    temperature === undefined ||
    humidity === undefined ||
    apparentTemperature === undefined ||
    weatherCode === undefined ||
    windSpeed === undefined ||
    isDay === undefined ||
    !time ||
    !weatherCodes ||
    !maxTemperatures ||
    !minTemperatures ||
    !precipitationProbabilities ||
    !dailyWindSpeeds
  ) {
    throw new Error("Weather data is incomplete.");
  }

  const daily: DailyForecast[] = time.map((date, index) => {
    const forecastWeatherCode = weatherCodes[index];
    const temperatureMax = maxTemperatures[index];
    const temperatureMin = minTemperatures[index];
    const precipitationProbability = precipitationProbabilities[index];
    const forecastWindSpeed = dailyWindSpeeds[index];

    if (
      forecastWeatherCode === undefined ||
      temperatureMax === undefined ||
      temperatureMin === undefined ||
      precipitationProbability === undefined ||
      forecastWindSpeed === undefined
    ) {
      throw new Error("Weather forecast data is incomplete.");
    }

    return {
      date,
      weatherCode: forecastWeatherCode,
      temperatureMax,
      temperatureMin,
      precipitationProbability,
      windSpeed: forecastWindSpeed,
    };
  });

  return {
    location: {
      name: location.name,
      country: location.country ?? "",
      latitude: location.latitude,
      longitude: location.longitude,
    },
    current: {
      temperature,
      apparentTemperature,
      humidity,
      windSpeed,
      weatherCode,
      isDay: isDay === 1,
    },
    daily,
  };
}
