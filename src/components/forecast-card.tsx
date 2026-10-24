import { Cloud, CloudRain, CloudSun, Droplets, Sun, Wind } from "lucide-react";

import type { DailyForecast } from "@/types/weather";

interface ForecastCardProps {
  forecast: DailyForecast;
  index: number;
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Storm";

  return "Unknown";
}

function getWeatherIcon(code: number) {
  if (code === 0) return Sun;
  if ([1, 2].includes(code)) return CloudSun;
  if ([3, 45, 48].includes(code)) return Cloud;

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return CloudRain;
  }

  return Cloud;
}

function formatForecastDate(date: string, index: number): string {
  if (index === 0) {
    return "Today";
  }

  const forecastDate = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(forecastDate);
}

export function ForecastCard({ forecast, index }: ForecastCardProps) {
  const WeatherIcon = getWeatherIcon(forecast.weatherCode);
  const description = getWeatherDescription(forecast.weatherCode);

  return (
    <article
      aria-label={`${formatForecastDate(forecast.date, index)} forecast: ${description}`}
      className="min-w-[145px] flex-1 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md sm:min-w-0 sm:p-4"
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">
          {formatForecastDate(forecast.date, index)}
        </p>

        {index === 0 && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
            Today
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center sm:mt-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-14 sm:w-14 sm:rounded-2xl">
          <WeatherIcon size={27} aria-hidden="true" />
        </div>
      </div>

      <p className="mt-3 min-h-5 break-words text-center text-sm font-medium text-slate-600">
        {description}
      </p>

      <div className="mt-3 flex items-end justify-center gap-2 sm:mt-4">
        <span className="text-2xl font-bold text-slate-950">
          {Math.round(forecast.temperatureMax)}°
        </span>

        <span className="mb-0.5 text-sm text-slate-400">
          {Math.round(forecast.temperatureMin)}°
        </span>
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 sm:mt-5 sm:pt-4">
        <div className="flex min-w-0 items-center justify-between gap-2 text-xs">
          <span className="flex min-w-0 items-center gap-1.5 text-slate-500">
            <Droplets size={13} className="shrink-0" aria-hidden="true" />
            <span>Rain</span>
          </span>

          <span className="shrink-0 font-semibold text-slate-700">
            {forecast.precipitationProbability}%
          </span>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-2 text-xs">
          <span className="flex min-w-0 items-center gap-1.5 text-slate-500">
            <Wind size={13} className="shrink-0" aria-hidden="true" />
            <span>Wind</span>
          </span>

          <span className="shrink-0 font-semibold text-slate-700">
            {Math.round(forecast.windSpeed)} km/h
          </span>
        </div>
      </div>
    </article>
  );
}
