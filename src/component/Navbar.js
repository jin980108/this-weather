import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'absolute',
      marginTop: '250px',
      marginLeft: '20px',
      width: '200px',
      height: '400px',
      fontFamily: 'Ownglyph_corncorn-Rg',
      fontSize: '25px',
      color: 'lightyellow',
      zIndex: 1000
    }}>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: '20px'
      }}>
        <li style={{ marginBottom: '5px', width: '85px', cursor: 'pointer' }}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>메인 화면</Link></li>
        <li style={{ marginBottom: '5px', width: '90px', cursor: 'pointer' }}><Link to="/map" style={{ color: 'inherit', textDecoration: 'none' }}>날씨 지도</Link></li>
        <li onClick={() => navigate('/news')} style={{ marginBottom: '5px', width: '110px', cursor: 'pointer' }}>날씨 뉴스</li>
        <li onClick={() => navigate('/rainfall')} style={{ marginBottom: '5px', width: '110px', cursor: 'pointer' }}>강수량 정보</li>
      </ul>
    </nav>
  );
};

export default Navbar;