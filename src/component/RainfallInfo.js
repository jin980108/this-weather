import axios from "axios";
import Lottie from 'lottie-react';
import { useCallback, useEffect, useState } from 'react';
import loadingAnim from '../image/loading.json';
import useGlobalStore from '../store/useGlobalStore';
import HourlyRainfallBar from './HourlyRainfallBar';

const OPENWEATHER_API_KEY = 'aa6cfec2cc4259f35fba680eed295eda';

const RainfallInfo = () => {
  const hourlyRainfall = useGlobalStore((state) => state.hourlyRainfall);
  const setHourlyRainfall = useGlobalStore((state) => state.setHourlyRainfall);
  const city = useGlobalStore((state) => state.city);
  
  // 로컬 상태로 변경
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [error, setError] = useState(null);
  const isInvalidCity = !city;

  // 주요 도시 좌표 정보
  const cityCoordinates = {
    '서울': { lat: 37.5665, lng: 126.9780, name: '서울특별시' },
    '부산': { lat: 35.1796, lng: 129.0756, name: '부산광역시' },
    '인천': { lat: 37.4563, lng: 126.7052, name: '인천광역시' },
    '대구': { lat: 35.8714, lng: 128.6014, name: '대구광역시' },
    '대전': { lat: 36.3504, lng: 127.3845, name: '대전광역시' },
    '광주': { lat: 35.1595, lng: 126.8526, name: '광주광역시' },
    '전주': { lat: 35.8242, lng: 127.1480, name: '전주시' },
    '구리': { lat: 37.5944, lng: 127.1296, name: '구리시' },
    '속초': { lat: 38.2070, lng: 128.5918, name: '속초시' },
    '포항': { lat: 36.0190, lng: 129.3435, name: '포항시' },
    '제주': { lat: 33.4996, lng: 126.5312, name: '제주시' },
    '전주': { lat: 35.8242, lng: 127.1480, name: '전주시' }
  };
  
  const fetchRainfall = useCallback(async (lat, lon) => {
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
  }, [setHourlyRainfall, setLocationName, setLoading]);

  useEffect(() => {
    // 잘못된 도시인 경우 에러 처리
    if (city && city !== "current" && !cityCoordinates[city]) {
      setLocationName('');
      setError('해당 도시의 강수량 정보를 찾을 수 없습니다.');
      setHourlyRainfall([]);
      setLoading(false);
      return;
    }

    // 선택된 도시가 있는 경우 해당 도시의 강수량 정보 가져오기
    if (city && city !== "current" && cityCoordinates[city]) {
      const cityInfo = cityCoordinates[city];
      setLocationName(cityInfo.name);
      setError(null);
      fetchRainfall(cityInfo.lat, cityInfo.lng);
    } else {
      // 현재 위치 가져오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: lat, longitude: lon } = position.coords;
            setError(null);
            fetchRainfall(lat, lon);
          },
          (error) => {
            console.error('위치 정보를 가져올 수 없습니다:', error);
            // 기본값으로 서울 좌표 사용
            const lat = 37.5665;
            const lon = 126.9780;
            setLocationName('서울특별시');
            setError(null);
            fetchRainfall(lat, lon);
          }
        );
      } else {
        // Geolocation API를 지원하지 않는 경우
        console.log('Geolocation API를 지원하지 않습니다.');
        const lat = 37.5665;
        const lon = 126.9780;
        setLocationName('서울특별시');
        setError(null);
        fetchRainfall(lat, lon);
      }
    }
  }, [fetchRainfall, city]);

  return (
    <>    
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
      
      {!loading && (
        <div className="rain-bg-box">
          <h2 style={{ fontFamily: 'Ownglyph_corncorn-Rg', fontSize: 22, marginBottom: 24, color: 'white', textAlign: 'center' }}>
            {locationName ? `${locationName} 시간별 강수 예보` : ''}
          </h2>
          {error && (
            <div style={{
              color: 'white',
              textAlign: 'center',
              marginBottom: '20px',
              fontFamily: 'Ownglyph_corncorn-Rg',
              fontSize: '2rem',
              padding:'20px'
            }}>
              {error}
            </div>
          )}
          {!error && <HourlyRainfallBar data={hourlyRainfall} />}
        </div>
      )}
    </>
  );
};

export default RainfallInfo; 