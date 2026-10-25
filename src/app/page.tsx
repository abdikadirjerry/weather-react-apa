"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CloudSun, LoaderCircle, Search } from "lucide-react";

import { ForecastCard } from "@/components/forecast-card";
import { WeatherCard } from "@/components/weather-card";
import { getWeather, searchCity } from "@/lib/weather-api";
import type { WeatherData } from "@/types/weather";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const location = await searchCity(trimmedCity);

      if (!location) {
        setWeather(null);
        setError(`We couldn't find a location called "${trimmedCity}".`);
        return;
      }

      const weatherData = await getWeather(location);

      setWeather(weatherData);
    } catch (searchError) {
      console.error(searchError);

      setWeather(null);
      setError(
        "Something went wrong while loading the weather. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <CloudSun size={28} />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Weather Dashboard
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Search for any city and get current weather conditions plus a
            seven-day forecast.
          </p>
        </header>

        <section className="mx-auto mb-8 max-w-2xl">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <label htmlFor="city" className="sr-only">
                Search city
              </label>

              <input
                id="city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Enter a city..."
                disabled={isLoading}
                autoComplete="off"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Search
                </>
              )}
            </button>
          </form>

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
        </section>

        {weather ? (
          <div className="space-y-8">
            <WeatherCard weather={weather} />

            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-950">
                  7-Day Forecast
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Daily temperature, rain probability, and wind conditions.
                </p>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-4 xl:grid-cols-7">
                {weather.daily.map((forecast) => (
                  <ForecastCard key={forecast.date} forecast={forecast} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          !isLoading &&
          !error && (
            <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <CloudSun size={26} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                Search for a city
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Enter a city name above to see current conditions and the
                seven-day forecast.
              </p>
            </section>
          )
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          Weather data provided by Open-Meteo.
        </footer>
      </div>
    </main>
  );
}
