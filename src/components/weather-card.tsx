import { Droplets, Gauge, MapPin, Thermometer, Wind } from "lucide-react";

import type { WeatherData } from "@/types/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rainy";
  if ([71, 73, 75, 77].includes(code)) return "Snowy";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Unknown conditions";
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { current, location } = weather;

  return (
    <section
      aria-label="Current weather conditions"
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl"
    >
      <div className="bg-slate-950 px-4 py-6 text-white sm:px-8 sm:py-10">
        <div className="grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center lg:gap-8">
          <div className="min-w-0">
            <div className="flex min-w-0 items-start gap-2 text-sm text-slate-300">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />

              <span className="break-words">
                {location.name}
                {location.country ? `, ${location.country}` : ""}
              </span>
            </div>

            <div className="mt-5 flex items-start gap-2 sm:mt-6 sm:gap-3">
              <span className="text-6xl font-bold tracking-tight sm:text-7xl">
                {Math.round(current.temperature)}°
              </span>

              <span className="mt-2 text-lg text-slate-300">C</span>
            </div>

            <p className="mt-3 break-words text-lg font-medium text-slate-200">
              {getWeatherDescription(current.weatherCode)}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Feels like {Math.round(current.apparentTemperature)}°C
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3">
            <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-3 sm:rounded-2xl sm:p-4">
              <div className="flex flex-wrap items-center gap-2 text-slate-400">
                <Droplets size={16} aria-hidden="true" />
                <span className="text-xs font-medium">Humidity</span>
              </div>
              <p className="mt-3 break-words text-xl font-semibold">
                {current.humidity}%
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-3 sm:rounded-2xl sm:p-4">
              <div className="flex flex-wrap items-center gap-2 text-slate-400">
                <Wind size={16} aria-hidden="true" />
                <span className="text-xs font-medium">Wind</span>
              </div>
              <p className="mt-3 break-words text-xl font-semibold">
                {Math.round(current.windSpeed)} km/h
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-3 sm:rounded-2xl sm:p-4">
              <div className="flex flex-wrap items-center gap-2 text-slate-400">
                <Thermometer size={16} aria-hidden="true" />
                <span className="text-xs font-medium">Feels like</span>
              </div>
              <p className="mt-3 break-words text-xl font-semibold">
                {Math.round(current.apparentTemperature)}°C
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-3 sm:rounded-2xl sm:p-4">
              <div className="flex flex-wrap items-center gap-2 text-slate-400">
                <Gauge size={16} aria-hidden="true" />
                <span className="text-xs font-medium">Daylight</span>
              </div>
              <p className="mt-3 break-words text-sm font-semibold">
                {current.isDay ? "Daytime" : "Nighttime"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
