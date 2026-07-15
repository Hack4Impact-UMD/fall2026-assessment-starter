# Test Contract

This document defines everything the automated autograder test suite (Professor) depends on. If
your app satisfies this contract, the suite will run correctly regardless of how you
structure your components, style them, or manage state. **It is vitally important that you adhere to this contract to achieve a good score.**

The suite is **implementation-agnostic**: it never inspects class names, ids, or
DOM nesting. It only tests for functionality, we will manually examine your submission for code quality and visual accuracy. It finds elements through three stable hooks only:

1. **`data-testid` attributes** — for app-specific UI (search box, forecast, etc.).
2. **ARIA roles + accessible names** — for standard semantic elements (headings, links).
3. **Visible text** — for fixed copy and messages.

Put the `data-testid`s listed below on whatever element you choose (a `<div>`, a
`<button>`, a `<li>`… it does not matter), and render the required text. For example:
```html
<div data-testid="hello">
</div>
```

---

## 1. Routes

| Path | Page | Notes |
|------|------|-------|
| `/` | Home / search | Landing page with the city search box. |
| `/forecast/:lat/:lon` | Forecast | `lat`/`lon` are **path segments**, not query params. Must be directly linkable and survive a reload (e.g. `/forecast/38.9807/-76.9369`). |

Selecting a city on the home page must navigate to `/forecast/{lat}/{lon}`.

---

## 2. `data-testid` contract

### Home page (`/`)

| `data-testid` | Put it on | Requirements |
|---------------|-----------|--------------|
| `city-search-input` | The text input the user types a city into | Must accept typed text. |
| `city-suggestions` | The container that wraps the suggestion list | **Must not be in the DOM** when there are no suggestions (0 elements). Present when suggestions are showing. |
| `city-suggestion` | Each individual city suggestion (one per result) | Its **visible text must equal the city's display name** (see §4). Must be clickable and navigate to that city's forecast. |

### Forecast page (`/forecast/:lat/:lon`)

| `data-testid` | Put it on | Requirements |
|---------------|-----------|--------------|
| `loading` | The loading indicator | Present **while** the forecast request is in flight; gone afterward. |
| `error` | The error message element | Present only in an error state; its **text is the error message** (see §5). |
| `forecast` | The wrapper for a successfully loaded forecast | Present only on success. Absent (0 elements) while loading or on error. |
| `location-name` | The resolved location heading | Text = the location name (see §4). |
| `current-temp` | The current temperature | Text = `` `${temperature}°${temperatureUnit}` `` e.g. `88°F` (see §4). |
| `forecast-period` | Each **upcoming** period card (one per period **after** the first) | Each must contain that period's **name** and **temperature** as text. |

> **Current vs. upcoming:** the first period in the API response is the "current
> conditions" card (`current-temp`). Every period **after** the first is one
> `forecast-period`. So *N* periods → 1 current + *(N − 1)* `forecast-period`s.

---

## 3. Semantic (role/text) contract

These are matched by ARIA role + accessible name or by visible text, so use real
semantic HTML.

| What | How the suite finds it | Requirement |
|------|------------------------|-------------|
| Main title (both pages) | `heading`, level 1 (`<h1>`) | Text: **`US Weather Forecast`** |
| "Upcoming" section title | `heading`, name `Upcoming` (any level) | Text contains **`Upcoming`** |
| Home subtitle | visible text | **`Search for a US city to see its National Weather Service forecast.`** |
| Home hint | visible text | Must contain **`Try searching for a city like`** |
| Footer link | `link`, name `National Weather Service API` | `href` = `https://www.weather.gov/documentation/services-web-api` |
| Back link (forecast page) | `link`, name `Search another city` | Links to `/`. Rendered text like `← Search another city` is fine (the arrow is ignored in the accessible name). |
| Page `<title>` | document title | **`Weather Forecast · Hack4Impact-UMD`** |

---

## 4. Value / format contracts

- **Suggestion display name** (`city-suggestion` text): `"{name}, {state}, {country}"`,
  omitting any missing part, e.g. `College Park, Maryland, United States`.
- **Current temperature** (`current-temp` text): `` `${temperature}°${temperatureUnit}` ``
  with a degree sign, e.g. `88°F`.
