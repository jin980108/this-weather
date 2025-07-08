# React 환경에서 비트코인 가격 API 활용 가이드

React 환경에서 비트코인 가격을 실시간으로 가져올 수 있는 다양한 API들과 구현 방법을 정리했습니다.

## � 필수 Import 구문 및 설치

### 기본 패키지 설치
```bash
# React 프로젝트 생성 (Create React App 사용시)
npx create-react-app bitcoin-tracker
cd bitcoin-tracker

# 기본 HTTP 클라이언트
npm install axios

# 차트 라이브러리 (선택사항)
npm install recharts

# 유틸리티 라이브러리 (선택사항)
npm install lodash
```

### 필수 Import 구문들
```javascript
// React 기본 imports
import React, { useState, useEffect, useCallback } from 'react';

// HTTP 클라이언트 (axios 사용시)
import axios from 'axios';

// 차트 라이브러리 (recharts 사용시)
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// 유틸리티 함수 (lodash 사용시)
import { debounce } from 'lodash';
```

## �📊 주요 무료 API 서비스

### 1. CoinGecko API (무료)
**가장 인기 있는 암호화폐 API 중 하나**

- **무료 플랜**: 월 10,000 requests
- **Rate Limit**: 분당 10-30 requests
- **엔드포인트**: `https://api.coingecko.com/api/v3/`

#### 주요 기능
- 실시간 가격 정보
- 히스토리컬 데이터
- 마켓 데이터 (시가총액, 거래량 등)
- 코인 상세 정보

#### 예제 코드
```javascript
import React, { useState, useEffect } from 'react';

// 비트코인 현재 가격 가져오기
const fetchBitcoinPrice = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
  }
};

// React 컴포넌트에서 사용
const BitcoinPrice = () => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const getBitcoinPrice = async () => {
      const currentPrice = await fetchBitcoinPrice();
      setPrice(currentPrice);
    };

    getBitcoinPrice();
    
    // 30초마다 업데이트
    const interval = setInterval(getBitcoinPrice, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Bitcoin Price</h2>
      <p>${price ? price.toLocaleString() : 'Loading...'}</p>
    </div>
  );
};

export default BitcoinPrice;
```

### 2. CoinMarketCap API
**업계 표준 암호화폐 데이터 제공업체**

- **무료 플랜**: 월 10,000 requests
- **Rate Limit**: 분당 30 requests
- **엔드포인트**: `https://pro-api.coinmarketcap.com/v1/`
- **API Key 필요**: 회원가입 후 발급

#### 예제 코드
```javascript
import React, { useState, useEffect } from 'react';

const fetchFromCoinMarketCap = async () => {
  try {
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC', {
      headers: {
        'X-CMC_PRO_API_KEY': 'YOUR_API_KEY'
      }
    });
    const data = await response.json();
    return data.data.BTC.quote.USD.price;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 3. Binance API (무료)
**세계 최대 암호화폐 거래소 API**

- **완전 무료**
- **Rate Limit**: 가중치 시스템 사용
- **엔드포인트**: `https://api.binance.com/api/v3/`

#### 예제 코드
```javascript
import React, { useState, useEffect } from 'react';

const fetchBinancePrice = async () => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 4. CryptoCompare API
**포괄적인 암호화폐 데이터**

- **무료 플랜**: 일 100,000 requests
- **엔드포인트**: `https://min-api.cryptocompare.com/data/`

#### 예제 코드
```javascript
import React, { useState, useEffect } from 'react';

const fetchCryptoComparePrice = async () => {
  try {
    const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD');
    const data = await response.json();
    return data.USD;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 5. API Ninjas Crypto Price API
**간단하고 신뢰할 수 있는 API**

- **무료 플랜**: 월 100,000 requests
- **API Key 필요**
- **엔드포인트**: `https://api.api-ninjas.com/v1/cryptoprice`

#### 예제 코드
```javascript
import React, { useState, useEffect } from 'react';

const fetchAPINinjasPrice = async () => {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/cryptoprice?symbol=BTCUSD', {
      headers: {
        'X-Api-Key': 'YOUR_API_KEY'
      }
    });
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🛠️ 실제 React 프로젝트 구현 예제

### 완전한 비트코인 가격 트래커 컴포넌트

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BitcoinTracker = () => {
  const [bitcoinData, setBitcoinData] = useState({
    price: null,
    change24h: null,
    marketCap: null,
    loading: true,
    error: null
  });

  const fetchBitcoinData = async () => {
    try {
      setBitcoinData(prev => ({ ...prev, loading: true, error: null }));
      
      // CoinGecko API 사용
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
      );
      
      const { market_data } = response.data;
      
      setBitcoinData({
        price: market_data.current_price.usd,
        change24h: market_data.price_change_percentage_24h,
        marketCap: market_data.market_cap.usd,
        loading: false,
        error: null
      });
    } catch (error) {
      setBitcoinData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch Bitcoin data'
      }));
    }
  };

  useEffect(() => {
    fetchBitcoinData();
    
    // 1분마다 업데이트
    const interval = setInterval(fetchBitcoinData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(marketCap);
  };

  if (bitcoinData.loading) {
    return <div className="loading">Loading Bitcoin data...</div>;
  }

  if (bitcoinData.error) {
    return <div className="error">{bitcoinData.error}</div>;
  }

  return (
    <div className="bitcoin-tracker">
      <h2>Bitcoin (BTC)</h2>
      <div className="price-info">
        <div className="current-price">
          <span className="label">Current Price:</span>
          <span className="price">{formatPrice(bitcoinData.price)}</span>
        </div>
        
        <div className="price-change">
          <span className="label">24h Change:</span>
          <span className={`change ${bitcoinData.change24h >= 0 ? 'positive' : 'negative'}`}>
            {bitcoinData.change24h > 0 ? '+' : ''}{bitcoinData.change24h?.toFixed(2)}%
          </span>
        </div>
        
        <div className="market-cap">
          <span className="label">Market Cap:</span>
          <span className="value">{formatMarketCap(bitcoinData.marketCap)}</span>
        </div>
      </div>
      
      <button onClick={fetchBitcoinData} className="refresh-btn">
        Refresh Data
      </button>
    </div>
  );
};

export default BitcoinTracker;
```

