"use client";

import { Cloud, CloudRain, CloudSun, Droplets, Sun, Wind } from "lucide-react";

import type { DailyForecast } from "@/types/weather";

interface ForecastCardProps {
  forecast: DailyForecast;
  index: number;
}

function getWeatherDescription(code: number): string {
  if (code === 0) {
    return "Clear";
  }

  if ([1, 2, 3].includes(code)) {
    return "Cloudy";
  }

  if ([45, 48].includes(code)) {
    return "Fog";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "Drizzle";
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return "Rain";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Snow";
  }

  if ([80, 81, 82].includes(code)) {
    return "Showers";
  }

  if ([85, 86].includes(code)) {
    return "Snow showers";
  }

  if ([95, 96, 99].includes(code)) {
    return "Storm";
  }

  return "Unknown";
}

function getWeatherIcon(code: number) {
  if (code === 0) {
    return Sun;
  }

  if ([1, 2].includes(code)) {
    return CloudSun;
  }

  if ([3, 45, 48].includes(code)) {
    return Cloud;
  }

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
    <article className="min-w-[150px] flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">
          {formatForecastDate(forecast.date, index)}
        </p>

        {index === 0 && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
            Now
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <WeatherIcon size={28} />
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-medium text-slate-600">
        {description}
      </p>

      <div className="mt-4 flex items-end justify-center gap-2">
        <span className="text-2xl font-bold text-slate-950">
          {Math.round(forecast.temperatureMax)}°
        </span>

        <span className="mb-0.5 text-sm text-slate-400">
          {Math.round(forecast.temperatureMin)}°
        </span>
      </div>

      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Droplets size={13} />
            Rain
          </span>

          <span className="font-semibold text-slate-700">
            {forecast.precipitationProbability}%
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Wind size={13} />
            Wind
          </span>

          <span className="font-semibold text-slate-700">
            {Math.round(forecast.windSpeed)} km/h
          </span>
        </div>
      </div>
    </article>
  );
}
