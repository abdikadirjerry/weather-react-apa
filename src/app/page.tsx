"use client";

import {
  Cloud,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";

import { CurrentWeather } from "@/components/current-weather";
import { SearchBar } from "@/components/search-bar";
import { WeatherCard } from "@/components/weather-card";

const forecast = [
  {
    day: "Today",
    icon: Cloud,
    condition: "Partly Cloudy",
    temperature: "28°",
    low: "21°",
  },
  {
    day: "Tomorrow",
    icon: Cloud,
    condition: "Cloudy",
    temperature: "27°",
    low: "20°",
  },
  {
    day: "Monday",
    icon: Wind,
    condition: "Windy",
    temperature: "26°",
    low: "19°",
  },
  {
    day: "Tuesday",
    icon: Cloud,
    condition: "Mostly Cloudy",
    temperature: "29°",
    low: "21°",
  },
  {
    day: "Wednesday",
    icon: Cloud,
    condition: "Partly Cloudy",
    temperature: "30°",
    low: "22°",
  },
];

const weatherDetails = [
  {
    label: "Humidity",
    value: "68%",
    icon: Droplets,
  },
  {
    label: "Wind",
    value: "14 km/h",
    icon: Wind,
  },
  {
    label: "Visibility",
    value: "10 km",
    icon: Eye,
  },
  {
    label: "Pressure",
    value: "1012 hPa",
    icon: Gauge,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                <Cloud size={21} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight">SkyCast</h1>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Simple, accurate weather information at a glance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={17} />
            <span>Hargeisa, Somaliland</span>
          </div>
        </header>

        <section className="mb-8">
          <SearchBar />
        </section>

        <section className="mb-8">
          <CurrentWeather
            city="Hargeisa"
            country="Somaliland"
            temperature="28°"
            condition="Partly Cloudy"
            high="30°"
            low="21°"
          />
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {weatherDetails.map((detail) => (
            <WeatherCard
              key={detail.label}
              label={detail.label}
              value={detail.value}
              icon={detail.icon}
            />
          ))}
        </section>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold tracking-tight">5-Day Forecast</h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick look at the weather for the next few days.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {forecast.map((day) => (
              <div
                key={day.day}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-shadow hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {day.day}
                </p>

                <div className="my-5 flex items-center justify-center">
                  <day.icon size={34} strokeWidth={1.7} />
                </div>

                <p className="text-center text-sm text-slate-500">
                  {day.condition}
                </p>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-lg font-bold">{day.temperature}</span>
                  <span className="text-sm text-slate-400">{day.low}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Sunrise size={20} />
              </div>

              <div>
                <h2 className="font-bold">Sunrise</h2>
                <p className="text-sm text-slate-500">
                  Today&apos;s sunrise time
                </p>
              </div>
            </div>

            <p className="text-3xl font-bold tracking-tight">6:02 AM</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Sunset size={20} />
              </div>

              <div>
                <h2 className="font-bold">Sunset</h2>
                <p className="text-sm text-slate-500">
                  Today&apos;s sunset time
                </p>
              </div>
            </div>

            <p className="text-3xl font-bold tracking-tight">6:11 PM</p>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
          SkyCast Weather Dashboard
        </footer>
      </div>
    </main>
  );
}
