import React from "react";
import { Button } from "react-bootstrap";
import useGlobalStore from '../store/useGlobalStore';

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
  jeju: "제주"
};

const WeatherButton = ({ cities }) => {
  const city = useGlobalStore((state) => state.city);
  const setCity = useGlobalStore((state) => state.setCity);
  const handleCityChange = (city) => {
    if (city === "current") {
      setCity(null);
    } else {
      setCity(city);
    }
  };
  return (
    <>
    <div className="area-list">🏖️ 관심 도시</div>
    <div className="menu-container">
      <Button
        variant={`${city == null ? "outline-primary" : "primary"}`}
        onClick={() => handleCityChange("current")}
      >
        현재 위치
      </Button>

      {cities.map((cityName) => (
        <Button
          key={cityName}
          variant={`${city == cityName ? "outline-primary" : "primary"}`}
          onClick={() => handleCityChange(cityName)}
        >
          {cityMap[cityName.toLowerCase()] || cityName}
        </Button>
      ))}
    </div>
    </>
  );
};

export default WeatherButton;
