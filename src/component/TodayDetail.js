<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import useGlobalStore from '../store/useGlobalStore';
import goodImage from '../image/good.png';
import sosoImage from '../image/soso.png';
import badImage from '../image/bad.png';
import terribleImage from '../image/terrible.png';
=======
import { useEffect, useState } from 'react';
import badImage from '../image/bad.png';
import goodImage from '../image/good.png';
import sosoImage from '../image/soso.png';
import terribleImage from '../image/terrible.png';
import useGlobalStore from '../store/useGlobalStore';
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)

const API_KEY = 'Yv1hbHrT7eIYKt%2BOiHheUeRT9OTpDh1yYBa3Lrc7sSPbR4sQsodegvvTxjEhXZxC0gw%2FiOYsy1RGqU8Oboxh9w%3D%3D';

const cityToStation = {
  '서울특별시': '종로구',
  '부산광역시': '중구',
  '대구광역시': '중구',
  '인천광역시': '중구',
  '광주광역시': '북구',
  '대전광역시': '중구',
  '울산광역시': '남구',

  // 관측 지역 구 
};

// 도시별 자외선지수 지역코드 매핑

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


const UV_API_URL = 'https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4';
const SEOUL_AREA_NO = '1100000000'; 

const SUN_API_URL = 'http://localhost:5002/api/sun';

