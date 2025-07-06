require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// YouTube API 키 (환경변수에서 가져오기)
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'your_youtube_api_key_here';

app.get('/api/youtube-weather', async (req, res) => {
  try {
    console.log('YouTube API 요청 시작');
    console.log('API 키:', YOUTUBE_API_KEY);
    
    const query = req.query.q || '날씨 예보';
    const maxResults = req.query.maxResults || 5;
    
    console.log('검색 쿼리:', query);
    console.log('최대 결과 수:', maxResults);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults,
        order: 'relevance',
        key: YOUTUBE_API_KEY
      }
    });

    console.log('검색 결과:', response.data.items.length, '개');
    
    // 비디오 ID 목록 추출
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    console.log('비디오 ID들:', videoIds);
    
    // 비디오 상세 정보 가져오기 (조회수, 업로드 날짜 등)
    const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics',
        id: videoIds,
        key: YOUTUBE_API_KEY
      }
    });

    // 데이터 가공
    const videos = videoDetailsResponse.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
      views: formatViews(item.statistics.viewCount),
      publishedAt: formatDate(item.snippet.publishedAt),
      description: item.snippet.description,
      videoUrl: `https://www.youtube.com/watch?v=${item.id}`
    }));

    res.json({ videos });
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    
    // 할당량 초과 시 Mock 데이터 반환
    if (error.response?.status === 403 && error.response?.data?.error?.message?.includes('quota')) {
      console.log('할당량 초과로 Mock 데이터 반환');
      const mockVideos = [
        {
          id: 'mock1',
          title: '오늘 날씨 예보 - 기상청 공식',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          channel: '기상청 날씨',
          views: '15.2만',
          publishedAt: '2025년 7월 7일',
          description: '오늘 전국 날씨 예보입니다.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'mock2',
          title: '주말 날씨 전망 - 폭염 주의보',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          channel: '날씨뉴스',
          views: '8.7만',
          publishedAt: '2025년 7월 6일',
          description: '주말 날씨 전망과 폭염 주의보 발령 현황입니다.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'mock3',
          title: '장마철 날씨 특징과 대비법',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          channel: '기상정보',
          views: '12.3만',
          publishedAt: '2025년 7월 5일',
          description: '장마철 날씨의 특징과 대비 방법을 알아봅니다.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'mock4',
          title: '미세먼지 예보와 건강 관리법',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          channel: '환경기상',
          views: '6.9만',
          publishedAt: '2025년 7월 4일',
          description: '미세먼지 예보와 건강 관리 방법을 소개합니다.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'mock5',
          title: '태풍 예보와 대비 방법',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          channel: '기상특보',
          views: '22.1만',
          publishedAt: '2025년 7월 3일',
          description: '태풍 예보와 대비 방법에 대해 알아봅니다.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ];
      res.json({ videos: mockVideos });
    } else {
      res.status(500).json({ 
        error: 'YouTube API 요청 실패',
        details: error.response?.data || error.message 
      });
    }
  }
});

// 조회수 포맷팅 함수
function formatViews(viewCount) {
  const count = parseInt(viewCount);
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천`;
  }
  return count.toString();
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

app.listen(PORT, () => {
  console.log(`YouTube API Proxy 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 키: ${YOUTUBE_API_KEY ? '설정됨' : '설정되지 않음'}`);
}); 