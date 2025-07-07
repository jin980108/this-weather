import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isWeatherMap = location.pathname === '/map';
  const isWeatherNews = location.pathname === '/news';

  return (
    <nav style={{
      position: 'fixed',
      left: 0,
      right: isWeatherMap||isWeatherNews ? '15px' : 0,
      bottom: '30px',
      margin: '0 auto',
      width: 'fit-content',
      background: 'rgba(30, 30, 40, 0.6)',
      borderRadius: '30px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      padding: '8px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        gap: '18px',
        alignItems: 'center'
      }}>
        <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontFamily: 'Ownglyph_corncorn-Rg', fontSize: '18px', padding: '6px 12px', borderRadius: '14px', transition: 'background 0.2s', background: 'rgba(255,255,255,0.08)' }}>메인 화면</Link></li>
        <li><Link to="/map" style={{ color: 'white', textDecoration: 'none', fontFamily: 'Ownglyph_corncorn-Rg', fontSize: '18px', padding: '6px 12px', borderRadius: '14px', transition: 'background 0.2s', background: 'rgba(255,255,255,0.08)' }}>날씨 지도</Link></li>
        <li onClick={() => navigate('/news')} style={{ color: 'white', fontFamily: 'Ownglyph_corncorn-Rg', fontSize: '18px', padding: '6px 12px', borderRadius: '14px', cursor: 'pointer', transition: 'background 0.2s', background: 'rgba(255,255,255,0.08)' }}>날씨 뉴스</li>
        <li onClick={() => navigate('/rainfall')} style={{ color: 'white', fontFamily: 'Ownglyph_corncorn-Rg', fontSize: '18px', padding: '6px 12px', borderRadius: '14px', cursor: 'pointer', transition: 'background 0.2s', background: 'rgba(255,255,255,0.08)' }}>강수량 정보</li>
      </ul>
    </nav>
  );
};

export default Navbar;