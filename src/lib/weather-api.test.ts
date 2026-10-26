import { afterEach, describe, expect, it, vi } from "vitest";
import { reverseGeocode } from "@/lib/weather-api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("reverseGeocode", () => {
  it("returns the city and country from coordinates", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          address: {
            city: "Hargeisa",
            state: "Maroodi Jeex",
            country: "Somaliland",
          },
        }),
      }),
    );

    await expect(reverseGeocode(9.56, 44.06)).resolves.toEqual({
      name: "Hargeisa",
      admin1: "Maroodi Jeex",
      country: "Somaliland",
    });
  });

  it("uses the town when the city is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          address: {
            town: "Example Town",
            country: "Somaliland",
          },
        }),
      }),
    );

    await expect(reverseGeocode(9.56, 44.06)).resolves.toEqual({
      name: "Example Town",
      admin1: undefined,
      country: "Somaliland",
    });
  });

  it("returns null when the response has no address", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }),
    );

    await expect(reverseGeocode(9.56, 44.06)).resolves.toBeNull();
  });

  it("throws an error when the API request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    await expect(reverseGeocode(9.56, 44.06)).rejects.toThrow(
      "Unable to identify your current location.",
    );
  });
});
