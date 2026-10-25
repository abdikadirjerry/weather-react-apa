import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
} from "lucide-react";
import { formatTemperature } from "@/lib/weather-utils";
import type { DailyForecast, TemperatureUnit } from "@/types/weather";

interface ForecastCardProps {
  forecast: DailyForecast;
  temperatureUnit?: TemperatureUnit;
}

function getWeatherIcon(weatherCode: number) {
  if (weatherCode === 0) return Sun;
  if (weatherCode <= 3) return Cloud;
  if (weatherCode <= 48) return CloudFog;
  if (weatherCode <= 57) return CloudDrizzle;
  if (weatherCode <= 67) return CloudRain;
  if (weatherCode <= 77) return CloudSnow;
  if (weatherCode <= 82) return CloudRain;
  if (weatherCode <= 86) return CloudSnow;
  if (weatherCode <= 99) return CloudLightning;

  return Cloud;
}

function formatForecastDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
  });
}

export function ForecastCard({
  forecast,
  temperatureUnit = "celsius",
}: ForecastCardProps) {
  const WeatherIcon = getWeatherIcon(forecast.weatherCode);

  return (
    <article className="flex min-w-0 flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-sm font-medium text-white/70">
        {formatForecastDate(forecast.date)}
      </p>

      <WeatherIcon
        size={30}
        strokeWidth={1.7}
        className="text-sky-300"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-1">
        <p className="font-semibold text-white">
          {formatTemperature(forecast.temperatureMax, temperatureUnit)}
        </p>
        <p className="text-sm text-white/50">
          {formatTemperature(forecast.temperatureMin, temperatureUnit)}
        </p>
      </div>

      <div className="mt-1 space-y-1 text-xs text-white/60">
        <p>Rain: {forecast.precipitationProbability}%</p>
        <p>Wind: {forecast.windSpeed} km/h</p>
      </div>
    </article>
  );
}
