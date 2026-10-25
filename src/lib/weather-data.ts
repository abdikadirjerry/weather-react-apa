interface LegacyWeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

interface WeatherForecast {
  day: string;
  condition: string;
  temperature: number;
  low: number;
}

const weatherData: Record<string, LegacyWeatherData> = {
  hargaisa: {
    city: "Hargeisa",
    country: "Somaliland",
    temperature: 28,
    condition: "Partly Cloudy",
    high: 30,
    low: 21,
    humidity: 68,
    windSpeed: 14,
    visibility: 10,
    pressure: 1012,
    sunrise: "6:02 AM",
    sunset: "6:11 PM",
  },
  hargeisa: {
    city: "Hargeisa",
    country: "Somaliland",
    temperature: 28,
    condition: "Partly Cloudy",
    high: 30,
    low: 21,
    humidity: 68,
    windSpeed: 14,
    visibility: 10,
    pressure: 1012,
    sunrise: "6:02 AM",
    sunset: "6:11 PM",
  },
  london: {
    city: "London",
    country: "United Kingdom",
    temperature: 16,
    condition: "Cloudy",
    high: 18,
    low: 11,
    humidity: 76,
    windSpeed: 18,
    visibility: 9,
    pressure: 1008,
    sunrise: "7:32 AM",
    sunset: "6:01 PM",
  },
  dubai: {
    city: "Dubai",
    country: "United Arab Emirates",
    temperature: 34,
    condition: "Sunny",
    high: 36,
    low: 27,
    humidity: 48,
    windSpeed: 11,
    visibility: 10,
    pressure: 1009,
    sunrise: "6:18 AM",
    sunset: "5:54 PM",
  },
  nairobi: {
    city: "Nairobi",
    country: "Kenya",
    temperature: 24,
    condition: "Mostly Cloudy",
    high: 26,
    low: 16,
    humidity: 64,
    windSpeed: 13,
    visibility: 10,
    pressure: 1015,
    sunrise: "6:12 AM",
    sunset: "6:18 PM",
  },
  newyork: {
    city: "New York",
    country: "United States",
    temperature: 18,
    condition: "Partly Cloudy",
    high: 20,
    low: 12,
    humidity: 61,
    windSpeed: 16,
    visibility: 10,
    pressure: 1011,
    sunrise: "7:16 AM",
    sunset: "6:09 PM",
  },
};

export function getWeatherData(city: string): LegacyWeatherData | null {
  const normalizedCity = city.trim().toLowerCase().replace(/\s+/g, "");

  return weatherData[normalizedCity] ?? null;
}

export function getForecast(weather: LegacyWeatherData): WeatherForecast[] {
  const temperatureChanges = [0, -1, 1, 2, 0];
  const days = ["Today", "Tomorrow", "Monday", "Tuesday", "Wednesday"];

  return temperatureChanges.map((change, index) => {
    const temperature = weather.temperature + change;

    return {
      day: days[index],
      condition:
        index === 0
          ? weather.condition
          : index === 1
            ? "Mostly Cloudy"
            : index === 2
              ? "Partly Cloudy"
              : index === 3
                ? "Sunny"
                : "Cloudy",
      temperature,
      low: Math.max(weather.low + change, 0),
    };
  });
}

export const supportedCities = [
  "Hargeisa",
  "London",
  "Dubai",
  "Nairobi",
  "New York",
];
