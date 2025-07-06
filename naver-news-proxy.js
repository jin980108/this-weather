const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); 

const NAVER_CLIENT_ID = 'HGLf2YIWfX7xbWIZUo2X';
const NAVER_CLIENT_SECRET = 'z63MupdZrV';

app.get('/api/naver-news', async (req, res) => {
  const query = encodeURIComponent(req.query.q || '날씨');
  const url = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=10&sort=date`;
  try {
    const response = await axios.get(url, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Naver News Proxy running on port ${PORT}`)); 