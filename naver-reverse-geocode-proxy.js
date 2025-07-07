const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

console.log('All environment variables:', process.env);

const app = express();
app.use(cors());

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_MAP_CLIENT_ID || '4drll8xsnd';
const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_MAP_CLIENT_SECRET || 'REuS2MEt7m4sLpZHAJFTU1iTNi55LSeNyff4HnKb';

console.log('NAVER_CLIENT_ID:', NAVER_CLIENT_ID);
console.log('NAVER_CLIENT_SECRET:', NAVER_CLIENT_SECRET);

app.get('/api/naver-reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat, lon 쿼리 파라미터가 필요합니다.' });
  }
  try {
    const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lon},${lat}&orders=legalcode,admcode,addr,roadaddr&output=json`;
    const response = await axios.get(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Naver Reverse Geocode Proxy running on port ${PORT}`);
}); 