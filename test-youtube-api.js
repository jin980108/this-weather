const axios = require('axios');

async function testYouTubeAPI() {
  try {
    console.log('=== YouTube API 테스트 시작 ===');
    
    // 상태 확인
    console.log('\n1. 상태 확인:');
    const statusResponse = await axios.get('http://localhost:5001/api/youtube-weather/status');
    console.log('상태:', JSON.stringify(statusResponse.data, null, 2));
    
    // 메인 데이터 가져오기
    console.log('\n2. 데이터 가져오기:');
    const startTime = Date.now();
    const dataResponse = await axios.get('http://localhost:5001/api/youtube-weather');
    const endTime = Date.now();
    
    console.log(`응답 시간: ${endTime - startTime}ms`);
    console.log('데이터 개수:', dataResponse.data.videos?.length || 0);
    console.log('마지막 업데이트:', dataResponse.data.lastFetched);
    console.log('Mock 데이터 여부:', dataResponse.data.isMockData || false);
    
    if (dataResponse.data.reason) {
      console.log('사용 이유:', dataResponse.data.reason);
    }
    
    if (dataResponse.data.videos && dataResponse.data.videos.length > 0) {
      console.log('\n첫 번째 영상:');
      console.log('제목:', dataResponse.data.videos[0].title);
      console.log('채널:', dataResponse.data.videos[0].channel);
      console.log('조회수:', dataResponse.data.videos[0].views);
      console.log('ID:', dataResponse.data.videos[0].id);
    }
    
    console.log('\n=== 테스트 완료 ===');
    
  } catch (error) {
    console.error('테스트 실패:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n서버가 실행되지 않았습니다. 다음 명령으로 서버를 실행하세요:');
      console.log('node youtube-api-proxy.js');
    }
  }
}

testYouTubeAPI(); 