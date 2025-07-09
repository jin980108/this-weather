import React, { useEffect, useState } from 'react';
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
  // 관측 지역 구 
};

function getPm10Grade(val) {
  if (val === null || val === '' || isNaN(val)) return { color: '#bbb', label: '정보 없음' };
  val = Number(val);
  if (val <= 30) return { color: '#32a1ff', label: '좋음' };
  if (val <= 80) return { color: '#00c73c', label: '보통' };
  if (val <= 150) return { color: '#fd9b5a', label: '나쁨' };
  return { color: '#ff5959', label: '매우나쁨' };
}
function getPm25Grade(val) {
  if (val === null || val === '' || isNaN(val)) return { color: '#bbb', label: '정보 없음' };
  val = Number(val);
  if (val <= 15) return { color: '#32a1ff', label: '좋음' };
  if (val <= 35) return { color: '#00c73c', label: '보통' };
  if (val <= 75) return { color: '#fd9b5a', label: '나쁨' };
  return { color: '#ff5959', label: '매우나쁨' };
}

const TodayDetail = () => {
  const city = useGlobalStore((state) => state.city);
  const [pm10, setPm10] = useState(null);
  const [pm25, setPm25] = useState(null);
  const [loading, setLoading] = useState(false);

  // city를 측정소명으로 변환, 없으면 '중구' fallback
  const stationName = cityToStation[city] || '중구';

  useEffect(() => {
    if (!stationName) return;
    setLoading(true);
    fetch(
      `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${API_KEY}&numOfRows=1&pageNo=1&dataTerm=DAILY&ver=1.3&stationName=${encodeURIComponent(
        stationName
      )}&returnType=json`
    )
      .then((res) => res.json())
      .then((data) => {
        const item = data.response?.body?.items?.[0];
        setPm10(item ? item.pm10Value : null);
        setPm25(item ? item.pm25Value : null);
      })
      .catch(() => {
        setPm10(null);
        setPm25(null);
      })
      .finally(() => setLoading(false));
  }, [stationName]);

  const pm10Grade = getPm10Grade(pm10);
  const pm25Grade = getPm25Grade(pm25);

  return (
    <div className="today-detail-box">
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className='misae-box'>미세먼지 : {pm10Grade.label}
        <span style={{
          display: 'inline-block',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: pm10Grade.color,
          marginRight: 6,
          border: '2px solid #222',
        }} />
        </div>
        
      </div>
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <b>초미세먼지(PM2.5): </b>
        <span style={{
          display: 'inline-block',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: pm25Grade.color,
          marginRight: 6,
          border: '2px solid #222',
        }} />
        {loading
          ? '로딩 중...'
          : pm25 !== null && pm25 !== ''
          ? `${pm25} ㎍/㎥ (${pm25Grade.label})`
          : pm25Grade.label}
      </div> */}
    </div>
  );
};

export default TodayDetail;