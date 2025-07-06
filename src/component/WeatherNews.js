import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import SubjectTitle from './SubjectTitle';
import { ClipLoader } from 'react-spinners';

const weatherKeywords = [
  '기상청', '태풍', '폭염', '미세먼지', '강풍', '호우', '한파', '폭설', '기상', '날씨', '우박', '비', '눈', '폭우', '장마', '황사', '건조', '대설', '한랭', '고온', '저온'
];

const WeatherNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [youtubeLoading, setYoutubeLoading] = useState(true);

  useEffect(() => {
    // 네이버 뉴스 가져오기
    fetch('http://localhost:5000/api/naver-news?q=날씨')
      .then(res => res.json())
      .then(data => {
        setNews(data.items || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });

    
    fetch('http://localhost:5001/api/youtube-weather?q=날씨 예보&maxResults=5')
      .then(res => res.json())
      .then(data => {
        setYoutubeVideos(data.videos || []);
        setYoutubeLoading(false);
      })
      .catch(error => {
        console.error('Error fetching YouTube videos:', error);
        setYoutubeLoading(false);
      });
  }, []);

  const filteredNews = news.filter(item =>
    weatherKeywords.some(keyword =>
      (item.title && item.title.includes(keyword)) ||
      (item.description && item.description.includes(keyword))
    )
  );

  return (
    <>
      <Navbar />
      <SubjectTitle />
      {(loading || youtubeLoading) ? (
        <div className="loading-container">
          <ClipLoader color="white" loading={true} size={150} />
        </div>
      ) : (
        <div className="weathernews-container">
          <div className="weathernews-section">
            <h2 className="weathernews-title">날씨 뉴스</h2>
            {filteredNews.slice(0, 5).map((item, idx) => (
              <div key={idx} className="weathernews-card">
                {item.thumbnail && (
                  <img src={item.thumbnail} alt="" />
                )}
                <div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold", fontSize: 16, color: "#333", textDecoration: "none", fontFamily: 'Ownglyph_corncorn-Rg' }}>
                    {item.title.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')}
                  </a>
                  <div style={{ fontSize: 14, color: "#555", margin: "4px 0", fontFamily: 'Ownglyph_corncorn-Rg' }}
                    dangerouslySetInnerHTML={{ __html: item.description }} />
                  <div style={{ fontSize: 12, color: "#888", fontFamily: 'Ownglyph_corncorn-Rg' }}>
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
            ))}
            {filteredNews.length === 0 && (
              <div style={{ color: '#888', fontFamily: 'Ownglyph_corncorn-Rg', textAlign: 'center', marginTop: 40 }}>
                기상 관련 뉴스를 찾을 수 없습니다.
              </div>
            )}
          </div>

          {/* 중간 경계선 */}
          <div className="weathernews-divider" />

          <div className="weathernews-section">
            <h2 className="weathernews-title">날씨 유튜브</h2>
            {youtubeVideos.map((video, idx) => (
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
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherNews; 