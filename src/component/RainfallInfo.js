import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import SubjectTitle from './SubjectTitle';
import { ClipLoader } from 'react-spinners';

// 서울시 공공데이터 API 키 (실제 유효한 키로 교체 필요)
const SEOUL_RAINFALL_API_KEY = '674474467a6d61743630445945786c'; 

const fetchSeoulRainfall = async (date = null) => {
  try {
    const today = date || new Date().toISOString().slice(0,10).replace(/-/g, '');
    
    // 여러 API 엔드포인트 시도
    const endpoints = [
      `http://openapi.seoul.go.kr:8088/${SEOUL_RAINFALL_API_KEY}/json/ListRainfallService/1/100/${today}/`,
      `http://openapi.seoul.go.kr:8088/${SEOUL_RAINFALL_API_KEY}/json/ListRainfallService/1/100/`,
      `http://openapi.seoul.go.kr:8088/${SEOUL_RAINFALL_API_KEY}/json/ListRainfallService/1/50/${today}/`,
      `http://openapi.seoul.go.kr:8088/${SEOUL_RAINFALL_API_KEY}/json/ListRainfallService/1/25/${today}/`
    ];
    
    for (let i = 0; i < endpoints.length; i++) {
      const url = endpoints[i];
      console.log(`API 호출 시도 ${i + 1}:`, url);
      
      const res = await fetch(url);
      console.log(`API 응답 상태 ${i + 1}:`, res.status);
      
      if (!res.ok) {
        console.log(`HTTP 에러 ${i + 1}:`, res.status);
        continue;
      }
      
      const data = await res.json();
      console.log(`API 응답 데이터 ${i + 1}:`, data);
      
      // RESULT 객체 확인
      if (data.RESULT) {
        console.log('RESULT 객체 상세:', data.RESULT);
        console.log('RESULT.CODE:', data.RESULT.CODE);
        console.log('RESULT.MESSAGE:', data.RESULT.MESSAGE);
      }
      
      // 다양한 데이터 구조 시도
      const possibleData = data.ListRainfallService?.row || 
                          data.ListRainfallService || 
                          data.row || 
                          data.rainfall || 
                          data.data;
      
      if (possibleData && Array.isArray(possibleData) && possibleData.length > 0) {
        console.log(`성공! 데이터 찾음 (시도 ${i + 1}):`, possibleData);
        console.log('첫 번째 데이터 항목:', possibleData[0]);
        console.log('첫 번째 데이터 키들:', Object.keys(possibleData[0]));
        return possibleData;
      }
      
      // ListRainfallService가 있는지 확인
      if (data.ListRainfallService) {
        console.log('ListRainfallService 객체:', data.ListRainfallService);
        console.log('ListRainfallService 키들:', Object.keys(data.ListRainfallService));
      }
    }
    
    console.log('모든 API 엔드포인트 시도 실패');
    return [];
  } catch (error) {
    console.error('강수량 데이터 가져오기 실패:', error);
    return [];
  }
};

// 대체 데이터 (API 호출 실패 시 사용)
const getMockRainfallData = () => {
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  return [
    { STN_NM: '강남구', RAINFALL: '0.0' },
    { STN_NM: '강동구', RAINFALL: '0.0' },
    { STN_NM: '강북구', RAINFALL: '0.0' },
    { STN_NM: '강서구', RAINFALL: '0.0' },
    { STN_NM: '관악구', RAINFALL: '0.0' },
    { STN_NM: '광진구', RAINFALL: '0.0' },
    { STN_NM: '구로구', RAINFALL: '0.0' },
    { STN_NM: '금천구', RAINFALL: '0.0' },
    { STN_NM: '노원구', RAINFALL: '0.0' },
    { STN_NM: '도봉구', RAINFALL: '0.0' },
    { STN_NM: '동대문구', RAINFALL: '0.0' },
    { STN_NM: '동작구', RAINFALL: '0.0' },
    { STN_NM: '마포구', RAINFALL: '0.0' },
    { STN_NM: '서대문구', RAINFALL: '0.0' },
    { STN_NM: '서초구', RAINFALL: '0.0' },
    { STN_NM: '성동구', RAINFALL: '0.0' },
    { STN_NM: '성북구', RAINFALL: '0.0' },
    { STN_NM: '송파구', RAINFALL: '0.0' },
    { STN_NM: '양천구', RAINFALL: '0.0' },
    { STN_NM: '영등포구', RAINFALL: '0.0' },
    { STN_NM: '용산구', RAINFALL: '0.0' },
    { STN_NM: '은평구', RAINFALL: '0.0' },
    { STN_NM: '종로구', RAINFALL: '0.0' },
    { STN_NM: '중구', RAINFALL: '0.0' },
    { STN_NM: '중랑구', RAINFALL: '0.0' }
  ];
};

