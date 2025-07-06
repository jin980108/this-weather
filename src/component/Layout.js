import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      {/* 상단 고정 타이틀 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '120px',
        background: 'linear-gradient(90deg, #3a8dde 0%, #6ec6ff 100%)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
      }}>
        <span style={{
          fontFamily: 'Ownglyph_corncorn-Rg',
          fontSize: 64,
          color: 'white',
          marginLeft: 60,
          letterSpacing: 2
        }}>
          여기, 날씨 <span style={{ fontSize: 32, marginLeft: 12 }}>2025</span>
        </span>
      </div>
      {/* 사이드바 고정 */}
      <Navbar />
      {/* 페이지별 내용 */}
      <div style={{ marginTop: 120 }}>{children}</div>
    </div>
  );
};

export default Layout; 