### CSS 스타일링 예제

```css
.bitcoin-tracker {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
}

.bitcoin-tracker h2 {
  text-align: center;
  color: #f7931a;
  margin-bottom: 20px;
}

.price-info {
  margin-bottom: 20px;
}

.price-info > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.label {
  font-weight: bold;
  color: #666;
}

.price {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
}

.change.positive {
  color: #28a745;
}

.change.negative {
  color: #dc3545;
}

.refresh-btn {
  width: 100%;
  padding: 10px;
  background-color: #f7931a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.refresh-btn:hover {
  background-color: #e8851e;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #dc3545;
}
```

## 📈 고급 기능 구현

### 1. 차트 라이브러리와 함께 사용 (Recharts)

```bash
npm install recharts
```

```javascript
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const BitcoinChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7'
        );
        
        const formattedData = response.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: Math.round(price)
        }));
        
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchHistoricalData();
  }, []);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h3>Bitcoin Price Chart (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#f7931a" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BitcoinChart;
```

### 2. 여러 API를 활용한 데이터 비교

```javascript
import React, { useState, useEffect } from 'react';

const MultiSourcePriceComparison = () => {
  const [prices, setPrices] = useState({
    coingecko: null,
    binance: null,
    cryptocompare: null
  });

  useEffect(() => {
    const fetchAllPrices = async () => {
      try {
        const [coingeckoRes, binanceRes, cryptocompareRes] = await Promise.all([
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
          fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
        ]);

        const [coingeckoData, binanceData, cryptocompareData] = await Promise.all([
          coingeckoRes.json(),
          binanceRes.json(),
          cryptocompareRes.json()
        ]);

        setPrices({
          coingecko: coingeckoData.bitcoin.usd,
          binance: parseFloat(binanceData.price),
          cryptocompare: cryptocompareData.USD
        });
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="price-comparison">
      <h3>Bitcoin Price Comparison</h3>
      <div className="price-sources">
        <div className="source">
          <span className="source-name">CoinGecko:</span>
          <span className="price">${prices.coingecko?.toLocaleString()}</span>
        </div>
        <div className="source">
          <span className="source-name">Binance:</span>
          <span className="price">${prices.binance?.toLocaleString()}</span>
        </div>
        <div className="source">
          <span className="source-name">CryptoCompare:</span>
          <span className="price">${prices.cryptocompare?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MultiSourcePriceComparison;
```

## 💡 모범 사례 및 팁

### 1. Error Handling과 로딩 상태 관리
```javascript
import React, { useState, useEffect, useCallback } from 'react';

const useBitcoinPrice = () => {
  const [data, setData] = useState({
    price: null,
    loading: true,
    error: null
  });

  const fetchPrice = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData({
        price: result.bitcoin.usd,
        loading: false,
        error: null
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, []);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  return { ...data, refetch: fetchPrice };
};
```

### 2. Rate Limiting 고려사항
```javascript
import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

// Debounced API 호출
const debouncedFetch = debounce(fetchBitcoinPrice, 1000);

// Rate limit 체크
const checkRateLimit = (response) => {
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const resetTime = response.headers.get('X-RateLimit-Reset');
  
  if (remaining && parseInt(remaining) < 10) {
    console.warn('API rate limit almost reached');
  }
};
```

### 3. 캐싱 전략
```javascript
import React, { useState, useEffect } from 'react';

const CACHE_DURATION = 30000; // 30초
let priceCache = { data: null, timestamp: null };

const getCachedPrice = async () => {
  const now = Date.now();
  
  if (priceCache.data && (now - priceCache.timestamp) < CACHE_DURATION) {
    return priceCache.data;
  }
  
  const newPrice = await fetchBitcoinPrice();
  priceCache = { data: newPrice, timestamp: now };
  
  return newPrice;
};
```

## 🔧 필수 패키지 설치

```bash
# 기본 HTTP 클라이언트
npm install axios

# 차트 라이브러리 (선택사항)
npm install recharts

# 유틸리티 라이브러리 (선택사항)
npm install lodash
```

## 📝 요약

React에서 비트코인 가격을 가져오는 주요 방법들:

1. **CoinGecko API** - 가장 사용하기 쉽고 무료 제한이 관대함
2. **Binance API** - 완전 무료, 높은 신뢰성
3. **CoinMarketCap API** - 업계 표준, API 키 필요
4. **CryptoCompare API** - 포괄적인 데이터
5. **API Ninjas** - 간단한 구현

각 API마다 rate limit과 기능이 다르므로, 프로젝트 요구사항에 맞는 API를 선택하여 사용하시면 됩니다. CoinGecko API가 초보자에게 가장 추천되는 옵션입니다.