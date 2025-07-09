import React, { useEffect } from 'react';
import Navbar from './Navbar';
import SubjectTitle from './SubjectTitle';
import Lottie from 'lottie-react';
import loadingAnim from '../image/loading.json';
import HourlyRainfallBar from './HourlyRainfallBar';
import axios from "axios";
import useGlobalStore from '../store/useGlobalStore';

const OPENWEATHER_API_KEY = '4d5dbe065d3aa1070e9e85970eb06298';

const RainfallInfo = () => {
  const hourlyRainfall = useGlobalStore((state) => state.hourlyRainfall);
  const setHourlyRainfall = useGlobalStore((state) => state.setHourlyRainfall);
  const loading = useGlobalStore((state) => state.isLoading);
  const setLoading = useGlobalStore((state) => state.setIsLoading);
  const locationName = useGlobalStore((state) => state.locationName);
  const setLocationName = useGlobalStore((state) => state.setLocationName);

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
          // 카카오 Reverse Geocoding 에러 무시
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
  }, [setHourlyRainfall, setLoading, setLocationName]);

  return (
    <>
      <Navbar />
      <SubjectTitle />
      {loading && (
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
      <div className="rain-bg-box">
        <h2 style={{ fontFamily: 'Ownglyph_corncorn-Rg', fontSize: 22, marginBottom: 24, color: 'white', textAlign: 'center' }}>
          {locationName ? `${locationName} 시간별 강수 예보` : '시간별 강수 예보'}
        </h2>
        {!loading && <HourlyRainfallBar data={hourlyRainfall} />}
      </div>
    </>
  );
};

export default RainfallInfo; 