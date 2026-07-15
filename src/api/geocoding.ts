// Turns a search string like "college park" into a list of US cities with
// coordinates, using the free Photon geocoding API (https://photon.komoot.io).
//
// This file is provided for you — you should NOT need to change it. Use
// `searchCities` to power your search box, then hand the chosen result's
// { lat, lng } to the weather API.
import type { GeocodingResult } from "../types";

const PHOTON_BASE_URL = "https://photon.komoot.io";

export const searchCities = async (
  query: string
): Promise<GeocodingResult[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const url = `${PHOTON_BASE_URL}/api?q=${encodeURIComponent(
      query
    )}&limit=10&lang=en`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding Error: ${response.status}`);
    }

    const data = await response.json();

    const results: GeocodingResult[] = data.features
      // The National Weather Service only covers the United States, so keep
      // US cities and towns.
      .filter((item: any) => {
        const p = item.properties;
        const isCityOrTown =
          p.osm_value === "city" ||
          p.osm_value === "town" ||
          p.type === "city" ||
          p.type === "town";
        return isCityOrTown && p.countrycode === "US";
      })
      .map((item: any) => {
        const p = item.properties;
        return {
          name: p.name,
          displayName: [p.name, p.state, p.country]
            .filter(Boolean)
            .join(", "),
          lat: item.geometry.coordinates[1], // GeoJSON is [lng, lat]
          lng: item.geometry.coordinates[0],
          state: p.state,
          country: p.country,
        };
      });

    return results;
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
};
