import React from 'react';
import { FaCloudShowersHeavy } from 'react-icons/fa';
import '../App.css';

const HourlyRainfallBar = ({ data }) => {
  return (
    <div className="hourly-rainfall-container">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', flexWrap: 'nowrap' }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            className="hourly-rainfall-box"
          >
            <div style={{ height: 32, marginBottom: 6, display: 'flex', alignItems: 'flex-end' }}>
              {item.amount > 0 ? (
                <FaCloudShowersHeavy size={28} color="#4fc3f7" />
              ) : (
                <FaCloudShowersHeavy size={28} color="#e0e0e0" style={{ opacity: 0.3 }} />
              )}
            </div>
            {/* 강수량 (소수점 첫째 자리까지) */}
            <div className="hourly-rainfall-amount" style={{ color: item.amount > 0 ? '#4fc3f7' : '#fff' }}>
              {Number(item.amount).toFixed(1)}mm
            </div>
            {/* 시간 */}
            <div className="hourly-rainfall-hour">{item.hour}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyRainfallBar; 