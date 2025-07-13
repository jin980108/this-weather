import 'bootstrap/dist/css/bootstrap.min.css';
import Lottie from 'lottie-react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import ForecastList from './component/Forecast';
import WeatherMap from './component/Page/WeatherMap';
import RainfallInfo from './component/RainfallInfo';
import ScrollToTop from './component/ScrollToTop';
import SubjectTitle from './component/SubjectTitle';
import TodayDetail from './component/TodayDetail';
import WeatherBox from './component/WeatherBox';
import WeatherNews from './component/WeatherNews';
import loadingAnim from './image/loading.json';
import useGlobalStore from './store/useGlobalStore';

// 한글 도시명을 영문으로 변환하는 매핑 테이블
const cityNameToEnglish = {
  '서울': 'Seoul',
  '부산': 'Busan',
  '인천': 'Incheon',
  '대구': 'Daegu',
  '대전': 'Daejeon',
  '광주': 'Gwangju',
  '전주': 'Jeonju',
  '구리': 'Guri',
  '속초': 'Sokcho',
  '포항': 'Pohang',
  '제주': 'Jeju'
  // 필요시 추가
};

function MainPage() {
  const {
    city,
    setCity,
    setWeatherData,
    isLoading,
    setIsLoading,
    setForecast,
    setSelectedCity,
    setHourlyRainfall,
    setCurrentCity
  } = useGlobalStore();
  const cities = ['Seoul','Daejeon','Daegu','Busan','Gwangju','Guri','Incheon','Junju','Sokcho','Pohang','Jeju'];
  const location = useLocation();

  const resetApp = () => {
    setCity(null);
    setSelectedCity(null);
    getCurrentLocation(); // 현재 위치 기반으로 날씨 정보 다시 가져오기
  }

  // 위치 권한 허용 여부 state 추가
  const [setLocationAllowed] = React.useState(false);

  // 1. 더미 데이터로 초기 세팅 (weatherbox만)
  // 위치 권한 허용 시 실제 데이터로 교체, 거부/미응답 시 더미 유지 (WeatherBox만)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeatherByCurrentLoaction(lat, lon);
      },
      (error) => {
        // 위치 거부/실패 시 기본값 설정
      }
    );
  }, [setWeatherData]);

  // 2. 위치 권한 허용 시 실제 데이터로 교체 (weatherbox만)
  const handleAllowLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      getWeatherByCurrentLoaction(lat, lon);
      setLocationAllowed(true);
    });
  };

  // 실제 강수량 데이터 fetch
  useEffect(() => {
    fetch('/api/rainfall')
      .then(res => res.json())
      .then(data => setHourlyRainfall(data));
  }, [setHourlyRainfall]);
  
  // 기존 API 호출 useEffect 복구
  useEffect(() => {
    if(location.pathname === "/") { 
      if (!city || city === "current") {
        getCurrentLocation();
      } else {
        getWeatherByCity();
        getForecastByCity();
      }
    }
    // eslint-disable-next-line
  }, [city, location.pathname]);

  // MOCK 데이터로 세팅
  // useEffect(() => {
  //   setWeatherData(seoulWeatherMock);
  //   setForecast(seoulForecastMock);
  // }, [setWeatherData, setForecast]);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      getWeatherByCurrentLoaction(lat, lon);
      getForecastByCurrentLocation(lat, lon);
    });
  };

  const getWeatherByCurrentLoaction = async(lat,lon) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`;
    setIsLoading(true);
    let response = await fetch(url);
    let data = await response.json();
    setWeatherData(data);
    setIsLoading(false);
  };

  // 한글 도시명을 영문으로 변환해서 API 호출
  const getWeatherByCity = async() => {
    let cityEn = cityNameToEnglish[city] || city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityEn}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`;
    setIsLoading(true);
    let response = await fetch(url);
    let data = await response.json();
    setWeatherData(data);
    setIsLoading(false);
  };

  const getForecastByCity = async () => {
    let cityEn = cityNameToEnglish[city] || city;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityEn}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    setForecast(data.list);  
  };

  const getForecastByCurrentLocation = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    setForecast(data.list);
  };

  // zustand로 refactoring
  const handleCityChange = (city) => {
    if (city === "current") {
      setCity(null);
      setSelectedCity(null);
    } else {
      setCity(city);
      setSelectedCity(city);
    }
  };

  return (
    <div>
      <ScrollToTop />
      <SubjectTitle onSearch={setCity} onReset={resetApp} />
      {isLoading ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '60vw',
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
      ) : (
        <>
          <div className="main-content-container">
            <WeatherBox />
            <TodayDetail />
          </div>
          <div className="forecast-and-map">
            <ForecastList />
            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start', marginTop: '30px' }}>
              <div className="weather-map-center">
                <WeatherMap />
              </div>
              <div className="weather-news-center">
                <WeatherNews />
              </div>
            </div>
            <RainfallInfo />
            {/* <WeatherButton cities={cities} /> */}
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <MainPage />
    </div>
  );
}

export default App;
