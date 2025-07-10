import 'bootstrap/dist/css/bootstrap.min.css';
import Lottie from 'lottie-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import ForecastList from './component/Forecast';
import Navbar from './component/Navbar';
import ScrollToTop from './component/ScrollToTop';
import SubjectTitle from './component/SubjectTitle';
import TodayDetail from './component/TodayDetail';
import WeatherBox from './component/WeatherBox';
import WeatherButton from './component/WeatherButton';
import loadingAnim from './image/loading.json';
import useGlobalStore from './store/useGlobalStore';
import WeatherMap from './component/Page/WeatherMap';
import WeatherNews from './component/WeatherNews';
import Rainfallinfo from './component/RainfallInfo';

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

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      getWeatherByCurrentLoaction(lat, lon);
      getForecastByCurrentLocation(lat, lon);
    });
  };

  const getWeatherByCurrentLoaction = async(lat,lon) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4d5dbe065d3aa1070e9e85970eb06298&units=metric`;
    setIsLoading(true);
    let response = await fetch(url);
    let data = await response.json();
    setWeatherData(data);
    setIsLoading(false);
  };

  // 한글 도시명을 영문으로 변환해서 API 호출
  const getWeatherByCity = async() => {
    let cityEn = cityNameToEnglish[city] || city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityEn}&appid=4d5dbe065d3aa1070e9e85970eb06298&units=metric`;
    setIsLoading(true);
    let response = await fetch(url);
    let data = await response.json();
    setWeatherData(data);
    setIsLoading(false);
  };

  const getForecastByCity = async () => {
    let cityEn = cityNameToEnglish[city] || city;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityEn}&appid=4d5dbe065d3aa1070e9e85970eb06298&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    setForecast(data.list);  
  };

  const getForecastByCurrentLocation = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=4d5dbe065d3aa1070e9e85970eb06298&units=metric`;
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
      ) : (
        <>
          <div className="main-content-container">
            <WeatherBox />
            <TodayDetail />
          </div>
          <div className="forecast-and-map">
            <ForecastList />
            <div className="weather-map-center">
              <WeatherMap />
            </div>
            {/* {<WeatherNews />} */}
            {/* <Rainfallinfo /> */}
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
