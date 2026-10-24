import { useEffect, useState } from "react";
import {
  AlertCircle,
  CloudSun,
  Clock3,
  Heart,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";

import { ForecastCard } from "./components/forecast-card";
import { SearchBar } from "./components/search-bar";
import { WeatherCard } from "./components/weather-card";
import { getWeather, searchCity } from "./lib/weather-api";
import type { GeocodingResult, WeatherData } from "./types/weather";

const HISTORY_KEY = "weatherly-search-history";
const FAVORITES_KEY = "weatherly-favorite-cities";
const MAX_HISTORY_ITEMS = 5;

type RetryTarget =
  | { type: "search"; city: string }
  | { type: "location"; location: GeocodingResult };

function readSavedLocations(key: string): GeocodingResult[] {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is GeocodingResult =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.latitude === "number" &&
        typeof item.longitude === "number",
    );
  } catch {
    return [];
  }
}

function getLocationLabel(location: GeocodingResult): string {
  return [location.name, location.admin1, location.country]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");
}

function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return "We couldn't connect to the weather service. Check your internet connection and try again.";
  }

  return "We couldn't load the weather right now. The service may be temporarily unavailable. Please try again.";
}

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [activeLocation, setActiveLocation] = useState<GeocodingResult | null>(
    null,
  );

  const [history, setHistory] = useState<GeocodingResult[]>(() =>
    readSavedLocations(HISTORY_KEY),
  );

  const [favorites, setFavorites] = useState<GeocodingResult[]>(() =>
    readSavedLocations(FAVORITES_KEY),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryTarget, setRetryTarget] = useState<RetryTarget | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      setError("Unable to save search history in this browser.");
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      setError("Unable to save favorite cities in this browser.");
    }
  }, [favorites]);

  async function loadLocation(location: GeocodingResult) {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setRetryTarget({ type: "location", location });

    try {
      const weatherData = await getWeather(location);

      setWeather(weatherData);
      setActiveLocation(location);
      setRetryTarget(null);

      setHistory((previous) => {
        const withoutDuplicate = previous.filter(
          (item) => item.id !== location.id,
        );

        return [location, ...withoutDuplicate].slice(0, MAX_HISTORY_ITEMS);
      });
    } catch (loadError) {
      console.error("Unable to load weather:", loadError);
      setError(getFriendlyErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(city: string) {
    const trimmedCity = city.trim();

    if (!trimmedCity || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setRetryTarget({ type: "search", city: trimmedCity });

    try {
      const location = await searchCity(trimmedCity);

      if (!location) {
        setError(
          `We couldn't find "${trimmedCity}". Check the spelling or try another city.`,
        );
        setRetryTarget(null);
        return;
      }

      const weatherData = await getWeather(location);

      setWeather(weatherData);
      setActiveLocation(location);
      setRetryTarget(null);

      setHistory((previous) => {
        const withoutDuplicate = previous.filter(
          (item) => item.id !== location.id,
        );

        return [location, ...withoutDuplicate].slice(0, MAX_HISTORY_ITEMS);
      });
    } catch (searchError) {
      console.error("Weather search failed:", searchError);
      setError(getFriendlyErrorMessage(searchError));
    } finally {
      setIsLoading(false);
    }
  }

  async function retryLastAction() {
    if (!retryTarget || isLoading) {
      return;
    }

    if (retryTarget.type === "search") {
      await handleSearch(retryTarget.city);
    } else {
      await loadLocation(retryTarget.location);
    }
  }

  function toggleFavorite() {
    if (!activeLocation) {
      return;
    }

    const isFavorite = favorites.some((item) => item.id === activeLocation.id);

    if (isFavorite) {
      setFavorites((previous) =>
        previous.filter((item) => item.id !== activeLocation.id),
      );
      return;
    }

    setFavorites((previous) => [activeLocation, ...previous]);
  }

  function clearHistory() {
    setHistory([]);
  }

  const currentIsFavorite =
    activeLocation !== null &&
    favorites.some((item) => item.id === activeLocation.id);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <CloudSun size={28} />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Weatherly
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Search for any city to explore current weather conditions and a
            seven-day forecast. Save your favorite places for quick access.
          </p>
        </header>

        <section className="mx-auto mb-8 max-w-3xl">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {error && (
            <div
              role="alert"
              className="mt-4 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center"
            >
              <AlertCircle
                size={21}
                className="shrink-0 text-red-600"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-red-800">
                  Something needs your attention
                </p>
                <p className="mt-1 text-sm leading-5 text-red-700">{error}</p>
                {weather && (
                  <p className="mt-2 text-xs text-red-600">
                    Your previously loaded weather is still available below.
                  </p>
                )}
              </div>

              {retryTarget && (
                <button
                  type="button"
                  onClick={() => void retryLastAction()}
                  disabled={isLoading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw size={15} />
                  Try again
                </button>
              )}
            </div>
          )}

          {isLoading && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 text-sm text-sky-800"
            >
              <LoaderCircle size={20} className="animate-spin" />
              <span className="font-medium">
                {retryTarget?.type === "search"
                  ? `Searching for ${retryTarget.city}...`
                  : "Loading weather data..."}
              </span>
            </div>
          )}
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock3 size={19} className="text-slate-600" />
                <h2 className="font-semibold text-slate-950">
                  Recent searches
                </h2>
              </div>

              {history.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  aria-label="Clear search history"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Your recent searches will appear here.
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((location) => (
                  <li key={location.id}>
                    <button
                      type="button"
                      onClick={() => void loadLocation(location)}
                      disabled={isLoading}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <MapPin size={17} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-800">
                          {location.name}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {[location.admin1, location.country]
                            .filter(Boolean)
                            .join(", ") || "Location"}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Star size={19} className="text-amber-500" />
              <h2 className="font-semibold text-slate-950">Favorite cities</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {favorites.length}
              </span>
            </div>

            {favorites.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm leading-6 text-slate-500">
                Search for a city, then select “Add to favorites” to save it
                here.
              </p>
            ) : (
              <ul className="space-y-2">
                {favorites.map((location) => (
                  <li
                    key={location.id}
                    className="flex items-center gap-2 rounded-2xl px-3 py-2 transition hover:bg-slate-50"
                  >
                    <button
                      type="button"
                      onClick={() => void loadLocation(location)}
                      disabled={isLoading}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl py-1 text-left focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <MapPin size={17} />
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-800">
                          {location.name}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {[location.admin1, location.country]
                            .filter(Boolean)
                            .join(", ") || "Location"}
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFavorites((previous) =>
                          previous.filter((item) => item.id !== location.id),
                        )
                      }
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      aria-label={`Remove ${location.name} from favorites`}
                      title="Remove favorite"
                    >
                      <Heart size={17} fill="currentColor" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {weather ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current conditions
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {activeLocation
                    ? getLocationLabel(activeLocation)
                    : weather.location.name}
                </p>
              </div>

              <button
                type="button"
                onClick={toggleFavorite}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                  currentIsFavorite
                    ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Star
                  size={17}
                  fill={currentIsFavorite ? "currentColor" : "none"}
                />
                {currentIsFavorite ? "Remove favorite" : "Add to favorites"}
              </button>
            </div>

            <WeatherCard weather={weather} />

            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-950">
                  7-Day Forecast
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Daily temperatures, rain probability, and wind conditions.
                </p>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-4 xl:grid-cols-7">
                {weather.daily.map((forecast, index) => (
                  <ForecastCard
                    key={forecast.date}
                    forecast={forecast}
                    index={index}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : isLoading ? (
          <section
            aria-hidden="true"
            className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <LoaderCircle size={28} className="animate-spin" />
            </div>
            <p className="mt-5 font-semibold text-slate-900">
              Getting your forecast ready
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Please wait while we retrieve the latest weather data.
            </p>
          </section>
        ) : error ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <CloudSun size={26} />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No weather to display yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Check the message above and try searching for a city again. Your
              weather forecast will appear here when the request succeeds.
            </p>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <CloudSun size={26} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Check the weather anywhere
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Search for a city above to view its current weather and seven-day
              forecast. Your successful searches will be saved automatically.
            </p>
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-slate-400">
          Weatherly · Weather data provided by Open-Meteo.
        </footer>
      </div>
    </main>
  );
}

export default App;
