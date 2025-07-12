require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5001;

let cache = {
  data: null,
  timestamp: null,
  expiresIn: 30 * 60 * 1000 // 30분 캐시
};

app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyAYkehSF8AEZtH7pU5loa1Z1A2UK8tUxCc';

app.get('/api/youtube-weather', async (req, res) => {
  
  // if (cache.data && cache.timestamp && (Date.now() - cache.timestamp) < cache.expiresIn) {
  //   console.log('캐시된 데이터 반환');
  //   return res.json(cache.data);
  // }

  try {
    
    const query = req.query.q || '날씨 예보';
    const maxResults = req.query.maxResults || 5;
    
    
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

    
    // 비디오 ID 목록 추출
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    
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

    const result = { videos };
    
    // 캐시에 저장
    cache.data = result;
    cache.timestamp = Date.now();
    
    res.json(result);
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    
    // 할당량 초과 시 Mock 데이터 반환 (기본 데이터 - 최적화로 하루동안 쓸 수 있게 되면 삭제 예정)
    if (error.response?.status === 403 && error.response?.data?.error?.message?.includes('quota')) {
      console.log('할당량 초과로 Mock 데이터 반환');
      const mockVideos = [
        {
          id: 'mock1',
          title: '오늘 날씨 예보 - 기상청 공식',
          thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=320&h=180&fit=crop&crop=center',
          channel: '기상청 날씨',
          views: '15.2만',
          publishedAt: '2025년 1월 15일',
          description: '오늘 전국 날씨 예보입니다.',
          videoUrl: '#'
        },
        {
          id: 'mock2',
          title: '주말 날씨 전망 - 폭염 주의보',
          thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=320&h=180&fit=crop&crop=center',
          channel: '날씨뉴스',
          views: '8.7만',
          publishedAt: '2025년 1월 14일',
          description: '주말 날씨 전망과 폭염 주의보 발령 현황입니다.',
          videoUrl: '#'
        },
        {
          id: 'mock3',
          title: '장마철 날씨 특징과 대비법',
          thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=320&h=180&fit=crop&crop=center',
          channel: '기상정보',
          views: '12.3만',
          publishedAt: '2025년 1월 13일',
          description: '장마철 날씨의 특징과 대비 방법을 알아봅니다.',
          videoUrl: '#'
        },
        {
          id: 'mock4',
          title: '미세먼지 예보와 건강 관리법',
          thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=320&h=180&fit=crop&crop=center',
          channel: '환경기상',
          views: '6.9만',
          publishedAt: '2025년 1월 12일',
          description: '미세먼지 예보와 건강 관리 방법을 소개합니다.',
          videoUrl: '#'
        },
        {
          id: 'mock5',
          title: '태풍 예보와 대비 방법',
          thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=320&h=180&fit=crop&crop=center',
          channel: '기상특보',
          views: '22.1만',
          publishedAt: '2025년 1월 11일',
          description: '태풍 예보와 대비 방법에 대해 알아봅니다.',
          videoUrl: '#'
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
  console.log(`캐시 시간: 30분`);
  console.log(`최대 결과 수: 5개`);
}); 