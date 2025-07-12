import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import SubjectTitle from './SubjectTitle';
import Lottie from 'lottie-react';
import loadingAnim from '../image/loading.json';
import HourlyRainfallBar from './HourlyRainfallBar';
import axios from "axios";
import useGlobalStore from '../store/useGlobalStore';

const OPENWEATHER_API_KEY = 'aa6cfec2cc4259f35fba680eed295eda';

const RainfallInfo = () => {
  const hourlyRainfall = useGlobalStore((state) => state.hourlyRainfall);
  const setHourlyRainfall = useGlobalStore((state) => state.setHourlyRainfall);
  
  // 로컬 상태로 변경
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [error, setError] = useState(null);
  
  const fetchRainfall = async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      // 429 에러 방지를 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
      const res = await fetch(url);
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('API 호출 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.');
        }
        throw new Error(`Weather API error: ${res.status}`);
      }
      
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

      // 위치명 가져오기
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
      } catch (kakaoError) {
        console.log('카카오 API 에러:', kakaoError);
        // 카카오 API 에러는 무시하고 기본값 사용
      }
      
      setLocationName(locName);
      
    } catch (error) {
      console.error('강수량 데이터 가져오기 실패:', error);
      setError(error.message || '강수량 정보를 가져오는데 실패했습니다.');
      setHourlyRainfall([]);
      setLocationName('알 수 없음');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // (fetch/axios로 강수량, 위치명 등 원래 로직 복구)
    // 예시: 현재 위치 기반 데이터 가져오기
    // 실제 앱에서는 사용자 위치를 가져와서 사용해야 합니다.
    // 여기서는 예시로 서울 중구 좌표를 사용합니다.
    const lat = 37.5665; // 서울 중구 중심 좌표
    const lon = 126.9780; // 서울 중구 중심 좌표
    
    fetchRainfall(lat, lon);
    setLocationName('서울특별시 중구'); // 초기 위치 설정
    setLoading(false);
  }, [setHourlyRainfall, setLocationName, setLoading]);

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
        
        {error && (
          <div style={{
            color: '#ff6b6b',
            textAlign: 'center',
            marginBottom: '20px',
            fontFamily: 'Ownglyph_corncorn-Rg',
            fontSize: '16px'
          }}>
            {error}
          </div>
        )}
        
        {!loading && !error && <HourlyRainfallBar data={hourlyRainfall} />}
      </div>
    </>
  );
};

export default RainfallInfo; 