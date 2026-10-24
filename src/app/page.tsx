"use client";

import { useState } from "react";
import {
  AlertCircle,
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
import { getForecast, getWeatherData } from "@/lib/weather-data";
import type { WeatherData } from "@/types/weather";

const initialWeather = getWeatherData("Hargeisa");

export default function Home() {
  const [weather, setWeather] = useState<WeatherData>(
    initialWeather ?? {
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
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(city: string) {
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = getWeatherData(city);

    if (!result) {
      setError(
        `We couldn't find weather data for "${city}". Try Hargeisa, London, Dubai, Nairobi, or New York.`,
      );
      setIsLoading(false);
      return;
    }

    setWeather(result);
    setIsLoading(false);
  }

  const forecast = getForecast(weather);

  const weatherDetails = [
    {
      label: "Humidity",
      value: `${weather.humidity}%`,
      icon: Droplets,
    },
    {
      label: "Wind",
      value: `${weather.windSpeed} km/h`,
      icon: Wind,
    },
    {
      label: "Visibility",
      value: `${weather.visibility} km`,
      icon: Eye,
    },
    {
      label: "Pressure",
      value: `${weather.pressure} hPa`,
      icon: Gauge,
    },
  ];

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
            <span>
              {weather.city}, {weather.country}
            </span>
          </div>
        </header>

        <section className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {error && (
          <section className="mb-8" role="alert">
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">City not found</p>
                <p className="mt-1 text-sm leading-6 text-red-700">{error}</p>
              </div>
            </div>
          </section>
        )}

        <section className="mb-8">
          <CurrentWeather
            city={weather.city}
            country={weather.country}
            temperature={weather.temperature}
            condition={weather.condition}
            high={weather.high}
            low={weather.low}
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
            {forecast.map((day) => {
              const Icon = day.condition.toLowerCase().includes("sunny")
                ? Cloud
                : day.condition.toLowerCase().includes("wind")
                  ? Wind
                  : Cloud;

              return (
                <div
                  key={day.day}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-shadow hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {day.day}
                  </p>

                  <div className="my-5 flex items-center justify-center">
                    <Icon size={34} strokeWidth={1.7} />
                  </div>

                  <p className="text-center text-sm text-slate-500">
                    {day.condition}
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="text-lg font-bold">
                      {day.temperature}°
                    </span>
                    <span className="text-sm text-slate-400">{day.low}°</span>
                  </div>
                </div>
              );
            })}
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

            <p className="text-3xl font-bold tracking-tight">
              {weather.sunrise}
            </p>
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

            <p className="text-3xl font-bold tracking-tight">
              {weather.sunset}
            </p>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
          SkyCast Weather Dashboard
        </footer>
      </div>
    </main>
  );
}
