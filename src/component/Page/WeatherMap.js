// WeatherMap.js
import React, { useEffect, useRef, useState } from 'react';
import '../../App.css';
import Navbar from '../Navbar';
import SubjectTitle from '../SubjectTitle';
import Lottie from 'lottie-react';
import loadingAnim from '../../image/loading.json';

const WeatherMap = () => {
  const mapRef = useRef(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_MAP_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_MAP_CLIENT_SECRET;
  const OPENWEATHER_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

  // 도시명을 간단한 형식으로 변환하는 함수
  const simplifyCityName = (fullName) => {
  
    return fullName
      .replace(/특별시$/, '')
      .replace(/광역시$/, '')
      .replace(/특별자치시$/, '')
      .replace(/특별자치도$/, '')
      .replace(/시$/, '')
      .replace(/도$/, '')
      .trim();
  };

  // 날씨 설명을 자연스러운 한국어로 변환하는 함수
  const translateWeatherDescription = (description) => {
    const weatherMapping = {
      
      'clear sky': '맑음',
      '튼구름': '맑음',
      
      
      'few clouds': '구름 조금',
      'scattered clouds': '구름 많음',
      'broken clouds': '흐림',
      'overcast clouds': '흐림',
      '온흐림': '흐림',
      
      
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

  // 날씨 이모지 매핑 테이블 확장 및 함수 도입
  const weatherIconMap = {
    // 상세 설명
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '☁️',
    'broken clouds': '☁️',
    'overcast clouds': '☁️',
    'shower rain': '🌦️',
    'light rain': '🌧️',
    'moderate rain': '🌧️',
    'heavy intensity rain': '🌧️',
    'very heavy rain': '🌧️',
    'extreme rain': '🌧️',
    'freezing rain': '🌨️',
    'light intensity shower rain': '🌦️',
    'heavy intensity shower rain': '🌧️',
    'ragged shower rain': '🌧️',
    'light snow': '🌨️',
    'snow': '❄️',
    'heavy snow': '❄️',
    'sleet': '🌨️',
    'mist': '☁️',           // 박무(안개 낀 다리)
    'fog': '☁️',            // 안개
    'haze': '☁️',          // 연무
    'smoke': '☁️',          // 연기
    'dust': '☁️',          // 먼지
    'sand': '☁️',          // 모래
    'volcanic ash': '🌋',   // 화산재
    'squalls': '💨',
    'tornado': '🌪️',
    'thunderstorm': '⛈️',
    // 대분류 
    'clouds': '☁️',
    'rain': '🌧️',
    'snow': '❄️',
    'drizzle': '🌦️',
    'thunderstorm': '⛈️',
    'clear': '☀️',
    'atmosphere': '☁️'
  };

  function getWeatherIcon(weatherData) {
    if (!weatherData) return '🌡️';
    const desc = weatherData.weather?.[0]?.description?.toLowerCase();
    const main = weatherData.weather?.[0]?.main?.toLowerCase();
    return weatherIconMap[desc] || weatherIconMap[main] || '🌡️';
  }

  // 주요 도시 좌표와 정보
  const majorCities = [
    { name: 'Seoul', lat: 37.5665, lng: 126.9780, koreanName: '서울' },
    { name: 'Busan', lat: 35.1796, lng: 129.0756, koreanName: '부산' },
    { name: 'Incheon', lat: 37.4563, lng: 126.7052, koreanName: '인천' },
    { name: 'Daegu', lat: 35.8714, lng: 128.6014, koreanName: '대구' },
    { name: 'Daejeon', lat: 36.3504, lng: 127.3845, koreanName: '대전' },
    { name: 'Gwangju', lat: 35.1595, lng: 126.8526, koreanName: '광주' },
    { name: 'Jeonju', lat: 35.8242, lng: 127.1480, koreanName: '전주' },
    { name: 'Osong', lat: 36.6284, lng: 127.3307, koreanName: '오송' },
    { name: 'Chungju', lat: 36.9910, lng: 127.9260, koreanName: '충주' },
    { name: 'Wonju', lat: 37.3422, lng: 127.9202, koreanName: '원주' },
    { name: 'Sokcho', lat: 38.2070, lng: 128.5918, koreanName: '속초' },
    { name: 'Pohang', lat: 36.0190, lng: 129.3435, koreanName: '포항' },
    { name: 'Yeosu', lat: 34.7604, lng: 127.6622, koreanName: '여수' },
    { name: 'Tongyeong', lat: 34.8544, lng: 128.4336, koreanName: '통영' },
    { name: 'Chuncheon', lat: 37.8813, lng: 127.7298, koreanName: '춘천' },
    { name: 'Gangneung', lat: 37.7519, lng: 128.8761, koreanName: '강릉' },
    { name: 'Jeju', lat: 33.4996, lng: 126.5312, koreanName: '제주' },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, koreanName: '도쿄' }
  ];

  // 한국 주요 도시 영어명을 한국어로 매핑 (확장)
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
    'Chungju': '청주',
    'Cheongju': '청주',
    'Jeju City': '제주',
    'Gangneung-si': '강릉',
    'Chuncheon-si': '춘천',
    'Wonju-si': '원주',
    'Chungju-si': '청주',
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
    'Gangneung-si': '강릉',
    'Chuncheon-si': '춘천',
    'Wonju-si': '원주',
    'Chungju-si': '청주',
    'Cheongju-si': '청주',
    'Jeonju-si': '전주',
    'Gwangju-si': '광주',
    'Daejeon-si': '대전',
    'Daegu-si': '대구',
    'Busan-si': '부산',
    'Incheon-si': '인천',
    'Seoul-si': '서울'
  };

  useEffect(() => {
    document.body.classList.add('weather-map-active');
    document.documentElement.classList.add('weather-map-active');
    return () => {
      document.body.classList.remove('weather-map-active');
      document.documentElement.classList.remove('weather-map-active');
    };
  }, []);

  useEffect(() => {
    if (!NAVER_CLIENT_ID) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      initMap();
    };
    script.onerror = () => {
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [NAVER_CLIENT_ID]);

  // 주요 도시들의 날씨 정보를 가져와서 마커로 표시하는 함수
  const loadWeatherMarkers = async (map) => {
    const naver = window.naver;
    if (!naver || !map) {
      setInitialLoading(false);
      return;
    }
    const markers = [];
    for (const city of majorCities) {
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lng}&appid=${OPENWEATHER_KEY}&units=metric&lang=kr`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (weatherData && weatherData.weather && weatherData.weather[0]) {
          const weatherDesc = weatherData.weather[0].description;
          const temp = Math.round(weatherData.main.temp);
          const icon = getWeatherIcon(weatherData);
          
          const markerElement = document.createElement('div');
          markerElement.style.cssText = `
            background: rgba(0,0,0,0.45);
            color: white;
            padding: 4px 8px;
            border-radius: 10px;
            border: none;
            font-size: 15px;
            font-family: 'Ownglyph_corncorn-Rg', sans-serif;
            font-weight: normal;
            text-align: center;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            cursor: pointer;
            min-width: 40px;
            margin: 0;
            line-height: 1.2;
          `;
          
          markerElement.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 0;">${icon}</div>
            <div style="font-size: 12px; margin-bottom: 0;">${city.koreanName}</div>
            <div style="font-size: 13px;">${temp}°C</div>
          `;

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(city.lat, city.lng),
            icon: {
              content: markerElement,
              anchor: new naver.maps.Point(30, 30)
            }
          });

          naver.maps.Event.addListener(marker, 'click', () => {
            setWeatherInfo({
              city: city.koreanName,
              temp: temp,
              desc: translateWeatherDescription(weatherDesc),
            });
          });

          markers.push(marker);
        }
      } catch (error) {
      }
    }

    markers.forEach(marker => marker.setMap(map));
    setInitialLoading(false);
  };

  const initMap = () => {
    const naver = window.naver;
    if (!naver || !mapRef.current) {
      return;
    }

    const koreaBounds = new naver.maps.LatLngBounds(
      new naver.maps.LatLng(33.0, 124.0), // 남서쪽
      new naver.maps.LatLng(39.5, 132.0)  // 북동쪽
    );

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(35.5, 127.5),
      zoom: 7,
      minZoom: 7,
      maxZoom: 13,
      maxBounds: koreaBounds,
      draggable: false
    });

    loadWeatherMarkers(map);

    let clickMarker = null;

    naver.maps.Event.addListener(map, 'click', async function (e) {
      const lat = e.coord.lat();
      const lng = e.coord.lng();

      setLoading(true);

      if (clickMarker) {
        clickMarker.setMap(null);
      }

      clickMarker = new naver.maps.Marker({
        map: map,
        position: new naver.maps.LatLng(lat, lng),
      });

      try {
        // 지도 클릭 시 지역명: openweathermap reverse geocoding API로 한글명 우선, 없으면 영어명, 둘 다 없으면 '알 수 없음'
        let koreanAddress = '위치 검색 불가';
        try {
          const geocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${OPENWEATHER_KEY}`;
          const geocodingRes = await fetch(geocodingUrl);
          const geocodingData = await geocodingRes.json();
          if (geocodingData && geocodingData.length > 0) {
            const location = geocodingData[0];
            if (location.local_names && location.local_names.ko) {
              koreanAddress = location.local_names.ko.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구|읍|면|동|리|가)$/g, '').trim(); //접미사 제거
            } else if (location.name) {
              koreanAddress = location.name;
            }
          }
        } catch (geocodingError) {
        }

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_KEY}&units=metric&lang=kr`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        setWeatherInfo({
          city: koreanAddress,
          temp: weatherData.main?.temp ?? 'N/A',
          desc: translateWeatherDescription(weatherData.weather?.[0]?.description) ?? '정보 없음',
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    });
  };

  return (
    <>
      <Navbar />
      <SubjectTitle />
      <div className="weather-container" style={{ position: 'relative', paddingBottom: '70px' }}>
        {initialLoading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            background: 'rgba(0,0,0,0.3)'
          }}>
            <Lottie animationData={loadingAnim} style={{ width: 140, height: 140 }} />
          </div>
        )}
        <div
          id="weather-map"
          ref={mapRef}
          style={{ width: '60vw', height: '70vh', border: '1px solid #ccc' }}
        />
        <div className="weather-info-box-border">
          <div className="weather-info-box">
            {!weatherInfo ? (
              <p className="guide">지도를 클릭하면 해당 지역의 날씨를 확인할 수 있습니다.</p>
            ) : (
              <>
                <div className="weather-info0">현재 <span>선택</span>된 지역의 날씨를 보여줍니다.</div>
                <h3 className="weather-info1">{weatherInfo.city}</h3>
                <p className="weather-info2">{weatherInfo.desc}</p>
                <p className="weather-info3">{weatherInfo.temp}°C</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherMap;