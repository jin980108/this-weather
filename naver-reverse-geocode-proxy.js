const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5003;

// CORS 설정
app.use(cors());
app.use(express.json());

// 네이버 역지오코딩 API 프록시
app.get('/api/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: '위도(lat)와 경도(lng)가 필요합니다.' });
    }

    // 네이버 지도 API 역지오코딩 요청
    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc', {
      params: {
        coords: `${lng},${lat}`,
        orders: 'legalcode,admcode,addr,roadaddr',
        output: 'json'
      },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID || 'your-client-id',
        'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET || 'your-client-secret'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: '역지오코딩 요청 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Naver Reverse Geocode Proxy' });
});

app.listen(PORT, () => {
  console.log(`네이버 역지오코딩 프록시 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`서버 URL: http://localhost:${PORT}`);
}); 