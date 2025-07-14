require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5001;

// JSON 파일 경로
const DATA_FILE_PATH = path.join(__dirname, 'youtube_weather_data.json');
const LAST_UPDATE_FILE_PATH = path.join(__dirname, 'last_update.json');

app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyAYkehSF8AEZtH7pU5loa1Z1A2UK8tUxCc';

// API 키 유효성 및 할당량 확인
async function checkAPIKeyValidity() {
  try {
    console.log('API 키 유효성 확인 중...');
    
    // 간단한 API 호출로 키 유효성 확인
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: 'test',
        type: 'video',
        maxResults: 1,
        key: YOUTUBE_API_KEY
      },
      timeout: 5000 // 5초 타임아웃
    });
    
    console.log('API 키가 유효합니다.');
    return { valid: true };
  } catch (error) {
    console.error('API 키 확인 실패:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.error?.message || '';
      if (errorMessage.includes('quota') || errorMessage.includes('Quota')) {
        console.log('API 할당량이 초과되었습니다.');
        return { valid: false, reason: 'quota_exceeded' };
      } else if (errorMessage.includes('key') || errorMessage.includes('API')) {
        console.log('API 키가 유효하지 않습니다.');
        return { valid: false, reason: 'invalid_key' };
      }
    }
    
    console.log('네트워크 오류 또는 기타 문제가 발생했습니다.');
    return { valid: false, reason: 'network_error' };
  }
}

// 오후 5시에 API 호출 여부 확인
async function shouldCallAPI() {
  try {
    const lastUpdateData = await fs.readFile(LAST_UPDATE_FILE_PATH, 'utf8');
    const lastUpdate = JSON.parse(lastUpdateData);
    const lastUpdateDate = new Date(lastUpdate.lastUpdate);
    const now = new Date();
    
    // 오늘 오후 5시 이전인지 확인
    const today5PM = new Date(now);
    today5PM.setHours(17, 0, 0, 0); // 오후 5시
    
    // 마지막 업데이트가 오늘 오후 5시 이전이면 API 호출
    return lastUpdateDate < today5PM;
  } catch (error) {
    // 파일이 없거나 읽기 실패 시 API 호출
    console.log('마지막 업데이트 정보를 찾을 수 없어 API를 호출합니다.');
    return true;
  }
}

// 마지막 업데이트 시간 저장
async function saveLastUpdate() {
  try {
    const updateInfo = {
      lastUpdate: new Date().toISOString(),
      description: '오후 5시 자동 업데이트'
    };
    await fs.writeFile(LAST_UPDATE_FILE_PATH, JSON.stringify(updateInfo, null, 2));
    console.log('마지막 업데이트 시간이 저장되었습니다.');
  } catch (error) {
    console.error('마지막 업데이트 시간 저장 실패:', error);
  }
}

// YouTube API 호출 및 데이터 저장
async function fetchAndSaveYouTubeData() {
  try {
    console.log('YouTube API 호출 중...');
    
    // 먼저 API 키 유효성 확인
    const apiCheck = await checkAPIKeyValidity();
    if (!apiCheck.valid) {
      console.log('API 키 문제로 Mock 데이터를 사용합니다.');
      return await createAndSaveMockData();
    }
    
    const query = '날씨 예보';
    const maxResults = 5;
    
    // YouTube 검색 API 호출
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults,
        order: 'relevance',
        key: YOUTUBE_API_KEY
      },
      timeout: 10000 // 10초 타임아웃
    });

    // 비디오 ID 목록 추출
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    
    // 비디오 상세 정보 가져오기
    const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics',
        id: videoIds,
        key: YOUTUBE_API_KEY
      },
      timeout: 10000 // 10초 타임아웃
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

    const result = { 
      videos,
      lastFetched: new Date().toISOString(),
      query: query,
      maxResults: maxResults
    };
    
    // JSON 파일에 저장
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(result, null, 2));
    console.log('YouTube 데이터가 JSON 파일에 저장되었습니다.');
    
    // 마지막 업데이트 시간 저장
    await saveLastUpdate();
    
    return result;
  } catch (error) {
    console.error('YouTube API 호출 실패:', error.response?.data || error.message);
    
    // 할당량 초과 또는 기타 API 에러 시 Mock 데이터 반환
    if (error.response?.status === 403 || 
        error.response?.status === 400 || 
        error.response?.status === 401 ||
        error.message.includes('quota') ||
        error.message.includes('API key') ||
        error.code === 'ECONNABORTED') {
      
      console.log('API 오류로 Mock 데이터를 저장합니다.');
      return await createAndSaveMockData();
    } else {
      // 네트워크 오류 등 기타 에러 시에도 Mock 데이터 반환
      console.log('네트워크 오류로 Mock 데이터를 저장합니다.');
      return await createAndSaveMockData();
    }
  }
}

