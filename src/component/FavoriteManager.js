import { useState, useEffect } from 'react';

const FavoriteManager = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // 즐겨찾기 목록 가져오기
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5004/api/favorites');
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('즐겨찾기 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 즐겨찾기 추가
  const addFavorite = async (city, latitude, longitude) => {
    try {
      const response = await fetch('http://localhost:5004/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, latitude, longitude }),
      });
      
      if (response.ok) {
        fetchFavorites(); // 목록 새로고침
      }
    } catch (error) {
      console.error('즐겨찾기 추가 실패:', error);
    }
  };

  // 검색 기록 저장
  const saveSearchHistory = async (city) => {
    try {
      await fetch('http://localhost:5004/api/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city }),
      });
    } catch (error) {
      console.error('검색 기록 저장 실패:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="favorite-manager">
      <h3>즐겨찾기 도시</h3>
      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <div className="favorite-list">
          {favorites.map((fav) => (
            <div key={fav.id} className="favorite-item">
              <span>{fav.city}</span>
              <button onClick={() => {
                // 해당 도시 날씨 조회 로직
                saveSearchHistory(fav.city);
              }}>
                날씨 보기
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteManager;
