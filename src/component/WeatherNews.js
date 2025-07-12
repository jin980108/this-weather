import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import loadingAnim from '../image/loading.json';
import useGlobalStore from '../store/useGlobalStore';

const weatherKeywords = [
  '기상청', '태풍', '폭염', '미세먼지', '강풍', '호우', '한파', '폭설', '기상', '날씨', '우박', '비', '눈', '폭우', '장마', '황사', '건조', '대설', '한랭', '고온', '저온'
];

const WeatherNews = () => {
  const news = useGlobalStore((state) => state.newsData);
  const setNews = useGlobalStore((state) => state.setNewsData);
  const youtubeVideos = useGlobalStore((state) => state.youtubeVideos);
  const setYoutubeVideos = useGlobalStore((state) => state.setYoutubeVideos);

  // 로컬 상태로 변경
  const [newsLoading, setNewsLoading] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(false);

  useEffect(() => {
    setNewsLoading(true);
    // 네이버 뉴스 가져오기
    fetch('http://localhost:5000/api/naver-news?q=날씨')
      .then(res => res.json())
      .then(data => {
        setNews(data.items || []);
        setNewsLoading(false);
      })
      .catch(error => {
        setNews([]);
        setNewsLoading(false);
      });

    setYoutubeLoading(true);
    fetch('http://localhost:5001/api/youtube-weather?q=날씨 예보&maxResults=5')
      .then(res => res.json())
      .then(data => {
        setYoutubeVideos(data.videos || []);
        setYoutubeLoading(false);
      })
      .catch(error => {
        setYoutubeVideos([]);
        setYoutubeLoading(false);
      });
  }, [setNews, setYoutubeVideos]); // 의존성 최소화

  const filteredNews = news.filter(item =>
    weatherKeywords.some(keyword =>
      (item.title && item.title.includes(keyword)) ||
      (item.description && item.description.includes(keyword))
    )
  );

  const isAnyLoading = newsLoading || youtubeLoading;

  return (
    <>
      {isAnyLoading && (
        <div className="weathernews-loading-overlay">
          <Lottie animationData={loadingAnim} style={{ width: 140, height: 140 }} />
        </div>
      )}
      <div className="weathernews-container">
        <div className="weathernews-section">
          <h2 className="weathernews-title">날씨 뉴스</h2>
          {filteredNews.length === 0 ? (
            <div>뉴스가 없습니다.</div>
          ) : (
            filteredNews.slice(0, 5).map((item, idx) => (
              <div key={idx} className="weathernews-card">
                {item.thumbnail && (
                  <img src={item.thumbnail} alt="" />
                )}
                <div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="weathernews-link">
                    {item.title.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')}
                  </a>
                  <div className="weathernews-desc" dangerouslySetInnerHTML={{ __html: item.description }} />
                  <div className="weathernews-date">
                    {new Date(item.pubDate).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 중간 경계선 */}
        <div className="weathernews-divider" />

        <div className="weathernews-section">
          <h2 className="weathernews-title">날씨 유튜브</h2>
          {youtubeVideos.length === 0 ? (
            <div>유튜브 영상이 없습니다.</div>
          ) : (
            youtubeVideos.map((video, idx) => (
              <div
                key={video.id}
                className="weathernews-youtube-card"
                onClick={() => window.open(video.videoUrl, '_blank')}
              >
                <img src={video.thumbnail} alt="" />
                <div className="weathernews-youtube-info">
                  <h3 className="weathernews-youtube-title">{video.title}</h3>
                  <p className="weathernews-youtube-channel">{video.channel}</p>
                  <p className="weathernews-youtube-meta">조회수 {video.views} • {video.publishedAt}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default WeatherNews; 