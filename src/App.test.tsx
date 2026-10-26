import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { getWeather, searchCity } from "./lib/weather-api";
import type { GeocodingResult, WeatherData } from "./types/weather";

vi.mock("./lib/weather-api", () => ({
  getWeather: vi.fn(),
  searchCity: vi.fn(),
}));

vi.mock("./components/weather-card", () => ({
  WeatherCard: () => <div data-testid="weather-card">Current weather</div>,
}));

vi.mock("./components/forecast-card", () => ({
  ForecastCard: () => <div>Forecast day</div>,
}));

vi.mock("./components/search-bar", () => ({
  SearchBar: ({
    onSearch,
    isLoading,
  }: {
    onSearch: (city: string) => void;
    isLoading: boolean;
  }) => {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const input = form.elements.namedItem("city") as HTMLInputElement;
          onSearch(input.value);
        }}
      >
        <label htmlFor="city">City</label>
        <input id="city" name="city" />
        <button type="submit" disabled={isLoading}>
          Search
        </button>
      </form>
    );
  },
}));

const mockLocation: GeocodingResult = {
  id: 1,
  name: "Hargeisa",
  latitude: 9.56,
  longitude: 44.06,
  country: "Somaliland",
  admin1: "Maroodi Jeex",
};

const mockWeather: WeatherData = {
  location: {
    name: "Hargeisa",
    country: "Somaliland",
    latitude: 9.56,
    longitude: 44.06,
  },
  current: {
    temperature: 28,
    apparentTemperature: 30,
    humidity: 55,
    windSpeed: 12,
    weatherCode: 1,
    isDay: true,
  },
  daily: [
    {
      date: "2026-10-26",
      weatherCode: 1,
      temperatureMax: 30,
      temperatureMin: 20,
      precipitationProbability: 10,
      windSpeed: 12,
    },
  ],
};

describe("App loading and error handling", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the loading state while searching for a city", async () => {
    let resolveWeather!: (weather: WeatherData) => void;

    vi.mocked(searchCity).mockResolvedValue(mockLocation);
    vi.mocked(getWeather).mockImplementation(
      () =>
        new Promise<WeatherData>((resolve) => {
          resolveWeather = resolve;
        }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("City"), "Hargeisa");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Searching for Hargeisa...",
    );

    resolveWeather(mockWeather);

    expect(await screen.findByTestId("weather-card")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("displays weather after a successful city search", async () => {
    vi.mocked(searchCity).mockResolvedValue(mockLocation);
    vi.mocked(getWeather).mockResolvedValue(mockWeather);

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("City"), "Hargeisa");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByTestId("weather-card")).toBeInTheDocument();
    expect(
      screen.getByText("Hargeisa, Maroodi Jeex, Somaliland"),
    ).toBeInTheDocument();
  });

  it("shows a friendly message when the weather request fails", async () => {
    vi.mocked(searchCity).mockResolvedValue(mockLocation);
    vi.mocked(getWeather).mockRejectedValue(new TypeError("Network error"));

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("City"), "Hargeisa");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(
      await screen.findByText(
        "We couldn't connect to the weather service. Check your internet connection and try again.",
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("shows a helpful message when the city cannot be found", async () => {
    vi.mocked(searchCity).mockResolvedValue(null);

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("City"), "UnknownCity");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(
      await screen.findByText(
        'We couldn\'t find "UnknownCity". Check the spelling or try another city.',
      ),
    ).toBeInTheDocument();

    expect(getWeather).not.toHaveBeenCalled();
  });

  it("offers a retry button after a weather request fails", async () => {
    vi.mocked(searchCity).mockResolvedValue(mockLocation);
    vi.mocked(getWeather)
      .mockRejectedValueOnce(new TypeError("Network error"))
      .mockResolvedValueOnce(mockWeather);

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("City"), "Hargeisa");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await user.click(await screen.findByRole("button", { name: /try again/i }));

    expect(await screen.findByTestId("weather-card")).toBeInTheDocument();
    expect(getWeather).toHaveBeenCalledTimes(2);
  });
});
