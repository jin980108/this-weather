import React from 'react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

const ForecastList = ({ forecast, weather }) => {
  if (!weather || !forecast) return null;
  
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
    tokyo: "도쿄" 
  };

  const emojiMap = {
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '☁️',
    'broken clouds': '☁️',
    'overcast clouds': '☁️',
    'shower rain': '🌦️',
    'light rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️',
  };
  
  let translateCity = cityMap[weather.name?.toLowerCase()] || weather.name;

  return (
    <>
      <div className="forecast-title">📆 {translateCity} 일기예보</div>
      <div className="forecast-list">
        {forecast.slice(0, 14).map((item, index) => {
          const emoji = emojiMap[item.weather?.[0]?.description] || '🌡️';
          return (
            <div key={index} className="forecast-item">
              <div className="forecast-emoji" style={{ fontSize: "24px" }}>{emoji}</div>
              <div>{new Date(item.dt * 1000).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true })}</div>
              <div>{Math.round(item.main.temp)}°C</div>
              <div>{translateWeatherDescription(item.weather[0].description)}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ForecastList;