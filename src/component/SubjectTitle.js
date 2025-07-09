import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import searchglass from '../image/searchglass.png';

const SubjectTitle = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const goToHome = () => navigate('/');

  const handleInputChange = (e) => setSearchText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchText);
    } else {
      navigate(`/?q=${encodeURIComponent(searchText)}`);
    }
  };

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
          <img src={searchglass}/>
        </button>
      </form>
    </div>
  );
};

export default SubjectTitle; 