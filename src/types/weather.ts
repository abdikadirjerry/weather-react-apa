export interface WeatherData {
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

export interface WeatherForecast {
  day: string;
  condition: string;
  temperature: number;
  low: number;
}
