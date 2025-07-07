import React from "react";
import { Button } from "react-bootstrap";

const cityMap = {
  seoul: "서울",
  incheon: "인천",
  busan: "부산",
  daejeon: "대전",
  daegu: "대구",
  gwangju: "광주",
  junju: "전주",
  guri: "구리",
  sokcho: "속초",
  pohang: "포항",
  jeju: "제주",
  tokyo: "도쿄"
};

const WeatherButton = ({ cities, selectedCity, handleCityChange }) => {
  return (
    <>
    <div className="area-list">🏖️ 관심 도시</div>
    <div className="menu-container">
      <Button
        variant={`${selectedCity == null ? "outline-primary" : "primary"}`}
        onClick={() => handleCityChange("current")}
      >
        현재 위치
      </Button>

      {cities.map((city) => (
        <Button
          key = {city}
          variant={`${selectedCity == city ? "outline-primary" : "primary"}`}
          onClick={() => handleCityChange(city)}
        >
          {cityMap[city.toLowerCase()] || city}
        </Button>
      ))}
    </div>
    </>
  );
};

export default WeatherButton;
