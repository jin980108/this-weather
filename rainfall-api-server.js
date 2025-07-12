const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5003;

app.use(cors());

app.get('/api/rainfall', (req, res) => {
  res.json([
    { hour: '12시', amount: 0.0 },
    { hour: '13시', amount: 1.2 },
    { hour: '14시', amount: 0.0 },
    { hour: '15시', amount: 2.5 },
    { hour: '16시', amount: 0.0 },
    { hour: '17시', amount: 0.8 },
    { hour: '18시', amount: 0.0 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Rainfall API 서버가 http://localhost:${PORT} 에서 실행 중`);
}); 