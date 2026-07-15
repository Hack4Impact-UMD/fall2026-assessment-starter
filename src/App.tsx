import { searchCities } from "./api/geocoding";
import { fetchWeather } from "./api/weather";

// These imports point you at the tools you'll use. Remove these two lines once
// you start using them in your component.
void searchCities;
void fetchWeather;

const App = () => {
  // Replace this with your code. Good luck!
  return (
    <div className="page">
      <header className="header">
        <h1>US Weather Forecast</h1>
        <p className="subtitle">
          Fall 2026 Hack4Impact-UMD Technical Application Assessment
        </p>
      </header>
    </div>
  );
};

export default App;