- **Location name** (`location-name` text):
  - `"{city}, {state}"` when the points response includes a relative location
    (e.g. `College Park, MD`);
  - otherwise the literal **`Selected location`**.
- **Precipitation line** (in the current card): render **only when**
  `probabilityOfPrecipitation.value` is not `null`, as text `"{value}% chance of precip"`
  (e.g. `40% chance of precip`). When the value is `null`, this text must not appear.

---

## 5. Error messages (exact / substring)

The `error` element's text must match:

| Situation | Required text |
|-----------|---------------|
| `lat` or `lon` is not a finite number | Exactly: **`That doesn't look like a valid set of coordinates.`** |
| Points lookup (step 1) fails | Must contain: **`only covers US locations`** |
| Forecast lookup (step 2) fails | Must contain: **`Weather lookup failed (forecast)`** |

---

## 6. External API contract

The suite mocks the network by **intercepting requests to these exact hosts/paths**
and replaying saved fixtures. Your app must call these services with these URL
shapes, or the mocks won't match and requests will hit the real network. If you use the API correctly, this won't be an issue.

| Purpose | Method + URL the app must request | Intercept glob used by tests |
|---------|-----------------------------------|------------------------------|
| Geocode a city | `GET https://photon.komoot.io/api?q={query}&limit=...&lang=...` | `**://photon.komoot.io/api**` |
| NWS step 1 — points | `GET https://api.weather.gov/points/{lat},{lon}` | `**://api.weather.gov/points/**` |
| NWS step 2 — forecast | `GET {properties.forecast}` from step 1 (a `.../gridpoints/...` URL) | `**://api.weather.gov/gridpoints/**` |
| Weather icons | `GET https://api.weather.gov/icons/...` | `**://api.weather.gov/icons/**` |

Your code must consume the **real response shapes** of these services (the
fixtures are captured from live responses of past data.


---

## 7. Behavioral contracts

**Search (home page)**

- **Debounced:** typing a full query keystroke-by-keystroke must collapse into a
  **single** geocoding request once typing settles (don't fire one request per
  keystroke).
- **Minimum length:** a query shorter than **2 characters** fires **no** request
  and shows no suggestions.
- **US filter:** show only US **cities/towns** (`countrycode === "US"` and
  `osm_value`/`type` of `city` or `town`); drop everything else.
- **No matches:** an empty result set shows **no suggestions container** and no
  error message.
- **Request failure:** a failed geocoding request is swallowed — no suggestions,
  no crash, no error UI.
- **Out-of-order safety:** if an older, slower request resolves after a newer
  one, the **newer** query's results must win.
- **Selection:** clicking a suggestion navigates to `/forecast/{lat}/{lon}`.

**Forecast (forecast page)**

- Show `loading` while fetching; replace it with `forecast` on success or `error`
  on failure.
- **Coordinate rounding:** round `lat`/`lon` to **4 decimal places** before the
  points request (NWS redirects on higher precision). e.g. navigating to
  `/forecast/38.980699/-76.936912` must request `/points/38.9807,-76.9369`.
- **Invalid coordinates:** if `lat`/`lon` aren't finite numbers, show the
  validation error **without making any network request**.
- Render the current conditions from the **first** period and one
  `forecast-period` per remaining period (may be zero).

---

## 8. Quick self-check

Before submitting, verify your app produces each `data-testid` in §2, the exact
strings in §3–§5, and calls the endpoints in §6. When you submit, the **`Test IDs`** suite will be quick check that every required `data-testid` in §2 is reachable. If it
fails, the rest of the suite won't be able to find your UI, so fix that first. 

Make sure to run `pnpm build` to verify that the app builds correctly. Build configuration files (`vite.config.ts` and `tsconfig.*`) will be replaced at build time when run on the autograder. Do not modify these files to ensure your local build environment matches that of the autograder.

## 9. Technical Notes

Your assessment will be automatically graded by [Professor](https://github.com/Hack4Impact-UMD/professor)

* Professor runs you assessment in an isolated grading container with a minimal Debian linux environment. 
* Professor builds a production version of your assessment (`tsc -b && vite build`) and runs Playwright tests against it on a headless Chromium browser.  
* Professor uses the `pnpm` package manager.
* Professor replaces build config files with trusted files sources from our test repo to ensure a consistent, safe build environment.
* Professor ignores pre/post install `package.json` scripts.