const RainfallInfo = () => {
  const [rainfall, setRainfall] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const loadRainfallData = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const data = await fetchSeoulRainfall();
        console.log('최종 받은 데이터:', data);
        
        if (data.length === 0) {
          console.log('API에서 데이터를 받지 못함, 대체 데이터 사용');
          setRainfall(getMockRainfallData());
          setUseMockData(true);
        } else {
          setRainfall(data);
          setUseMockData(false);
        }
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        setRainfall(getMockRainfallData());
        setUseMockData(true);
        setError(false); // 대체 데이터를 사용하므로 에러가 아님
      } finally {
        setLoading(false);
      }
    };

    loadRainfallData();
  }, []);

  // 강수량 수치를 가져오는 함수
  const getRainfallValue = (item) => {
    // 실제 API 응답 구조에 맞는 필드명들
    const possibleFields = [
      'RAINFALL10', 'rainfall10', 'RAINFALL', 'rainfall', 'RAIN_FALL', 'rain_fall', 
      'RAIN', 'rain', 'AMOUNT', 'amount', 'VALUE', 'value', 'DATA', 'data',
      'PRECIPITATION', 'precipitation', 'MM', 'mm'
    ];
    
    for (const field of possibleFields) {
      if (item[field] !== undefined && item[field] !== null) {
        return item[field];
      }
    }
    
    return '0.0'; // 기본값
  };

  // 관측소 이름을 가져오는 함수
  const getStationName = (item) => {
    // 실제 API 응답 구조에 맞는 필드명들
    const possibleFields = [
      'GU_NAME', 'gu_name', 'RAINGAUGE_NAME', 'raingauge_name',
      'STN_NM', 'stn_nm', 'STATION_NAME', 'station_name', 'NAME', 'name',
      'LOCATION', 'location', 'AREA', 'area', 'GU', 'gu'
    ];
    
    for (const field of possibleFields) {
      if (item[field] !== undefined && item[field] !== null) {
        return item[field];
      }
    }
    
    return '알 수 없음';
  };

  return (
    <>
      <Navbar />
      <SubjectTitle />
      <div style={{ maxWidth: 600, margin: '80px auto 0 auto', padding: 24, background: 'rgba(255,255,255,0.85)', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h2 style={{ fontFamily: 'Ownglyph_corncorn-Rg', fontSize: 28, marginBottom: 24, color: '#0077cc', textAlign: 'center' }}>서울시 강수량 현황</h2>
        
        {useMockData && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 20, 
            padding: '10px', 
            background: 'rgba(255, 193, 7, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            color: '#856404',
            fontFamily: 'Ownglyph_corncorn-Rg',
            fontSize: 14
          }}>
            ⚠️ API 연결 실패로 예시 데이터를 표시합니다
          </div>
        )}
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <ClipLoader color="#0077cc" loading={loading} size={50} />
            <div style={{ marginTop: 16, color: '#888', fontFamily: 'Ownglyph_corncorn-Rg' }}>강수량 데이터를 불러오는 중...</div>
          </div>
        ) : rainfall.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontFamily: 'Ownglyph_corncorn-Rg' }}>
            오늘은 강수량 데이터가 없습니다.
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20, color: '#666', fontFamily: 'Ownglyph_corncorn-Rg', fontSize: 14 }}>
              {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 기준
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {rainfall.map((item, index) => {
                const stationName = getStationName(item);
                const rainfallValue = getRainfallValue(item);
                
                return (
                  <li key={index} style={{ 
                    marginBottom: 12, 
                    fontFamily: 'Ownglyph_corncorn-Rg', 
                    fontSize: 16, 
                    color: '#333', 
                    background: 'rgba(0,0,0,0.04)', 
                    borderRadius: 8, 
                    padding: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span><b>{stationName}</b></span>
                    <span style={{ color: '#0077cc', fontWeight: 'bold' }}>{rainfallValue}mm</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default RainfallInfo; 