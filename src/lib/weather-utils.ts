import type { TemperatureUnit } from "@/types/weather";

export function convertTemperature(
  celsius: number,
  unit: TemperatureUnit,
): number {
  if (unit === "fahrenheit") {
    return (celsius * 9) / 5 + 32;
  }

  return celsius;
}

export function formatTemperature(
  celsius: number,
  unit: TemperatureUnit,
): string {
  return `${Math.round(convertTemperature(celsius, unit))}°`;
}

export function getTemperatureUnitLabel(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}