// Mock 데이터 생성 및 저장
async function createAndSaveMockData() {
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
  
  const mockResult = {
    videos: mockVideos,
    lastFetched: new Date().toISOString(),
    query: '날씨 예보',
    maxResults: 5,
    isMockData: true,
    reason: 'API 할당량 초과 또는 네트워크 오류'
  };
  
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(mockResult, null, 2));
    await saveLastUpdate();
    console.log('Mock 데이터가 JSON 파일에 저장되었습니다.');
  } catch (saveError) {
    console.error('Mock 데이터 저장 실패:', saveError);
  }
  
  return mockResult;
}

// 저장된 데이터 읽기
async function loadSavedData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('저장된 데이터를 찾을 수 없습니다.');
    return null;
  }
}

app.get('/api/youtube-weather', async (req, res) => {
  try {
    // 오후 5시에 API 호출해야 하는지 확인
    const shouldCall = await shouldCallAPI();
    
    if (shouldCall) {
      console.log('오후 5시 이전이므로 YouTube API를 호출합니다.');
      const result = await fetchAndSaveYouTubeData();
      res.json(result);
    } else {
      console.log('오후 5시 이후이므로 저장된 데이터를 반환합니다.');
      const savedData = await loadSavedData();
      
      if (savedData) {
        res.json(savedData);
      } else {
        // 저장된 데이터가 없으면 API 호출
        console.log('저장된 데이터가 없어 API를 호출합니다.');
        const result = await fetchAndSaveYouTubeData();
        res.json(result);
      }
    }
  } catch (error) {
    console.error('YouTube 데이터 처리 실패:', error);
    res.status(500).json({ 
      error: 'YouTube 데이터 처리 실패',
      details: error.message 
    });
  }
});

// 수동 업데이트 엔드포인트 (관리자용)
app.post('/api/youtube-weather/update', async (req, res) => {
  try {
    console.log('수동 업데이트 요청됨');
    const result = await fetchAndSaveYouTubeData();
    res.json({
      message: '데이터가 성공적으로 업데이트되었습니다.',
      data: result
    });
  } catch (error) {
    console.error('수동 업데이트 실패:', error);
    res.status(500).json({ 
      error: '수동 업데이트 실패',
      details: error.message 
    });
  }
});

// 저장된 데이터 상태 확인 엔드포인트
app.get('/api/youtube-weather/status', async (req, res) => {
  try {
    const savedData = await loadSavedData();
    const lastUpdateData = await fs.readFile(LAST_UPDATE_FILE_PATH, 'utf8').catch(() => null);
    
    res.json({
      hasData: !!savedData,
      lastUpdate: lastUpdateData ? JSON.parse(lastUpdateData) : null,
      nextUpdate: '오후 5시',
      dataFile: DATA_FILE_PATH
    });
  } catch (error) {
    res.status(500).json({ 
      error: '상태 확인 실패',
      details: error.message 
    });
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
  console.log(`데이터 파일: ${DATA_FILE_PATH}`);
  console.log(`업데이트 시간: 오후 5시`);
  console.log(`최대 결과 수: 5개`);
  console.log('');
  console.log('사용 가능한 엔드포인트:');
  console.log('  GET  /api/youtube-weather - 날씨 관련 YouTube 영상 데이터');
  console.log('  POST /api/youtube-weather/update - 수동 데이터 업데이트');
  console.log('  GET  /api/youtube-weather/status - 데이터 상태 확인');
}); 