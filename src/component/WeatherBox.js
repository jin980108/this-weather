import React from 'react';
import Lottie from 'lottie-react';
import sunny from '../image/sunny.json';
import cloudy from '../image/cloudy.json';
import rainy from '../image/rainy.json';
import foggy from '../image/foggy.json';

const WeatherBox = ({ weather }) => {
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

  // 도시별 배경 이미지 URL 매핑 (jeju, jejucity 모두 포함)
  const cityBackgrounds = {
    seoul: "https://images.unsplash.com/photo-1722074764794-3bd97ff3047c?w=1920&auto=format&fit=crop", 
    incheon: "https://images.unsplash.com/photo-1653818283100-115421ad43e8?w=1920&auto=format&fit=crop", 
    busan: "https://images.unsplash.com/photo-1638591751482-1a7d27fcea15?w=1920&auto=format&fit=crop", 
    daejeon: "https://images.unsplash.com/photo-1663038509302-a20dc8a24ad8?w=1920&auto=format&fit=crop",
    daegu: "https://images.unsplash.com/photo-1663670889635-0aabebf112ba?w=1920&auto=format&fit=crop", 
    gwangju: "https://images.unsplash.com/photo-1593419522851-05085541ad25?w=1920&auto=format&fit=crop",
    junju: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1920&auto=format&fit=crop", 
    guri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop",
    sokcho: "https://images.unsplash.com/photo-1660785462445-f9d21cad7ada?w=1920&auto=format&fit=crop",
    pohang: "https://images.unsplash.com/photo-1552230479-b7e43d576a7a?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    jejucity: "https://images.unsplash.com/photo-1659083899424-8a4c6bd0f48b?w=1920&auto=format&fit=crop",
    jeju: "https://images.unsplash.com/photo-1659083899424-8a4c6bd0f48b?w=1920&auto=format&fit=crop",
    tokyo: "https://images.unsplash.com/photo-1557409518-691ebcd96038?w=1920&auto=format&fit=crop" 
  };

  const cityNameMapping = {
    'Seoul': '서울',
    'Busan': '부산',
    'Incheon': '인천',
    'Daegu': '대구',
    'Daejeon': '대전',
    'Gwangju': '광주',
    'Suwon': '수원',
    'Ulsan': '울산',
    'Seongnam': '성남',
    'Bucheon': '부천',
    'Ansan': '안산',
    'Jeonju': '전주',
    'Anyang': '안양',
    'Pohang': '포항',
    'Changwon': '창원',
    'Jeju': '제주',
    'Gangneung': '강릉',
    'Chuncheon': '춘천',
    'Wonju': '원주',
    'Chungju': '충주',
    'Cheongju': '청주',
    'Jeju City': '제주',
    'Gangneung-si': '강릉',
    'Chuncheon-si': '춘천',
    'Wonju-si': '원주',
    'Chungju-si': '충주',
    'Cheongju-si': '청주',
    'Goyang': '고양',
    'Yongin': '용인',
    'Sejong': '세종',
    'Gimhae': '김해',
    'Gumi': '구미',
    'Gunsan': '군산',
    'Iksan': '익산',
    'Mokpo': '목포',
    'Suncheon': '순천',
    'Jeonju-si': '전주',
    'Gwangju-si': '광주',
    'Daejeon-si': '대전',
    'Daegu-si': '대구',
    'Busan-si': '부산',
    'Incheon-si': '인천',
    'Seoul-si': '서울',
    'Osong': '오송',
    'Osong-eup': '오송',
    'Gimpo': '김포',
    'Paju': '파주',
    'Guri': '구리',
    'Osan': '오산',
    'Siheung': '시흥',
    'Uijeongbu': '의정부',
    'Pyeongtaek': '평택',
    'Junju': '전주',
    'Sokcho': '속초',
    'Tokyo': '도쿄'
  };

  // 도시명에서 소문자+공백제거로 key 변환
  const cityKey = weather?.name?.toLowerCase().replace(/\s/g, "");
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

  const translateCity = cityNameMapping[weather?.name] || weather.name;
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