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
import type {
  GeocodingResult,
  TemperatureUnit,
  WeatherData,
} from "./types/weather";

const HISTORY_KEY = "weatherly-search-history";
const FAVORITES_KEY = "weatherly-favorite-cities";
const TEMPERATURE_UNIT_KEY = "weatherly-temperature-unit";
const MAX_HISTORY_ITEMS = 5;

type RetryTarget =
  | { type: "search"; city: string }
  | { type: "location"; location: GeocodingResult }
  | { type: "current-location" };

function readSavedLocations(key: string): GeocodingResult[] {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

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

function readTemperatureUnit(): TemperatureUnit {
  try {
    const stored = localStorage.getItem(TEMPERATURE_UNIT_KEY);

    return stored === "fahrenheit" ? "fahrenheit" : "celsius";
  } catch {
    return "celsius";
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

function getGeolocationErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = error.code;

    if (code === 1) {
      return "Location permission was denied. Allow location access in your browser settings, then try again.";
    }

    if (code === 2) {
      return "Your device couldn't determine your location. Check that location services are enabled and try again.";
    }

    if (code === 3) {
      return "Finding your location took too long. Please try again.";
    }
  }

  return "We couldn't access your current location. Check your browser permissions and try again.";
}

function createCurrentLocation(
  latitude: number,
  longitude: number,
): GeocodingResult {
  const id =
    -Math.round((latitude + 90) * 10_000) * 100_000 -
    Math.round((longitude + 180) * 100);

  return {
    id,
    name: "Your location",
    latitude,
    longitude,
    country: "",
  };
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

  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() =>
    readTemperatureUnit(),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");
  const [retryTarget, setRetryTarget] = useState<RetryTarget | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Unable to save search history:", error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Unable to save favorite cities:", error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(TEMPERATURE_UNIT_KEY, temperatureUnit);
    } catch (error) {
      console.error("Unable to save temperature preference:", error);
    }
  }, [temperatureUnit]);

  async function loadLocation(location: GeocodingResult) {
    if (isLoading) return;

    setIsLoading(true);
    setError("");
    setRetryTarget({ type: "location", location });

    try {
      const weatherData = await getWeather(location);

      setWeather(weatherData);
      setActiveLocation(location);
      setRetryTarget(null);

      setHistory((previous) =>
        [location, ...previous.filter((item) => item.id !== location.id)].slice(
          0,
          MAX_HISTORY_ITEMS,
        ),
      );
    } catch (loadError) {
      console.error("Unable to load weather:", loadError);
      setError(getFriendlyErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(city: string) {
    const trimmedCity = city.trim();

    if (!trimmedCity || isLoading) return;

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

      setHistory((previous) =>
        [location, ...previous.filter((item) => item.id !== location.id)].slice(
          0,
          MAX_HISTORY_ITEMS,
        ),
      );
    } catch (searchError) {
      console.error("Weather search failed:", searchError);
      setError(getFriendlyErrorMessage(searchError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCurrentLocation() {
    if (isLoading) return;

    if (!("geolocation" in navigator)) {
      setError(
        "Your browser doesn't support geolocation. You can still search for a city manually.",
      );
      setRetryTarget(null);
      return;
    }

    setIsLoading(true);
    setIsLocating(true);
    setError("");
    setRetryTarget({ type: "current-location" });

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 15_000,
            maximumAge: 300_000,
          });
        },
      );

      const location = createCurrentLocation(
        position.coords.latitude,
        position.coords.longitude,
      );

      setIsLocating(false);
      setRetryTarget({ type: "location", location });

      const weatherData = await getWeather(location);

      setWeather(weatherData);
      setActiveLocation(location);
      setRetryTarget(null);

      setHistory((previous) =>
        [location, ...previous.filter((item) => item.id !== location.id)].slice(
          0,
          MAX_HISTORY_ITEMS,
        ),
      );
    } catch (locationError) {
      console.error("Current location request failed:", locationError);

      if (
        typeof locationError === "object" &&
        locationError !== null &&
        "code" in locationError
      ) {
        setError(getGeolocationErrorMessage(locationError));
      } else {
        setError(getFriendlyErrorMessage(locationError));
      }
    } finally {
      setIsLoading(false);
      setIsLocating(false);
    }
  }

  async function retryLastAction() {
    if (!retryTarget || isLoading) return;

    if (retryTarget.type === "search") {
      await handleSearch(retryTarget.city);
    } else if (retryTarget.type === "location") {
      await loadLocation(retryTarget.location);
    } else {
      await handleCurrentLocation();
    }
  }

  function toggleFavorite() {
    if (!activeLocation) return;

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

  function toggleTemperatureUnit() {
    setTemperatureUnit((currentUnit) =>
      currentUnit === "celsius" ? "fahrenheit" : "celsius",
    );
  }

  const currentIsFavorite =
    activeLocation !== null &&
    favorites.some((item) => item.id === activeLocation.id);

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <header className="mb-7 text-center sm:mb-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm sm:h-14 sm:w-14">
            <CloudSun size={27} aria-hidden="true" />
          </div>

          <div className="mt-4 flex flex-col items-center gap-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Weatherly
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Your simple weather dashboard
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTemperatureUnit}
              aria-label={`Switch to ${
                temperatureUnit === "celsius" ? "Fahrenheit" : "Celsius"
              }`}
              className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white p-1 text-xs font-bold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <span
                className={`rounded-full px-3 py-1.5 transition ${
                  temperatureUnit === "celsius"
                    ? "bg-slate-950 text-white"
                    : "text-slate-500"
                }`}
              >
                °C
              </span>

              <span
                className={`rounded-full px-3 py-1.5 transition ${
                  temperatureUnit === "fahrenheit"
                    ? "bg-slate-950 text-white"
                    : "text-slate-500"
                }`}
              >
                °F
              </span>
            </button>
          </div>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Search for any city to explore current weather conditions and a
            seven-day forecast. Save your favorite places for quick access.
          </p>
        </header>

        <section
          aria-label="Search for weather"
          className="mx-auto mb-7 w-full max-w-3xl sm:mb-8"
        >
          <SearchBar
            onSearch={handleSearch}
            onCurrentLocation={handleCurrentLocation}
            isLoading={isLoading}
            isLocating={isLocating}
          />

          {error && (
            <div
              role="alert"
              className="mt-4 flex min-w-0 flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-3 sm:flex-row sm:items-center sm:p-4"
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

                <p className="mt-1 break-words text-sm leading-5 text-red-700">
                  {error}
                </p>

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
                  className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <RefreshCw size={15} aria-hidden="true" />
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
              <LoaderCircle size={20} className="shrink-0 animate-spin" />

              <span className="font-medium">
                {isLocating
                  ? "Finding your current location..."
                  : retryTarget?.type === "search"
                    ? `Searching for ${retryTarget.city}...`
                    : "Loading weather data..."}
              </span>
            </div>
          )}
        </section>

        <section
          aria-label="Saved cities"
          className="mb-7 grid min-w-0 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-2"
        >
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Clock3 size={19} className="shrink-0 text-slate-600" />

                <h2 className="text-sm font-semibold text-slate-950 sm:text-base">
                  Recent searches
                </h2>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {history.length}
                </span>
              </div>

              {history.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  aria-label="Clear search history"
                >
                  <Trash2 size={14} aria-hidden="true" />
                  Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-3 py-5 text-center text-sm leading-6 text-slate-500 sm:rounded-2xl sm:px-4 sm:py-6">
                Your recent searches will appear here.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {history.map((location) => (
                  <li key={location.id}>
                    <button
                      type="button"
                      onClick={() => void loadLocation(location)}
                      disabled={isLoading}
                      className="flex min-h-14 w-full min-w-0 items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <MapPin size={17} aria-hidden="true" />
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

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Star
                size={19}
                className="shrink-0 text-amber-500"
                aria-hidden="true"
              />

              <h2 className="text-sm font-semibold text-slate-950 sm:text-base">
                Favorite cities
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {favorites.length}
              </span>
            </div>

            {favorites.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-3 py-5 text-center text-sm leading-6 text-slate-500 sm:rounded-2xl sm:px-4 sm:py-6">
                Search for a city, then select “Add to favorites” to save it
                here.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {favorites.map((location) => (
                  <li
                    key={location.id}
                    className="flex min-w-0 items-center gap-2 rounded-xl px-2.5 py-2 transition hover:bg-slate-50 sm:rounded-2xl sm:px-3"
                  >
                    <button
                      type="button"
                      onClick={() => void loadLocation(location)}
                      disabled={isLoading}
                      className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-xl py-1 text-left focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <MapPin size={17} aria-hidden="true" />
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

                    <button
                      type="button"
                      onClick={() =>
                        setFavorites((previous) =>
                          previous.filter((item) => item.id !== location.id),
                        )
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      aria-label={`Remove ${location.name} from favorites`}
                      title="Remove favorite"
                    >
                      <Heart size={17} fill="currentColor" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {weather ? (
          <div className="min-w-0 space-y-7 sm:space-y-8">
            <div className="flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current conditions
                </p>

                <p className="mt-1 break-words text-sm text-slate-600">
                  {activeLocation
                    ? getLocationLabel(activeLocation)
                    : weather.location.name}
                </p>
              </div>

              <button
                type="button"
                onClick={toggleFavorite}
                className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-300 sm:w-auto ${
                  currentIsFavorite
                    ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Star
                  size={17}
                  aria-hidden="true"
                  fill={currentIsFavorite ? "currentColor" : "none"}
                />

                {currentIsFavorite ? "Remove favorite" : "Add to favorites"}
              </button>
            </div>

            <WeatherCard weather={weather} temperatureUnit={temperatureUnit} />

            <section
              aria-label="Seven-day weather forecast"
              className="min-w-0"
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  7-Day Forecast
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Daily temperatures, rain probability, and wind conditions.
                </p>

                <p className="mt-2 text-xs text-slate-400 sm:hidden">
                  Swipe horizontally to see all seven days.
                </p>
              </div>

              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:thin] sm:gap-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 xl:grid-cols-7">
                {weather.daily.map((forecast) => (
                  <div
                    key={forecast.date}
                    className="w-[min(72vw,190px)] shrink-0 snap-start sm:w-[190px] lg:w-auto"
                  >
                    <ForecastCard
                      forecast={forecast}
                      temperatureUnit={temperatureUnit}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : isLoading ? (
          <section
            aria-hidden="true"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center shadow-sm sm:rounded-3xl sm:px-6 sm:py-16"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <LoaderCircle size={28} className="animate-spin" />
            </div>

            <p className="mt-5 font-semibold text-slate-900">
              Getting your forecast ready
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please wait while we retrieve the latest weather data.
            </p>
          </section>
        ) : error ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center sm:rounded-3xl sm:px-6 sm:py-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <CloudSun size={26} aria-hidden="true" />
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
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center sm:rounded-3xl sm:px-6 sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <CloudSun size={26} aria-hidden="true" />
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

        <footer className="mt-8 pb-2 text-center text-xs leading-5 text-slate-400 sm:mt-10">
          Weatherly · Weather data provided by Open-Meteo.
        </footer>
      </div>
    </main>
  );
}

export default App;