function getPm10Grade(val) {
  if (val === null || val === '' || isNaN(val)) return { image: null, label: '정보 없음' };
  val = Number(val);
  if (val <= 30) return { image: goodImage};
  if (val <= 80) return { image: sosoImage};
  if (val <= 150) return { image: badImage};
  return { image: terribleImage};
}
function getPm25Grade(val) {
  if (val === null || val === '' || isNaN(val)) return { image: null, label: '정보 없음' };
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
<<<<<<< HEAD
=======
  // 현재 날짜로 설정 (미래 날짜 방지)
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

// 자외선지수 등급 라벨 함수
function getUvLabel(val) {
<<<<<<< HEAD
  if (val === null || val === '' || isNaN(val)) return '정보 없음';
=======
  if (val === null || val === '' || isNaN(val)) return '';
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
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

  // 미세먼지/초미세먼지/자외선지수/일출일몰 각각 currentCity, selectedCity 기준으로 fetch
  // (여기서는 selectedCity 기준으로만 fetch, currentCity와 다르면 두 번째 박스에 currentCity 정보도 표시)

  // city를 측정소명으로 변환, 없으면 '중구' fallback
  const stationName = cityToStation[selectedCity] || '중구';
  const areaNo = cityToAreaNo[selectedCity] || '1100000000';

  // currentCity용
  const currentStationName = cityToStation[currentCity] || '중구';
  const currentAreaNo = cityToAreaNo[currentCity] || '1100000000';

<<<<<<< HEAD
  // 임시(mock) 데이터
  const mockPm10 = 45; // 미세먼지
  const mockPm25 = 18; // 초미세먼지
  const mockUvIndex = 7; // 자외선지수
  const mockSunrise = '0542'; // 일출 (HHMM)
  const mockSunset = '1931'; // 일몰 (HHMM)

  // // 미세먼지/초미세먼지 useEffect
  // useEffect(() => {
  //   console.log('selectedCity:', selectedCity, 'stationName:', stationName);
  //   setLoading(true);
  //   fetch(
  //     `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${API_KEY}&numOfRows=1&pageNo=1&dataTerm=DAILY&ver=1.3&stationName=${encodeURIComponent(
  //       stationName
  //     )}&returnType=json`
  //   )
  //     .then(async (res) => {
  //       const text = await res.text();
  //       try {
  //         const data = JSON.parse(text);
  //         console.log('미세먼지 응답:', data);
  //         const item = data.response?.body?.items?.[0];
  //         setPm10(item ? item.pm10Value : null);
  //         setPm25(item ? item.pm25Value : null);
  //       } catch (err) {
  //         console.error('미세먼지 fetch JSON 파싱 에러:', err);
  //         console.error('미세먼지 fetch 응답 원본:', text);
  //         setPm10(null);
  //         setPm25(null);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('미세먼지 fetch 네트워크 에러:', err);
  //       setPm10(null);
  //       setPm25(null);
  //     })
  //     .finally(() => setLoading(false));
  // }, [stationName, selectedCity]);

  // // 자외선지수 useEffect
  // useEffect(() => {
  //   setUvLoading(true);
  //   const todayTime = getTodayTimeString();
  //   fetch(`${UV_API_URL}?serviceKey=${API_KEY}&areaNo=${areaNo}&time=${todayTime}&dataType=JSON`)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log('자외선지수 응답:', data); // 응답 전체 콘솔 출력
  //       console.log('자외선지수 items:', data.response?.body?.items);
  //       const item = data.response?.body?.items?.item?.[0];
  //       setUvIndex(item?.h12 || item?.h9 || item?.h15 || null);
  //     })
  //     .catch(() => setUvIndex(null))
  //     .finally(() => setUvLoading(false));
  // }, [areaNo]);

  // // 일출/일몰 시간 가져오기
  // useEffect(() => {
  //   // city 값 확인
  //   console.log('city:', city);

  //   if (!city || !/^(서울|부산|대구|인천|광주|대전|울산)/.test(city)) {
  //     setSunrise('');
  //     setSunset('');
  //     return;
  //   }
  //   const today = getTodayDateString();
  //   // 도시명에서 '특별시', '광역시', '시', '도' 등 제거 (API는 '서울', '부산' 등만 인식)
  //   let location = (city || '').replace(/(특별시|광역시|시|도)$/g, '');
  //   fetch(`http://localhost:5002/api/sun?locdate=${today}&location=${encodeURIComponent(location)}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log('일출/일몰 응답:', data);
  //       const item = data.response?.body?.items?.item?.[0];
  //       setSunrise(item?.sunrise || '');
  //       setSunset(item?.sunset || '');
  //     })
  //     .catch((err) => {
  //       console.error('일출/일몰 fetch 에러:', err);
  //       setSunrise('');
  //       setSunset('');
  //     });
  // }, [city]);

  // 앱 시작 시 현재 위치로 currentCity 자동 세팅
  useEffect(() => {
    if (!currentCity && window.naver && window.naver.maps) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
=======
  // 미세먼지/초미세먼지 useEffect (실제 API)
  useEffect(() => {
    setLoading(true);
    fetch(
      `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${API_KEY}&numOfRows=1&pageNo=1&dataTerm=DAILY&ver=1.3&stationName=${encodeURIComponent(stationName)}&returnType=json`
    )
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          const item = data.response?.body?.items?.[0];
          setPm10(item ? item.pm10Value : null);
          setPm25(item ? item.pm25Value : null);
        } catch (err) {
          setPm10(null);
          setPm25(null);
        }
      })
      .catch(() => {
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
      .then(res => res.json())
      .then(data => {
        const item = data.response?.body?.items?.item?.[0];
        setUvIndex(item?.h12 || item?.h9 || item?.h15 || null);
      })
      .catch(() => setUvIndex(null))
      .finally(() => setUvLoading(false));
  }, [areaNo]);

  // 일출/일몰 시간 useEffect (실제 API)
  useEffect(() => {
    if (!selectedCity || !/^(서울|부산|대구|인천|광주|대전|울산|충청북도|청주|오송)/.test(selectedCity)) {
      setSunrise('');
      setSunset('');
      return;
    }
    const today = getTodayDateString();
    let location = (selectedCity || '').replace(/(특별시|광역시|시|도)$/g, '');
    console.log('일출/일몰 API 호출:', { today, location, selectedCity });
    fetch(`http://localhost:5002/api/sun?locdate=${today}&location=${encodeURIComponent(location)}`)
      .then(res => res.json())
      .then(data => {
        const item = data.response?.body?.items?.item?.[0];
        setSunrise(item?.sunrise || '');
        setSunset(item?.sunset || '');
      })
      .catch((error) => {
        console.error('일출/일몰 API 에러:', error);
        setSunrise('');
        setSunset('');
      });
  }, [selectedCity]);

  // 앱 시작 시 현재 위치로 currentCity 자동 세팅
  useEffect(() => {
    console.log('현재 위치 감지 시작...');
    if (window.naver && window.naver.maps) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log('GPS 좌표:', { latitude, longitude });
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
          const naverLatLng = new window.naver.maps.LatLng(latitude, longitude);
          window.naver.maps.Service.reverseGeocode({
            coords: naverLatLng,
            orders: [window.naver.maps.Service.OrderType.ADDR].join(',')
          }, function(status, response) {
<<<<<<< HEAD
=======
            console.log('네이버 지오코딩 응답:', status, response);
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
            if (
              status === window.naver.maps.Service.Status.OK &&
              response.result &&
              Array.isArray(response.result.items) &&
              response.result.items.length > 0
            ) {
              const addr = response.result.items[0].addrdetail;
              // 광역시/특별시/도 등 포함한 도시명 추출
              const cityName = addr.sido;
<<<<<<< HEAD
              setCurrentCity(cityName);
            } else {
=======
              console.log('현재 위치 도시명:', cityName);
              setCurrentCity(cityName);
            } else {
              console.log('지오코딩 실패, 서울특별시로 fallback');
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
              setCurrentCity('서울특별시'); // fallback
            }
          });
        },
        (err) => {
<<<<<<< HEAD
          setCurrentCity('서울특별시'); // fallback
        }
      );
    }
  }, [currentCity, setCurrentCity]);
