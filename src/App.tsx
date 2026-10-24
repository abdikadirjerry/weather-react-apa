import { Cloud, Droplets, MapPin, Search, Wind } from "lucide-react";

function App() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Cloud size={21} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-950">
                  Weatherly
                </h1>
                <p className="text-xs text-slate-500">
                  Simple weather dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <MapPin size={16} />
            <span>Hargeisa</span>
          </div>
        </header>

        <section className="mt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-slate-500">
                Weather at a glance
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Check the weather anywhere.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Search for a city to see current weather conditions and a
                detailed forecast.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search for a city..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <Search size={17} />
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} />
                  <span>Hargeisa, Somaliland</span>
                </div>

                <p className="mt-2 text-sm text-slate-400">Today, October 24</p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <Cloud size={28} />
              </div>
            </div>

            <div className="mt-10 flex items-end gap-2">
              <span className="text-6xl font-bold tracking-tight text-slate-950 sm:text-7xl">
                27°
              </span>

              <span className="mb-2 text-sm font-medium text-slate-500">
                Celsius
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              Partly cloudy
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Droplets size={17} />
                  <span className="text-xs font-medium">Humidity</span>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-900">52%</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Wind size={17} />
                  <span className="text-xs font-medium">Wind</span>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-900">14 km/h</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Cloud size={17} />
                  <span className="text-xs font-medium">Feels like</span>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-900">28°</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="font-semibold text-slate-950">5-day forecast</h3>
              <p className="mt-1 text-sm text-slate-500">
                Your upcoming weather
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {[
                ["Sat", "27°", "20°"],
                ["Sun", "28°", "21°"],
                ["Mon", "26°", "19°"],
                ["Tue", "25°", "18°"],
                ["Wed", "27°", "19°"],
              ].map(([day, high, low]) => (
                <div
                  key={day}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <span className="w-10 text-sm font-semibold text-slate-700">
                    {day}
                  </span>

                  <Cloud size={19} className="text-slate-500" />

                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-slate-900">{high}</span>
                    <span className="text-slate-400">{low}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-slate-400">
          Weatherly — React weather mini project
        </footer>
      </div>
    </main>
  );
}

export default App;
