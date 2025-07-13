import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import searchglass from '../image/searchglass.png';
import { useLocation } from 'react-router-dom';

const SubjectTitle = ({ onSearch, onReset }) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => setSearchText(e.target.value);

  useEffect(() => {
    setSearchText('');
  },[location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchText);
      setSearchText(''); // 검색 후 바로 초기화
    } else {
      navigate(`/?q=${encodeURIComponent(searchText)}`);
    }
  };

  const goToHome = () => {
    if (onReset) {
      onReset();
    } else {
      navigate('/');
    };
  }
  return (
    <div className="subject-title-container">
      <div className="subject" onClick={goToHome} style={{ cursor: 'pointer' }}>
        this weather <span>2025</span>
      </div>
      <form onSubmit={handleSubmit} style={{ position: 'relative', marginLeft: 24 }}>
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          placeholder="검색"
          className="subject-search-input"
        />
        <button type="submit" className="searchglass-inside">
          <img src={searchglass} alt="검색버튼"/>
        </button>
      </form>
    </div>
  );
};

export default SubjectTitle; 