=======
          console.log('GPS 위치 감지 실패:', err);
          setCurrentCity('서울특별시'); // fallback
        }
      );
    } else {
      console.log('네이버 지도 API가 로드되지 않음');
    }
  }, [setCurrentCity]);

  // selectedCity가 없으면 currentCity로 설정
  const setSelectedCity = useGlobalStore((state) => state.setSelectedCity);
  useEffect(() => {
    if (!selectedCity && currentCity) {
      console.log('selectedCity를 currentCity로 설정:', currentCity);
      setSelectedCity(currentCity);
    }
  }, [selectedCity, currentCity, setSelectedCity]);
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)

  // 대기오염 state
  const [ozone, setOzone] = useState(null);
  const [co, setCo] = useState(null);
  const [so2, setSo2] = useState(null);
  const [no2, setNo2] = useState(null);

<<<<<<< HEAD
  // 현재 위치 위도/경도 (예시: 서울)
  const [lat, setLat] = useState(37.5665);
  const [lon, setLon] = useState(126.9780);

  // Geolocation으로 현재 위치 좌표 가져오기 (최초 1회)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLon(pos.coords.longitude);
        }
      );
    }
  }, []);

  // OpenWeatherMap Air Pollution API로 대기오염 정보 fetch
  useEffect(() => {
    if (!lat || !lon) return;
    const OWM_API_KEY = '4d5dbe065d3aa1070e9e85970eb06298';
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`)
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
  }, [lat, lon]);

=======
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
  // 주요 도시 위도/경도 매핑
  const cityToLatLon = {
    '서울특별시': { lat: 37.5665, lon: 126.9780 },
    '부산광역시': { lat: 35.1796, lon: 129.0756 },
    '대구광역시': { lat: 35.8722, lon: 128.6025 },
    '인천광역시': { lat: 37.4563, lon: 126.7052 },
    '광주광역시': { lat: 35.1595, lon: 126.8526 },
    '대전광역시': { lat: 36.3504, lon: 127.3845 },
    '울산광역시': { lat: 35.5384, lon: 129.3114 },
<<<<<<< HEAD
=======
    '충청북도': { lat: 36.6284, lon: 127.3307 },
    '청주시': { lat: 36.6284, lon: 127.3307 },
    '오송읍': { lat: 36.6284, lon: 127.3307 },
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
    // 필요시 더 추가
  };

  // 선택된 지역 위도/경도
  const selectedLat = cityToLatLon[selectedCity]?.lat || 37.5665;
  const selectedLon = cityToLatLon[selectedCity]?.lon || 126.9780;

<<<<<<< HEAD
  // 선택된 지역의 대기오염 정보 fetch
  useEffect(() => {
    if (!selectedLat || !selectedLon) return;
    console.log('fetching air pollution for', selectedCity, selectedLat, selectedLon); // fetch 전 로그
    const OWM_API_KEY = '4d5dbe065d3aa1070e9e85970eb06298';
=======
  // 대기오염(오존, CO, SO2, NO2) useEffect 
  useEffect(() => {
    if (!selectedLat || !selectedLon) return;
    const OWM_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
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
  }, [selectedLat, selectedLon]);

<<<<<<< HEAD
  const pm10Grade = getPm10Grade(mockPm10);
  const pm25Grade = getPm25Grade(mockPm25);
=======
  const pm10Grade = getPm10Grade(pm10);
  const pm25Grade = getPm25Grade(pm25);
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)

  const weather = useGlobalStore((state) => state.weatherData);

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
<<<<<<< HEAD
            <span style={{ fontSize: '2.5rem' }}>{mockUvIndex}</span>
            <span style={{ fontSize: '1.1rem', marginTop: 4 }}>{getUvLabel(mockUvIndex)}</span>
=======
            <span style={{ fontSize: '2.5rem' }}>{uvIndex}</span>
            <span style={{ fontSize: '1.1rem', marginTop: 4 }}>{getUvLabel(uvIndex)}</span>
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
          </div>
        </div>
        {/* 일출/일몰 박스 복구 */}
        <div className="misae-box-long">
          <div className="misae-box-sun">일출 <div className="sun-time">
<<<<<<< HEAD
            {mockSunrise ? `${mockSunrise.slice(0,2)}:${mockSunrise.slice(2,4)}` : ''} AM
          </div>
          </div>
          <div className="misae-box-sun">일몰 <div className="sun-time">
            {mockSunset ? `${mockSunset.slice(0,2)}:${mockSunset.slice(2,4)}` : ''} AM
=======
            {sunrise ? `${sunrise.slice(0,2)}:${sunrise.slice(2,4)}` : ''} AM
          </div>
          </div>
          <div className="misae-box-sun">일몰 <div className="sun-time">
            {sunset ? `${sunset.slice(0,2)}:${sunset.slice(2,4)}` : ''} AM
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
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