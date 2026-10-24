import { Cloud, MapPin, Sun, Wind } from "lucide-react";

interface CurrentWeatherProps {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
}

function getWeatherIcon(condition: string) {
  const normalizedCondition = condition.toLowerCase();

  if (normalizedCondition.includes("sunny")) {
    return Sun;
  }

  if (normalizedCondition.includes("wind")) {
    return Wind;
  }

  return Cloud;
}

export function CurrentWeather({
  city,
  country,
  temperature,
  condition,
  high,
  low,
}: CurrentWeatherProps) {
  const WeatherIcon = getWeatherIcon(condition);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={16} />
              <span>
                {city}, {country}
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-slate-400">
              Current weather
            </p>

            <div className="mt-2 flex items-start">
              <span className="text-7xl font-bold tracking-tighter text-slate-950 sm:text-8xl">
                {temperature}°
              </span>

              <span className="ml-1 mt-3 text-2xl font-semibold text-slate-400">
                C
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-slate-700">
              {condition}
            </p>

            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
              <span>
                H <strong className="text-slate-900">{high}°</strong>
              </span>
              <span>
                L <strong className="text-slate-900">{low}°</strong>
              </span>
            </div>
          </div>

          <div className="flex h-36 w-36 items-center justify-center self-center rounded-full bg-slate-100 text-slate-700 sm:h-44 sm:w-44">
            <WeatherIcon size={76} strokeWidth={1.3} />
          </div>
        </div>
      </div>
    </div>
  );
}
