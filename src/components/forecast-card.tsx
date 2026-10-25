import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Wind,
} from "lucide-react";

import type { DailyForecast } from "@/types/weather";

interface ForecastCardProps {
  forecast: DailyForecast;
  index: number;
}

function getWeatherDescription(weatherCode: number): string {
  if (weatherCode === 0) {
    return "Clear";
  }

  if (weatherCode === 1) {
    return "Mainly clear";
  }

  if (weatherCode === 2) {
    return "Partly cloudy";
  }

  if (weatherCode === 3) {
    return "Overcast";
  }

  if ([45, 48].includes(weatherCode)) {
    return "Fog";
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return "Drizzle";
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return "Rain";
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return "Snow";
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return "Storm";
  }

  return "Unknown";
}

function getWeatherIcon(weatherCode: number) {
  if (weatherCode === 0) {
    return Sun;
  }

  if ([1, 2, 3].includes(weatherCode)) {
    return Cloud;
  }

  if ([45, 48].includes(weatherCode)) {
    return CloudFog;
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return CloudDrizzle;
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return CloudRain;
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return CloudSnow;
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return CloudLightning;
  }

  return Cloud;
}

function formatDay(date: string, index: number): string {
  if (index === 0) {
    return "Today";
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(parsedDate);
}

function formatDate(date: string): string {
  const parsedDate = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

export function ForecastCard({ forecast, index }: ForecastCardProps) {
  const WeatherIcon = getWeatherIcon(forecast.weatherCode);
  const description = getWeatherDescription(forecast.weatherCode);

  return (
    <article
      aria-label={`${formatDay(forecast.date, index)} forecast: ${description}, ${Math.round(
        forecast.temperatureMax,
      )} degrees Celsius`}
      className={`h-full min-w-0 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        index === 0
          ? "border-slate-300 ring-1 ring-slate-200"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-bold ${
              index === 0 ? "text-slate-950" : "text-slate-800"
            }`}
          >
            {formatDay(forecast.date, index)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatDate(forecast.date)}
          </p>
        </div>

        {index === 0 && (
          <span className="shrink-0 rounded-full bg-slate-950 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Now
          </span>
        )}
      </div>

      <div className="my-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
          <WeatherIcon size={32} strokeWidth={1.7} aria-hidden="true" />
        </div>
      </div>

      <div className="text-center">
        <p className="truncate text-xs font-medium text-slate-500">
          {description}
        </p>

        <div className="mt-3 flex items-baseline justify-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-950">
            {Math.round(forecast.temperatureMax)}°
          </span>

          <span className="text-sm font-medium text-slate-400">
            {Math.round(forecast.temperatureMin)}°
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-slate-500">
            <Droplets size={14} className="shrink-0" aria-hidden="true" />
            <span>Rain</span>
          </span>

          <span className="font-semibold text-slate-700">
            {Math.round(forecast.precipitationProbability)}%
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-slate-500">
            <Wind size={14} className="shrink-0" aria-hidden="true" />
            <span>Wind</span>
          </span>

          <span className="font-semibold text-slate-700">
            {Math.round(forecast.windSpeed)} km/h
          </span>
        </div>
      </div>
    </article>
  );
}
