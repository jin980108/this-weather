const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());

const API_KEY = 'Yv1hbHrT7eIYKt%2BOiHheUeRT9OTpDh1yYBa3Lrc7sSPbR4sQsodegvvTxjEhXZxC0gw%2FiOYsy1RGqU8Oboxh9w%3D%3D';
const SUN_API_URL = 'https://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getRiseSetInfo';

app.get('/api/sun', async (req, res) => {
  const { locdate, location } = req.query;
  if (!locdate || !location) {
    return res.status(400).json({ error: 'locdate and location are required' });
  }
  const url = `${SUN_API_URL}?serviceKey=${API_KEY}&locdate=${locdate}&location=${encodeURIComponent(location)}&numOfRows=1&pageNo=1&_type=json`;
<<<<<<< HEAD
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data from public API' });
=======
  console.log('공공데이터포털 호출 URL:', url);
  console.log('요청 파라미터:', { locdate, location });
  try {
    const response = await fetch(url);
    console.log('응답 상태:', response.status);
    console.log('응답 헤더:', response.headers.raw());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('에러 응답:', errorText);
      return res.status(response.status).json({ 
        error: `API responded with status ${response.status}`,
        details: errorText
      });
    }
    
    const data = await response.json();
    console.log('응답 데이터:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (err) {
    console.error('에러 발생:', err);
    res.status(500).json({ 
      error: 'Failed to fetch data from public API',
      details: err.message
    });
>>>>>>> 82b7a5e (전체 UI 구성 변경 및 레이아웃 변경, 뉴스 및 유튜브 정보 원페이지 형태로 메인에 추가 및 네비게이션 삭제)
  }
});

app.listen(5002, () => {
  console.log('Proxy server running on http://localhost:5002');
}); 