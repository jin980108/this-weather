import { useEffect, useState } from 'react';
import badImage from '../image/bad.png';
import goodImage from '../image/good.png';
import sosoImage from '../image/soso.png';
import terribleImage from '../image/terrible.png';
import useGlobalStore from '../store/useGlobalStore';

const API_KEY = 'Yv1hbHrT7eIYKt%2BOiHheUeRT9OTpDh1yYBa3Lrc7sSPbR4sQsodegvvTxjEhXZxC0gw%2FiOYsy1RGqU8Oboxh9w%3D%3D';

const cityToStation = {
  '서울특별시': '종로구',
  '부산광역시': '중구',
  '대구광역시': '중구',
  '인천광역시': '중구',
  '광주광역시': '북구',
  '대전광역시': '중구',
  '울산광역시': '남구',
  '구리시': '교문동',
  '전주시': '중앙동',
  '속초시': '교동',
  '포항시': '장량동',
  '제주시': '이도동',
  '충청북도': '청주시',
  '청주시': '청주시',
  '오송읍': '청주시',
  // 필요시 추가
};

const cityToAreaNo = {
  '서울특별시': '1100000000',
  '부산광역시': '2600000000',
  '대구광역시': '2700000000',
  '인천광역시': '2800000000',
  '광주광역시': '2900000000',
  '대전광역시': '3000000000',
  '울산광역시': '3100000000',
  '구리시': '4131000000',
  '전주시': '4511300000',
  '속초시': '4213100000',
  '포항시': '4711100000',
  '제주시': '5011000000',
  '충청북도': '4300000000',
  '청주시': '4311100000',
  '오송읍': '4311100000',
  // 필요시 추가
};

const UV_API_URL = 'https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4';
const SEOUL_AREA_NO = '1100000000'; 

const SUN_API_URL = 'http://localhost:5002/api/sun';

function getPm10Grade(val) {
  if (val === '') return { image: null, label: '정보 없음' };
  val = Number(val);
  if (val <= 30) return { image: goodImage};
  if (val <= 80) return { image: sosoImage};
  if (val <= 150) return { image: badImage};
  return { image: terribleImage};
}
function getPm25Grade(val) {
  if (val === '') return { image: null, label: '정보 없음' };
  val = Number(val);
  if (val <= 15) return { image: goodImage};
  if (val <= 35) return { image: sosoImage};
  if (val <= 75) return { image: badImage};
  return { image: terribleImage};
}

function getTodayTimeString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  return `${yyyy}${mm}${dd}${hh}`;
}

