# Hack4Impact-UMD Fall 2026 Technical Assessment

Welcome to the Hack4Impact-UMD Fall 2026 application assessment!

## Your Task

Your goal is to complete the functionality of this application: a small web app
that lets a user look up the **weather forecast for a US city**. You've been
given a set-up codebase — follow the instructions below to get started.

The app should:

1. Let the user **search for a US city** by name.
2. Show the matching cities as **suggestions** to pick from.
3. When a city is selected, **fetch and display its weather forecast**.
4. Handle **loading and error** states gracefully.

You will primarily work in two files:

- **`src/api/weather.ts`** — implement `fetchWeatherByCoordinates`, which calls
  the [National Weather Service API](https://www.weather.gov/documentation/services-web-api)
  to get a forecast for a set of coordinates.
- **`src/App.tsx`** — build the user interface.

Two helpers are already provided for you (you shouldn't need to change them):

- **`src/api/geocoding.ts`** — `searchCities(query)` turns a city name into a
  list of results with `{ lat, lng }` coordinates.
- **`src/types.ts`** — TypeScript types for the geocoder. You will need to implement types for the weather API.

## About the Weather API

The National Weather Service API is **free and requires no API key**. Fetching
a forecast is a 2-step lookup (points -> forecast). See the API docs for more info: 
<https://api.weather.gov>.

> ⚠️ Latitude and longitude coordinates must have **at most 4 decimal places** — use something like
> `lat.toFixed(4)`.

## Getting Started

You will need to have `pnpm` installed: <https://pnpm.io/>

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000` (the terminal
   will show the exact URL). No API key or `.env` file is needed.

## Tests / acceptance criteria

Once submitted, your project will receive a preliminary functionality score from the autograder.
This score only covers functionality requirements, a manual review will also score code style
and visuals. The autograder will expose a limited number of public tests that you can use to 
guide your work.

## Submitting

Submit your completed assessment on the application form. It'll receive a preliminary score from the autograder.
If you have any questions, please reach out!

Good luck! We look forward to seeing your work.
