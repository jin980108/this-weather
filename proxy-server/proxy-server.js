const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const xml2js = require('xml2js'); // 추가
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
  try {
    const response = await fetch(url);
    const text = await response.text();
    try {
      // JSON 파싱 시도
      const data = JSON.parse(text);
      res.json(data);
    } catch (jsonErr) {
      // JSON 파싱 실패 시 XML 파싱
      xml2js.parseString(text, { explicitArray: false }, (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Failed to parse XML', details: err.message });
        } else {
          res.json(result);
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data from public API', details: err.message });
  }
});

app.listen(5002, () => {
}); 