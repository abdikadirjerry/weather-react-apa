import { LoaderCircle, Navigation, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

interface SearchBarProps {
  onSearch: (city: string) => Promise<void>;
  onCurrentLocation: () => Promise<void>;
  isLoading: boolean;
  isLocating: boolean;
}

export function SearchBar({
  onSearch,
  onCurrentLocation,
  isLoading,
  isLocating,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery || isLoading) {
      return;
    }

    await onSearch(trimmedQuery);
    setQuery("");
  }

  return (
    <section
      aria-label="Weather search"
      className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-5"
    >
      <form
        onSubmit={handleSubmit}
        className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_auto_auto]"
      >
        <div className="relative min-w-0">
          <Search
            size={19}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a city..."
            aria-label="Search for a city"
            autoComplete="off"
            disabled={isLoading}
            className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-2xl sm:pr-4 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:rounded-2xl sm:px-6"
        >
          {isLoading && !isLocating ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search size={17} aria-hidden="true" />
              <span>Search</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => void onCurrentLocation()}
          disabled={isLoading}
          aria-label="Get weather for my current location"
          title="Use your device's current location"
          className="flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:rounded-2xl sm:px-5"
        >
          {isLocating ? (
            <LoaderCircle
              size={17}
              className="animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Navigation size={17} aria-hidden="true" />
          )}

          <span>{isLocating ? "Finding location..." : "Use my location"}</span>
        </button>
      </form>
    </section>
  );
}
