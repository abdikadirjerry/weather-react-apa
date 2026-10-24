"use client";

import { Droplets, Gauge, MapPin, Thermometer, Wind } from "lucide-react";

import type { WeatherData } from "@/types/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

function getWeatherDescription(code: number): string {
  if (code === 0) {
    return "Clear sky";
  }

  if ([1, 2, 3].includes(code)) {
    return "Partly cloudy";
  }

  if ([45, 48].includes(code)) {
    return "Foggy";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "Drizzle";
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return "Rainy";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Snowy";
  }

  if ([80, 81, 82].includes(code)) {
    return "Rain showers";
  }

  if ([85, 86].includes(code)) {
    return "Snow showers";
  }

  if ([95, 96, 99].includes(code)) {
    return "Thunderstorm";
  }

  return "Unknown conditions";
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { current, location } = weather;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <MapPin size={16} />

              <span>
                {location.name}
                {location.country ? `, ${location.country}` : ""}
              </span>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <span className="text-6xl font-bold tracking-tight sm:text-7xl">
                {Math.round(current.temperature)}°
              </span>

              <span className="mt-2 text-lg text-slate-300">C</span>
            </div>

            <p className="mt-3 text-lg font-medium text-slate-200">
              {getWeatherDescription(current.weatherCode)}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Feels like {Math.round(current.apparentTemperature)}°C
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Droplets size={16} />
                <span className="text-xs font-medium">Humidity</span>
              </div>

              <p className="mt-3 text-xl font-semibold">{current.humidity}%</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Wind size={16} />
                <span className="text-xs font-medium">Wind</span>
              </div>

              <p className="mt-3 text-xl font-semibold">
                {Math.round(current.windSpeed)} km/h
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Thermometer size={16} />
                <span className="text-xs font-medium">Feels like</span>
              </div>

              <p className="mt-3 text-xl font-semibold">
                {Math.round(current.apparentTemperature)}°C
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Gauge size={16} />
                <span className="text-xs font-medium">Daylight</span>
              </div>

              <p className="mt-3 text-sm font-semibold">
                {current.isDay ? "Daytime" : "Nighttime"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
