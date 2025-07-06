import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SubjectTitle = () => {
  const navigate = useNavigate();
  const goToHome = () => navigate('/');
  return (
    <div className="subject" onClick={goToHome}>
      여기, 날씨 <span>2025</span>
    </div>
  );
};

export default SubjectTitle; 