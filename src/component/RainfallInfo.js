import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import SubjectTitle from './SubjectTitle';
import { ClipLoader } from 'react-spinners';
import HourlyRainfallBar from './HourlyRainfallBar';
import axios from "axios";

const OPENWEATHER_API_KEY = '4d5dbe065d3aa1070e9e85970eb06298';

const RainfallInfo = () => {
  const [hourlyRainfall, setHourlyRainfall] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    const fetchRainfall = async (lat, lon) => {
      setLoading(true);
      try {
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

        let locName = '알 수 없음';
        try {
          const kakaoApiKey = '6550b64c130e2cadfb3589a87910f551';
          const kakaoUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`;
          const kakaoRes = await axios.get(kakaoUrl, {
            headers: {
              Authorization: `KakaoAK ${kakaoApiKey}`
            }
          });
          if (
            kakaoRes.data.documents &&
            kakaoRes.data.documents[0] &&
            kakaoRes.data.documents[0].address
          ) {
            const addr = kakaoRes.data.documents[0].address;
            locName = `${addr.region_2depth_name} ${addr.region_3depth_name}`;
          }
        } catch (error) {
          console.log('카카오 Reverse Geocoding 에러:', error);
        }
        setLocationName(locName);
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