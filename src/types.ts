// ---------------------------------------------------------------------------
// Geocoding (Photon API) — used to turn a city name into coordinates.
// ---------------------------------------------------------------------------
export interface GeocodingResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  state?: string;
  country?: string;
}
