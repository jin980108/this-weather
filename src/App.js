import 'bootstrap/dist/css/bootstrap.min.css';
import Lottie from 'lottie-react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import ForecastList from './component/Forecast';
import Navbar from './component/Navbar';
import WeatherMap from './component/Page/WeatherMap';
import ScrollToTop from './component/ScrollToTop';
import SubjectTitle from './component/SubjectTitle';
import TodayDetail from './component/TodayDetail';
import WeatherBox from './component/WeatherBox';
import WeatherButton from './component/WeatherButton';
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
    weatherData,
    setWeatherData,
    isLoading,
    setIsLoading,
    forecast,
    setForecast
  } = useGlobalStore();
  const cities = ['Seoul','Daejeon','Daegu','Busan','Gwangju','Guri','Incheon','Junju','Sokcho','Pohang','Jeju'];
  const location = useLocation();

  // --- MOCK DATA START ---
  const seoulWeatherMock = {
    name: "Seoul",
    main: {
      temp: 23.5,
      feels_like: 24.0,
      temp_min: 21.0,
      temp_max: 26.0,
      humidity: 60,
    },
    weather: [
      {
        main: "Clear",
        description: "clear sky",
        icon: "01d"
      }
    ],
    wind: {
      speed: 2.5
    }
  };

  const seoulForecastMock = [
    { dt: 1720708800, main: { temp: 24 }, weather: [{ main: "Clouds", description: "few clouds", icon: "02d" }] },
    { dt: 1720719600, main: { temp: 25 }, weather: [{ main: "Clear", description: "clear sky", icon: "01d" }] },
    { dt: 1720730400, main: { temp: 26 }, weather: [{ main: "Clouds", description: "scattered clouds", icon: "03d" }] },
    { dt: 1720741200, main: { temp: 27 }, weather: [{ main: "Rain", description: "light rain", icon: "10d" }] },
    { dt: 1720752000, main: { temp: 26 }, weather: [{ main: "Clouds", description: "broken clouds", icon: "04d" }] },
    { dt: 1720762800, main: { temp: 25 }, weather: [{ main: "Clear", description: "clear sky", icon: "01d" }] },
    { dt: 1720773600, main: { temp: 24 }, weather: [{ main: "Clouds", description: "few clouds", icon: "02d" }] },
    { dt: 1720784400, main: { temp: 23 }, weather: [{ main: "Rain", description: "moderate rain", icon: "10d" }] },
    { dt: 1720795200, main: { temp: 22 }, weather: [{ main: "Clouds", description: "overcast clouds", icon: "04d" }] },
    { dt: 1720806000, main: { temp: 21 }, weather: [{ main: "Clear", description: "clear sky", icon: "01d" }] },
    { dt: 1720816800, main: { temp: 22 }, weather: [{ main: "Clouds", description: "few clouds", icon: "02d" }] },
    { dt: 1720827600, main: { temp: 23 }, weather: [{ main: "Rain", description: "light rain", icon: "10d" }] },
    { dt: 1720838400, main: { temp: 24 }, weather: [{ main: "Clouds", description: "scattered clouds", icon: "03d" }] },
    { dt: 1720849200, main: { temp: 25 }, weather: [{ main: "Clear", description: "clear sky", icon: "01d" }] },
    { dt: 1720860000, main: { temp: 26 }, weather: [{ main: "Clouds", description: "broken clouds", icon: "04d" }] },
    { dt: 1720870800, main: { temp: 27 }, weather: [{ main: "Rain", description: "moderate rain", icon: "10d" }] },
    { dt: 1720881600, main: { temp: 28 }, weather: [{ main: "Clouds", description: "overcast clouds", icon: "04d" }] },
    { dt: 1720892400, main: { temp: 27 }, weather: [{ main: "Clear", description: "clear sky", icon: "01d" }] },
    { dt: 1720903200, main: { temp: 26 }, weather: [{ main: "Clouds", description: "few clouds", icon: "02d" }] },
    { dt: 1720914000, main: { temp: 25 }, weather: [{ main: "Rain", description: "light rain", icon: "10d" }] }
  ];
  // --- MOCK DATA END ---

  // 위치 권한 허용 여부 state 추가
  const [locationAllowed, setLocationAllowed] = React.useState(false);

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
        // 위치 거부/실패 시 더미 데이터 유지
        setWeatherData(seoulWeatherMock);
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
    } else {
      setCity(city);
    }
  };
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <SubjectTitle onSearch={setCity} />
      {isLoading ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
<<<<<<< HEAD
          width: '100vw',
=======
          width: '60vw',
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
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
<<<<<<< HEAD
            <div className="weather-map-center">
              <WeatherMap />
            </div>
            {/* {<WeatherNews />} */}
            {/* <Rainfallinfo /> */}
=======
            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start', marginTop: '30px' }}>
              <div className="weather-map-center">
                <WeatherMap />
              </div>
              <div className="weather-news-center">
                <WeatherNews />
              </div>
            </div>
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
            <WeatherButton cities={cities} />
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
