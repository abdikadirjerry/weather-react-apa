import { Thermometer } from "lucide-react";
import {
  formatTemperature,
  getTemperatureUnitLabel,
} from "@/lib/weather-utils";
import type { TemperatureUnit, WeatherData } from "@/types/weather";

interface WeatherCardProps {
  weather: WeatherData;
  temperatureUnit?: TemperatureUnit;
}

export function WeatherCard({
  weather,
  temperatureUnit = "celsius",
}: WeatherCardProps) {
  const { current, location } = weather;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/60">Current weather</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            {location.name}
            {location.country ? `, ${location.country}` : ""}
          </h2>

          <div className="mt-5 flex items-start gap-2">
            <span className="text-6xl font-bold tracking-tight text-white">
              {formatTemperature(current.temperature, temperatureUnit)}
            </span>
            <span className="mt-2 text-lg text-white/70">
              {getTemperatureUnitLabel(temperatureUnit)}
            </span>
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
            <Thermometer size={16} />
            Feels like{" "}
            {formatTemperature(current.apparentTemperature, temperatureUnit)}
            {getTemperatureUnitLabel(temperatureUnit)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-52">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-sm text-white/60">Humidity</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {current.humidity}%
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-sm text-white/60">Wind speed</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {current.windSpeed} km/h
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
