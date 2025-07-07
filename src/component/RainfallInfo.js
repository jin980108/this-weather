import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import SubjectTitle from './SubjectTitle';
import { ClipLoader } from 'react-spinners';
import HourlyRainfallBar from './HourlyRainfallBar';

const OPENWEATHER_API_KEY = '4d5dbe065d3aa1070e9e85970eb06298';

const RainfallInfo = () => {
  const [hourlyRainfall, setHourlyRainfall] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    const fetchRainfall = async (lat, lon) => {
      setLoading(true);
      try {
        // 1. 강수 예보 데이터
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.list) {
          const rainfallData = data.list.slice(0, 12).map(item => {
            const date = new Date(item.dt * 1000);
            const hour = date.getHours() + '시';
            const amount = item.rain && item.rain['3h'] ? item.rain['3h'] : 0;
            return { hour, amount };
          });
          setHourlyRainfall(rainfallData);
        } else {
          setHourlyRainfall([]);
        }

        // 2. 프록시 서버를 통한 네이버 Reverse Geocoding 요청 (임시 비활성화)
        try {
          const naverRes = await fetch(
            `http://localhost:5002/api/naver-reverse-geocode?lat=${lat}&lon=${lon}`
          );
          const naverData = await naverRes.json();
          let locName = '';
          if (
            naverData.results &&
            naverData.results[0] &&
            naverData.results[0].region
          ) {
            const region = naverData.results[0].region;
            locName = `${region.area1.name} ${region.area2.name}`;
          }
          setLocationName(locName);
        } catch (error) {
          console.log('네이버 Reverse Geocoding 에러:', error);
          setLocationName('서울시');
        }
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          fetchRainfall(lat, lon);
        },
        (err) => {
          fetchRainfall(37.5665, 126.9780);
        },
        { timeout: 5000 }
      );
    } else {
      fetchRainfall(37.5665, 126.9780);
    }
  }, []);

  return (
    <>
      <Navbar />
      <SubjectTitle />
      <div className="rain-bg-box">
        <h2 style={{ fontFamily: 'Ownglyph_corncorn-Rg', fontSize: 22, marginBottom: 24, color: 'white', textAlign: 'center' }}>
          {locationName ? `${locationName} 시간별 강수 예보` : '시간별 강수 예보'}
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <ClipLoader color="#0077cc" loading={loading} size={50} />
          </div>
        ) : (
          <HourlyRainfallBar data={hourlyRainfall} />
        )}
      </div>
    </>
  );
};

export default RainfallInfo; 