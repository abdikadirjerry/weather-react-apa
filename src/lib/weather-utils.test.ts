import { describe, expect, it } from "vitest";

import {
  convertTemperature,
  formatTemperature,
  getTemperatureUnitLabel,
} from "./weather-utils";

describe("convertTemperature", () => {
  it("keeps Celsius values unchanged", () => {
    expect(convertTemperature(25, "celsius")).toBe(25);
  });

  it("converts Celsius to Fahrenheit", () => {
    expect(convertTemperature(0, "fahrenheit")).toBe(32);
    expect(convertTemperature(100, "fahrenheit")).toBe(212);
  });

  it("converts negative temperatures correctly", () => {
    expect(convertTemperature(-40, "fahrenheit")).toBe(-40);
  });
});

describe("formatTemperature", () => {
  it("rounds Celsius temperatures", () => {
    expect(formatTemperature(24.6, "celsius")).toBe("25°");
    expect(formatTemperature(24.4, "celsius")).toBe("24°");
  });

  it("formats Fahrenheit temperatures", () => {
    expect(formatTemperature(0, "fahrenheit")).toBe("32°");
    expect(formatTemperature(25, "fahrenheit")).toBe("77°");
  });

  it("rounds converted Fahrenheit temperatures", () => {
    expect(formatTemperature(20.3, "fahrenheit")).toBe("69°");
  });
});

describe("getTemperatureUnitLabel", () => {
  it("returns the Celsius label", () => {
    expect(getTemperatureUnitLabel("celsius")).toBe("°C");
  });

  it("returns the Fahrenheit label", () => {
    expect(getTemperatureUnitLabel("fahrenheit")).toBe("°F");
  });
});
