import {
  Cloud,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

import type { WeatherData } from "@/types/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

function getWeatherDescription(weatherCode: number): string {
  if (weatherCode === 0) {
    return "Clear sky";
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
    return "Foggy";
  }

  if ([51, 53, 55].includes(weatherCode)) {
    return "Drizzle";
  }

  if ([56, 57].includes(weatherCode)) {
    return "Freezing drizzle";
  }

  if ([61, 63, 65].includes(weatherCode)) {
    return "Rain";
  }

  if ([66, 67].includes(weatherCode)) {
    return "Freezing rain";
  }

  if ([71, 73, 75, 77].includes(weatherCode)) {
    return "Snow";
  }

  if ([80, 81, 82].includes(weatherCode)) {
    return "Rain showers";
  }

  if ([85, 86].includes(weatherCode)) {
    return "Snow showers";
  }

  if ([95].includes(weatherCode)) {
    return "Thunderstorm";
  }

  if ([96, 99].includes(weatherCode)) {
    return "Thunderstorm with hail";
  }

  return "Unknown conditions";
}

function getWeatherIcon(weatherCode: number, isDay: boolean) {
  if (weatherCode === 0 && isDay) {
    return Sun;
  }

  if (weatherCode === 0 && !isDay) {
    return Cloud;
  }

  return Cloud;
}

interface DetailItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-slate-50 p-3.5 sm:p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
        <Icon size={18} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { current, location } = weather;

  const WeatherIcon = getWeatherIcon(current.weatherCode, current.isDay);
  const description = getWeatherDescription(current.weatherCode);

  return (
    <article
      aria-label={`Current weather in ${location.name}`}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  current.isDay ? "bg-amber-400" : "bg-indigo-400"
                }`}
                aria-hidden="true"
              />
              {current.isDay ? "Daytime" : "Nighttime"}
            </div>

            <h2 className="mt-3 truncate text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {location.name}
            </h2>

            {location.country && (
              <p className="mt-1 truncate text-sm text-slate-500">
                {location.country}
              </p>
            )}

            <p className="mt-5 text-base font-medium text-slate-600">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-5 sm:gap-7">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 sm:h-24 sm:w-24">
              <WeatherIcon size={46} strokeWidth={1.7} aria-hidden="true" />
            </div>

            <div>
              <div className="flex items-start">
                <span className="text-6xl font-bold tracking-tight text-slate-950 sm:text-7xl">
                  {Math.round(current.temperature)}
                </span>
                <span className="mt-1 text-2xl font-semibold text-slate-400">
                  °C
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Feels like{" "}
                <span className="font-semibold text-slate-700">
                  {Math.round(current.apparentTemperature)}°C
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DetailItem
            icon={Droplets}
            label="Humidity"
            value={`${Math.round(current.humidity)}%`}
          />

          <DetailItem
            icon={Wind}
            label="Wind"
            value={`${Math.round(current.windSpeed)} km/h`}
          />

          <DetailItem
            icon={Thermometer}
            label="Feels like"
            value={`${Math.round(current.apparentTemperature)}°C`}
          />

          <DetailItem
            icon={Gauge}
            label="Weather code"
            value={String(current.weatherCode)}
          />
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 sm:px-7 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Eye size={14} aria-hidden="true" />
            Live weather conditions
          </span>

          <span>
            {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
          </span>
        </div>
      </div>
    </article>
  );
}
