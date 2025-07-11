import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isWeatherMap = location.pathname === '/weathermap';
  const isWeatherNews = location.pathname === '/weathernews';

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
        display: 'flex',
        gap: '16px',
        margin: 0,
        padding: 0
      }}>
        <li onClick={() => navigate('/')} style={{ color: 'white', fontFamily: 'Ownglyph_corncorn-Rg', fontSize: '18px', padding: '6px 12px', borderRadius: '14px', cursor: 'pointer', transition: 'background 0.2s', background: 'rgba(255,255,255,0.08)' }}>메인</li>
        <li onClick={() => navigate('/rainfall')} style={{ color: 'white', fontFamily: 'Ownglyph_corncorn-Rg', fontSize: '18px', padding: '6px 12px', borderRadius: '14px', cursor: 'pointer', transition: 'background 0.2s', background: 'rgba(255,255,255,0.08)' }}>강수량 정보</li>
      </ul>
    </nav>
  );
};

export default Navbar;