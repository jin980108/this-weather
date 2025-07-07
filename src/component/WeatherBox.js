import React from 'react';
import Lottie from 'lottie-react';
import sunny from '../image/sunny.json';
import cloudy from '../image/cloudy.json';
import rainy from '../image/rainy.json';
import foggy from '../image/foggy.json';

const WeatherBox = ({ weather }) => {
  console.log(weather);

  if (!weather?.name) return null;

  // 날씨 설명을 자연스러운 한국어로 변환하는 함수
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

  // 관심 도시 리스트
  const favoriteCities = ['seoul', 'incheon', 'busan', 'daejeon', 'daegu', 'gwangju', 'junju', 'guri', 'sokcho','pohang', 'tokyo'];

  // 도시별 배경 이미지 URL 매핑
  const cityBackgrounds = {
    seoul: "https://images.unsplash.com/photo-1722074764794-3bd97ff3047c?w=1600&h=900&fit=crop", 
    incheon: "https://images.unsplash.com/photo-1653818283100-115421ad43e8?w=1600&h=900&fit=crop", 
    busan: "https://images.unsplash.com/photo-1638591751482-1a7d27fcea15?w=1600&h=900&fit=crop", 
    daejeon: "https://images.unsplash.com/photo-1663038509302-a20dc8a24ad8?w=1600&h=900&fit=crop",
    daegu: "https://images.unsplash.com/photo-1663670889635-0aabebf112ba?w=1600&h=900&fit=crop", 
    gwangju: "https://images.unsplash.com/photo-1593419522851-05085541ad25?w=1600&h=900&fit=crop",
    junju: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1600&h=900&fit=crop", 
    guri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&h=900&fit=crop",
    sokcho: "https://images.unsplash.com/photo-1660785462445-f9d21cad7ada?w=1600&h=900&fit=crop",
    pohang: "https://images.unsplash.com/photo-1552230479-b7e43d576a7a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tokyo: "https://images.unsplash.com/photo-1557409518-691ebcd96038?w=1600&h=900&fit=crop" 
  };

  const cityKey = weather?.name?.toLowerCase();
  const isFavorite = cityKey && favoriteCities.includes(cityKey) && cityBackgrounds[cityKey];
  const boxStyle = isFavorite
    ? {
        backgroundImage: `url(${cityBackgrounds[cityKey]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '30px',
        border: '2px solid white',
        padding: '30px',
        position: 'relative',
      }
    : {};

  const contentStyle = isFavorite
    ? {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '25px',
        padding: '30px',
        border: 'none',
      }
    : {};

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
    tokyo: "도쿄" 
  };

  const translateCity = cityMap[weather.name?.toLowerCase()] || weather.name;
  const weatherMain = weather.weather?.[0]?.main?.toLowerCase();

  let animationData = sunny;
  if (weatherMain === 'clouds') animationData = cloudy;
  else if (weatherMain === 'rain') animationData = rainy;
  else if (weatherMain === 'fog') animationData = foggy;

  return (
    <div className="weather-box" style={boxStyle}>
      <div style={contentStyle}>
        <div className="weather-name">
          실시간 {translateCity}의 날씨 정보 <Lottie className="lottie-icon"animationData={animationData}/>
        </div>

        {weather?.main?.temp !== undefined && (
          <div className="weather-temp">
            <h2>
              {Math.round(weather.main.temp)}°C / {(weather.main.temp * 1.8 + 32).toFixed(1)}°F
            </h2>
          </div>
        )}

        <div className="weather-description">
          <h3>{translateWeatherDescription(weather?.weather?.[0]?.description)}</h3>
        </div>

        {/* 상세 정보 */}
        <div style={{ fontFamily: 'Ownglyph_corncorn-Rg', color: 'white', fontSize: 18 }}>
          {weather?.main?.humidity !== undefined && (
            <div>습도: {weather.main.humidity}%</div>
          )}
          {weather?.wind?.speed !== undefined && (
            <div>풍속: {weather.wind.speed} m/s</div>
          )}
          {weather?.main?.feels_like !== undefined && (
            <div>체감온도: {Math.round(weather.main.feels_like)}°C</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherBox;