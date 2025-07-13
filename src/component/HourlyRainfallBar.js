import { FaCloudShowersHeavy } from 'react-icons/fa';
import '../App.css';

const HourlyRainfallBar = ({ data }) => {
  // 시간 라벨 표시: 첫 번째만 '12시', 나머지는 '13', '14'처럼 숫자만
  const getHourLabel = (hour, idx) => {
    if (idx === 0) return hour;
    // '13시' -> '13' 형태로 변환
    return hour.replace('시', '');
  };

  return (
    <div className="hourly-rainfall-container">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start'}}>
        {(data || []).map((item, idx) => (
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
            <div className="hourly-rainfall-hour">{getHourLabel(item.hour, idx)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyRainfallBar; 