import React from 'react';
import Navbar from './Navbar';
import '../App.css';

const MainFrame = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #7ecbff 0%, #256be6 100%)' }}>
      {/* 상단 타이틀 */}
      <div style={{
        fontFamily: 'Ownglyph_corncorn-Rg',
        fontSize: 64,
        color: 'white',
        padding: '40px 0 0 60px',
        letterSpacing: 2
      }}>
        여기, 날씨 <span style={{ fontSize: 32, marginLeft: 12 }}>2025</span>
      </div>
      {/* 사이드바 */}
      <Navbar />
      {/* 본문 */}
      <div style={{ marginLeft: 250, marginTop: 30 }}>{children}</div>
    </div>
  );
};

export default MainFrame; 