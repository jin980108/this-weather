import React from 'react';
import Lottie from 'lottie-react';
import sunny from '../image/sunny.json';
import cloudy from '../image/cloudy.json';
import rainy from '../image/rainy.json';
import foggy from '../image/foggy.json';
import useGlobalStore from '../store/useGlobalStore';
import { getFormattedTime } from './CurrentTime';
import { Button } from 'react-bootstrap';

const WeatherBox = () => {
  const weather = useGlobalStore((state) => state.weatherData);
  const isLoading = useGlobalStore((state) => state.isLoading);
  const city = useGlobalStore((state) => state.city);
  const setCity = useGlobalStore((state) => state.setCity);

  if (!weather?.name) return null;

  const translateWeatherDescription = (description) => {
    const weatherMapping = {
      // 맑음
      'clear sky': '맑음',
      '튼구름': '맑음',
      
      // 흐림
      'few clouds': '구름 조금',
      'scattered clouds': '구름 많음',
      'broken clouds': '흐림',
      'overcast clouds': '흐림',
      '온흐림': '흐림',
      
      // 비
      'light rain': '가벼운 비',
      'moderate rain': '비',
      'heavy intensity rain': '강한 비',
      'very heavy rain': '매우 강한 비',
      'extreme rain': '폭우',
      'freezing rain': '얼음 비',
      'light intensity shower rain': '가벼운 소나기',
      'shower rain': '소나기',
      'heavy intensity shower rain': '강한 소나기',
      'ragged shower rain': '소나기',
      
      // 눈
      'light snow': '가벼운 눈',
      'snow': '눈',
      'heavy snow': '강한 눈',
      'sleet': '진눈깨비',
      'light shower sleet': '가벼운 진눈깨비',
      'shower sleet': '진눈깨비',
      'light rain and snow': '비와 눈',
      'rain and snow': '비와 눈',
      'light shower snow': '가벼운 눈',
      'shower snow': '눈',
      'heavy shower snow': '강한 눈',
      
      // 안개
      'mist': '안개',
      'smoke': '연기',
      'haze': '연무',
      'sand/dust whirls': '모래먼지',
      'fog': '안개',
      'sand': '모래',
      'dust': '먼지',
      'volcanic ash': '화산재',
      'squalls': '돌풍',
      'tornado': '토네이도',
      
      // 기타
      'thunderstorm with light rain': '천둥번개와 가벼운 비',
      'thunderstorm with rain': '천둥번개와 비',
      'thunderstorm with heavy rain': '천둥번개와 강한 비',
      'light thunderstorm': '가벼운 천둥번개',
      'thunderstorm': '천둥번개',
      'heavy thunderstorm': '강한 천둥번개',
      'ragged thunderstorm': '천둥번개',
      'thunderstorm with light drizzle': '천둥번개와 가벼운 이슬비',
      'thunderstorm with drizzle': '천둥번개와 이슬비',
      'thunderstorm with heavy drizzle': '천둥번개와 강한 이슬비'
    };
    
    return weatherMapping[description] || description;
  };

  // 관심 도시 리스트 (jeju, jejucity 모두 포함)
  const favoriteCities = ['seoul', 'incheon', 'busan', 'daejeon', 'daegu', 'gwangju', 'junju', 'guri', 'sokcho','pohang','jeju','jejucity','tokyo'];

  const cityNameMapping = {
    'Seoul': '서울특별시',
    'Busan': '부산광역시',
    'Incheon': '인천광역시',
    'Daegu': '대구광역시',
    'Daejeon': '대전광역시',
    'Gwangju': '광주광역시',
    'Suwon': '수원시',
    'Ulsan': '울산광역시',
    'Seongnam': '성남시',
    'Bucheon': '부천시',
    'Ansan': '안산시',
    'Jeonju': '전주시',
    'Anyang': '안양시',
    'Pohang': '포항시',
    'Changwon': '창원시',
    'Jeju': '제주시',
    'Gangneung': '강릉시',
    'Chuncheon': '춘천시',
    'Wonju': '원주시',
    'Chungju': '충주시',
    'Cheongju': '청주시',
    'Jeju City': '제주시',
    'Gangneung-si': '강릉시',
    'Chuncheon-si': '춘천시',
    'Wonju-si': '원주시',
    'Chungju-si': '충주시',
    'Cheongju-si': '청주시',
    'Goyang': '고양시',
    'Yongin': '용인시',
    'Sejong': '세종특별자치시',
    'Gimhae': '김해시',
    'Gumi': '구미시',
    'Gunsan': '군산시',
    'Iksan': '익산시',
    'Mokpo': '목포시',
    'Suncheon': '순천시',
    'Jeonju-si': '전주시',
    'Gwangju-si': '광주광역시',
    'Daejeon-si': '대전광역시',
    'Daegu-si': '대구광역시',
    'Busan-si': '부산광역시',
    'Incheon-si': '인천광역시',
    'Seoul-si': '서울특별시',
    'Osong': '오송읍',
    'Osong-eup': '오송읍',
    'Gimpo': '김포시',
    'Paju': '파주시',
    'Guri': '구리시',
    'Osan': '오산시',
    'Siheung': '시흥시',
    'Uijeongbu': '의정부시',
    'Pyeongtaek': '평택시',
    'Junju': '전주시',
    'Sokcho': '속초시',
    'Tokyo': '도쿄도'
  };

  // 도시명에서 소문자+공백제거로 key 변환
  const cityKey = weather?.name?.toLowerCase().replace(/\s/g, "");
  const isFavorite = cityKey && favoriteCities.includes(cityKey);
  
  const contentStyle = isFavorite
    ? {
        borderRadius: '25px',
        padding: '30px',
        border: 'none',
      }
    : {};

  const handleCityChange = (city) => {
    if (city === "current") {
      setCity(null);
    } else {
      setCity(city);
    }
  };
 
  const translateCity = cityNameMapping[weather?.name] || weather.name;
  const weatherMain = weather.weather?.[0]?.main?.toLowerCase();

  let animationData = sunny;
  if (weatherMain === 'clouds') animationData = cloudy;
  else if (weatherMain === 'rain') animationData = rainy;
  else if (weatherMain === 'fog') animationData = foggy;

  const now = new Date();
  const currentTime = getFormattedTime(now);

  return (
    <div className="weather-box">
      <div style={contentStyle}>
        <div className="weather-current">현재<Button variant={`${city == null ? "outline-primary" : "primary"}`}
        onClick={() => handleCityChange("current")}
      >asd</Button></div>
        <div className="weather-name">
           {weather?.main?.temp !== undefined && (
          <div className="weather-temp">
            <h2>
              {Math.floor(weather.main.temp)}°
            </h2>
          </div>
       )}<Lottie className="lottie-icon"animationData={animationData}/>
        </div>
        <div className="weather-description">
          <h3>{translateWeatherDescription(weather?.weather?.[0]?.description)}</h3>
        </div>
        <hr />
          <div className="city-name">{translateCity}</div>
          <div className="weather-currenttime">{currentTime}</div>
      </div>
    </div>
  );
};

export default WeatherBox;