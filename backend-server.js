const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 5004;

// 미들웨어
app.use(cors());
app.use(express.json());

// MySQL 연결 설정
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'weather_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// 데이터베이스 연결 테스트
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 데이터베이스 연결 성공!');
    connection.release();
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
  }
}

// 즐겨찾기 도시 저장
app.post('/api/favorites', async (req, res) => {
  try {
    const { city, latitude, longitude } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO favorite_cities (city, latitude, longitude) VALUES (?, ?, ?)',
      [city, latitude, longitude]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('즐겨찾기 저장 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 즐겨찾기 도시 조회
app.get('/api/favorites', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM favorite_cities');
    res.json(rows);
  } catch (error) {
    console.error('즐겨찾기 조회 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 날씨 검색 기록 저장
app.post('/api/search-history', async (req, res) => {
  try {
    const { city, search_time } = req.body;
    await pool.execute(
      'INSERT INTO search_history (city, search_time) VALUES (?, ?)',
      [city, search_time || new Date()]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('검색 기록 저장 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 검색 기록 조회
app.get('/api/search-history', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM search_history ORDER BY search_time DESC LIMIT 10'
    );
    res.json(rows);
  } catch (error) {
    console.error('검색 기록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 포트 ${PORT}에서 실행 중입니다.`);
  testConnection();
});
