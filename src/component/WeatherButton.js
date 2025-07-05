import React from "react";
import { Button } from "react-bootstrap";

const WeatherButton = ({ cities, selectedCity, handleCityChange }) => {
  return (
    <>
    <div class="area-list">🏖️ 관심 도시</div>
    <div class="menu-container">
      <Button
        variant={`${selectedCity == null ? "outline-primary" : "primary"}`}
        onClick={() => handleCityChange("current")}
      >
        My Location
      </Button>

      {cities.map((city) => (
        <Button
          key = {city}
          variant={`${selectedCity == city ? "outline-primary" : "primary"}`}
          onClick={() => handleCityChange(city)}
        >
          {city}
        </Button>
      ))}
    </div>
    </>
  );
};

export default WeatherButton;