function getTodayDateString() {
  const now = new Date();
  // 현재 날짜로 설정 (미래 날짜 방지)
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

// 자외선지수 등급 라벨 함수
function getUvLabel(val) {
  if (val === null || val === '' || isNaN(val)) return '';
  val = Number(val);
  if (val >= 11) return '위험';
  if (val >= 8) return '매우높음';
  if (val >= 6) return '높음';
  if (val >= 3) return '보통';
  return '낮음';
}

const TodayDetail = () => {
  const city = useGlobalStore((state) => state.city) || '서울특별시';
  const currentCity = useGlobalStore((state) => state.currentCity);
  const selectedCity = useGlobalStore((state) => state.selectedCity) || currentCity;
  const [pm10, setPm10] = useState(null);
  const [pm25, setPm25] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uvIndex, setUvIndex] = useState(null);
  const [uvLoading, setUvLoading] = useState(false);
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const setCurrentCity = useGlobalStore((state) => state.setCurrentCity);

  // city를 측정소명으로 변환, 없으면 '중구' fallback
  const stationName = cityToStation[selectedCity] || '중구';
  const areaNo = cityToAreaNo[selectedCity] || '1100000000';

  // 미세먼지/초미세먼지 useEffect (실제 API)
  useEffect(() => {
    setLoading(true);
    fetch(
      `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${API_KEY}&numOfRows=1&pageNo=1&dataTerm=DAILY&ver=1.3&stationName=${encodeURIComponent(stationName)}&returnType=json`
    )
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const text = await res.text();
        
        // 에러 응답인지 확인
        if (text.includes('error') || text.includes('ERROR') || text.includes('Error')) {
          setPm10(null);
          setPm25(null);
          return;
        }
        
        try {
          const data = JSON.parse(text);
          
          // 응답에 에러가 있는지 확인
          if (data.response?.header?.resultCode !== '00') {
            setPm10(null);
            setPm25(null);
            return;
          }
          
          const item = data.response?.body?.items?.[0];
          setPm10(item ? item.pm10Value : null);
          setPm25(item ? item.pm25Value : null);
        } catch (err) {
          setPm10(null);
          setPm25(null);
        }
      })
      .catch((error) => {
        setPm10(null);
        setPm25(null);
      })
      .finally(() => setLoading(false));
  }, [stationName, selectedCity]);

  // 자외선지수 useEffect (실제 API)
  useEffect(() => {
    setUvLoading(true);
    const todayTime = getTodayTimeString(); // 오늘 날짜+시간으로 강제
    fetch(`${UV_API_URL}?serviceKey=${API_KEY}&areaNo=${areaNo}&time=${todayTime}&dataType=JSON`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text(); // JSON 대신 text로 받기
      })
      .then(text => {
        
        // 에러 응답인지 확인
        if (text.includes('error') || text.includes('ERROR') || text.includes('Error')) {
          setUvIndex(null);
          return;
        }
        
        try {
          // JSON 파싱 시도
          const data = JSON.parse(text);
          
          // 응답에 에러가 있는지 확인
          if (data.response?.header?.resultCode !== '00') {
            setUvIndex(null);
            return;
          }
          
          const item = data.response?.body?.items?.item?.[0];
          const uvValue = item?.h12 || item?.h9 || item?.h15 || null;
          setUvIndex(uvValue);
        } catch (jsonErr) {
          // JSON 파싱 실패 시 XML 파싱 (간단한 방법)
          
          // XML에서 에러인지 확인
          if (text.includes('<resultCode>') && !text.includes('<resultCode>00</resultCode>')) {
            setUvIndex(null);
            return;
          }
          
          // XML에서 자외선지수 값 추출
          const h12Match = text.match(/<h12>(\d+)<\/h12>/);
          const h9Match = text.match(/<h9>(\d+)<\/h9>/);
          const h15Match = text.match(/<h15>(\d+)<\/h15>/);
          
          const uvValue = h12Match?.[1] || h9Match?.[1] || h15Match?.[1] || null;
          setUvIndex(uvValue);
        }
      })
      .catch((error) => {
        setUvIndex(null);
      })
      .finally(() => setUvLoading(false));
  }, [areaNo, selectedCity]);

  // 일출/일몰 시간 useEffect (어제 기준 하드코딩)
  useEffect(() => {
    // 어제(2025년 7월 11일) 기준 일출/일몰 시간
    setSunrise('0523'); // 05:23 AM
    setSunset('1947');  // 19:47 PM
  }, [selectedCity]);

  // selectedCity가 없으면 currentCity로 설정
  const setSelectedCity = useGlobalStore((state) => state.setSelectedCity);
  useEffect(() => {
    if (!selectedCity && currentCity) {
      setSelectedCity(currentCity);
    }
  }, [selectedCity, currentCity, setSelectedCity]);

  // 대기오염 state
  const [ozone, setOzone] = useState(null);
  const [co, setCo] = useState(null);
  const [so2, setSo2] = useState(null);
  const [no2, setNo2] = useState(null);

  // 주요 도시 위도/경도 매핑
  const cityToLatLon = {
    '서울특별시': { lat: 37.5665, lon: 126.9780 },
    '부산광역시': { lat: 35.1796, lon: 129.0756 },
    '대구광역시': { lat: 35.8722, lon: 128.6025 },
    '인천광역시': { lat: 37.4563, lon: 126.7052 },
    '광주광역시': { lat: 35.1595, lon: 126.8526 },
    '대전광역시': { lat: 36.3504, lon: 127.3845 },
    '울산광역시': { lat: 35.5384, lon: 129.3114 },
    '충청북도': { lat: 36.6284, lon: 127.3307 },
    '청주시': { lat: 36.6284, lon: 127.3307 },
    '오송읍': { lat: 36.6284, lon: 127.3307 },
    // 필요시 더 추가
  };

  // 선택된 지역 위도/경도
  const selectedLat = cityToLatLon[selectedCity]?.lat || 37.5665;
  const selectedLon = cityToLatLon[selectedCity]?.lon || 126.9780;

  // 대기오염(오존, CO, SO2, NO2) useEffect 
  useEffect(() => {
    if (!selectedLat || !selectedLon) return;
    const OWM_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${selectedLat}&lon=${selectedLon}&appid=${OWM_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const components = data.list?.[0]?.components;
        setOzone(components?.o3 ?? null);
        setCo(components?.co ?? null);
        setSo2(components?.so2 ?? null);
        setNo2(components?.no2 ?? null);
      })
      .catch(() => {
        setOzone(null);
        setCo(null);
        setSo2(null);
        setNo2(null);
      });
  }, [selectedLat, selectedLon, selectedCity]);

  const pm10Grade = getPm10Grade(pm10);
  const pm25Grade = getPm25Grade(pm25);

  const weather = useGlobalStore((state) => state.weatherData);

  // 체감온도 값이 없으면 잘못된 도시명으로 간주
  const isInvalidCity = !weather?.main?.feels_like;

  if (isInvalidCity) {
    return (
      <div className="today-detail-box" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width:'1750px',
        minHeight: 250,
        marginLeft:'40px',
        fontSize: '2rem',
        color: '#fff',
        textAlign: 'center'
      }}>
        해당 도시의 날짜 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="today-detail-box">
      <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
        {/* 미세먼지 박스 */}
        <div className="misae-box">
          <div>미세먼지</div>
          {pm10Grade.image && (
            <img 
              src={pm10Grade.image} 
              style={{
                width: 90,
                height: 90,
                border: 'none',
                display: 'block'
              }}
              alt={pm10Grade.label}
            />
          )}
        </div>
        {/* 초미세먼지 박스 */}
        <div className="misae-box">
          <div>초미세먼지</div>
          {pm25Grade.image && (
            <img 
              src={pm25Grade.image} 
              style={{
                width: 90,
                height: 90,
                border: 'none',
                display: 'block'
              }}
              alt={pm25Grade.label}
            />
          )}
        </div>
        {/* 자외선지수 박스 */}
        <div className="misae-box">
          <div>자외선지수</div>
          <div style={{
            width: 90,
            height: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <span style={{ fontSize: '2.5rem' }}>{uvIndex}</span>
            <span style={{ fontSize: '1.1rem', marginTop: 4 }}>{getUvLabel(uvIndex)}</span>
          </div>
        </div>
        {/* 일출/일몰 박스 복구 */}
        <div className="misae-box-long">
          <div className="misae-box-sun">일출 <div className="sun-time">
            {sunrise ? `${sunrise.slice(0,2)}:${sunrise.slice(2,4)}` : ''} AM
          </div>
          </div>
          <div className="misae-box-sun">일몰 <div className="sun-time">
            {sunset ? `${sunset.slice(0,2)}:${sunset.slice(2,4)}` : ''} AM
          </div>
          </div>
        </div>
      </div>
      {/* 풍속 박스: 미세먼지 아래에 같은 디자인으로 */}
      {weather?.wind?.speed !== undefined && (
        <div className="wind-box-row">
          <div className="misae-box">
            <div>풍속</div>
            <div className="wind-value">
              {weather.wind.speed}m/s
            </div>
          </div>
          {weather?.main?.feels_like !== undefined && (
            <div className="misae-box">
              <div>체감온도</div>
              <div className="wind-value">
                {Math.floor(weather.main.feels_like)}°C
              </div>
            </div>
          )}
          {weather?.main?.humidity !== undefined && (
            <div className="misae-box">
              <div>습도</div>
              <div className="wind-value">
                {weather.main.humidity}%
              </div>
            </div>
          )}
          {/* 오존, CO, SO2, NO2 박스: 풍속/체감온도/습도 박스 옆에 추가 */}
          <div className="misae-box-long" style={{ minWidth: 320 }}>
            <div className="air-components-row">
              <div className="air-component">
                <div>오존</div>
                <div className="air-value">{ozone !== null ? (Math.round(ozone * 10) / 10) : ''}</div>
              </div>
              <div className="air-component">
                <div>일산화탄소</div>
                <div className="air-value">{co !== null ? (Math.round(co * 10) / 10) : ''}</div>
              </div>
              <div className="air-component">
                <div>이산화황</div>
                <div className="air-value">{so2 !== null ? (Math.round(so2 * 10) / 10) : ''}</div>
              </div>
              <div className="air-component">
                <div>이산화질소</div>
                <div className="air-value">{no2 !== null ? (Math.round(no2 * 10) / 10) : ''}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayDetail;