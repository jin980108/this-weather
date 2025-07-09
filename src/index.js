import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavermapsProvider } from 'react-naver-maps';
import WeatherMap from './component/Page/WeatherMap';
import WeatherNews from './component/WeatherNews';
import RainfallInfo from './component/RainfallInfo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NavermapsProvider ncpClientId="YOUR_CLIENT_ID_HERE">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/weathermap" element={<WeatherMap />} />
          <Route path="/weathernews" element={<WeatherNews />} />
          <Route path="/rainfall" element={<RainfallInfo />} />
        </Routes>
      </BrowserRouter>
    </NavermapsProvider>
  </React.StrictMode>
);

reportWebVitals();

