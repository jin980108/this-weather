# React Query 적용 가이드

## 현재 프로젝트 분석

현재 프로젝트는 다음과 같은 구조를 가지고 있습니다:
- React 18.3.1 + Create React App
- Zustand를 사용한 상태 관리
- axios + fetch를 혼용한 API 호출
- 날씨, 뉴스, YouTube API 등 다양한 데이터 소스

## React Query 적용의 장점

1. **캐싱과 자동 리페칭**: 데이터 캐싱으로 불필요한 API 호출 감소
2. **로딩 상태 관리**: isLoading, error 상태를 자동으로 관리
3. **백그라운드 업데이트**: 데이터 자동 갱신으로 사용자 경험 향상
4. **Optimistic Updates**: 낙관적 업데이트 지원

## 단계별 적용 방법

### 1. React Query 설치

```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools  # 개발 도구 (선택사항)
```

### 2. QueryClient 설정

`src/utils/queryClient.js` 생성:
```javascript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 3. App.js에 QueryClient Provider 설정

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* 기존 컴포넌트들 */}
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 4. API 함수 분리

`src/api/` 디렉토리 생성 후 API 함수들을 분리:

#### `src/api/weatherApi.js`
```javascript
import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const weatherApi = {
  getCurrentWeather: async (city) => {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  },

  getForecast: async (city) => {
    const response = await axios.get(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  },

  getAirPollution: async (lat, lon) => {
    const response = await axios.get(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    return response.data;
  }
};
```

#### `src/api/newsApi.js`
```javascript
export const newsApi = {
  getWeatherNews: async () => {
    const response = await fetch('http://localhost:5000/api/naver-news?q=날씨');
    if (!response.ok) throw new Error('뉴스 데이터를 가져오는데 실패했습니다');
    return response.json();
  }
};
```

### 5. 커스텀 훅 생성

#### `src/hooks/useWeatherData.js`
```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weatherApi } from '../api/weatherApi';

// 현재 날씨 조회
export const useCurrentWeather = (city) => {
  return useQuery({
    queryKey: ['weather', 'current', city],
    queryFn: () => weatherApi.getCurrentWeather(city),
    enabled: !!city, // city가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 날씨 예보 조회
export const useForecast = (city) => {
  return useQuery({
    queryKey: ['weather', 'forecast', city],
    queryFn: () => weatherApi.getForecast(city),
    enabled: !!city,
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// 대기오염 정보 조회
export const useAirPollution = (lat, lon) => {
  return useQuery({
    queryKey: ['weather', 'airPollution', lat, lon],
    queryFn: () => weatherApi.getAirPollution(lat, lon),
    enabled: !!(lat && lon),
    staleTime: 15 * 60 * 1000, // 15분
  });
};

// 날씨 데이터 새로고침
export const useRefreshWeather = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (city) => {
      // 해당 도시의 모든 날씨 관련 쿼리 무효화
      await queryClient.invalidateQueries(['weather', 'current', city]);
      await queryClient.invalidateQueries(['weather', 'forecast', city]);
    },
  });
};
```

#### `src/hooks/useNewsData.js`
```javascript
import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../api/newsApi';

export const useWeatherNews = () => {
  return useQuery({
    queryKey: ['news', 'weather'],
    queryFn: newsApi.getWeatherNews,
    staleTime: 30 * 60 * 1000, // 30분
    cacheTime: 60 * 60 * 1000, // 1시간
  });
};
```

### 6. 컴포넌트 리팩토링 예시

#### Before: `WeatherBox.js` (기존)
```javascript
const WeatherBox = () => {
  const weather = useGlobalStore((state) => state.weatherData);
  const isLoading = useGlobalStore((state) => state.isLoading);
  
  // 기존 fetch 로직...
  
  if (isLoading) return <div>로딩중...</div>;
  if (!weather) return null;
  
  return (
    <div>
      {/* 날씨 정보 렌더링 */}
    </div>
  );
};
```

#### After: React Query 적용
```javascript
import { useCurrentWeather } from '../hooks/useWeatherData';

const WeatherBox = () => {
  const city = useGlobalStore((state) => state.selectedCity);
  const { data: weather, isLoading, error } = useCurrentWeather(city);
  
  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>오류: {error.message}</div>;
  if (!weather) return null;
  
  return (
    <div>
      {/* 날씨 정보 렌더링 */}
    </div>
  );
};
```

### 7. Zustand와의 협력

React Query와 Zustand를 함께 사용하는 경우:

```javascript
// useGlobalStore.js 수정
const useGlobalStore = create((set) => ({
  // UI 상태만 관리
  selectedCity: null,
  setSelectedCity: (city) => set({ selectedCity: city }),
  
  currentCity: null,
  setCurrentCity: (city) => set({ currentCity: city }),
  
  mapPosition: [37.5665, 126.9780],
  setMapPosition: (pos) => set({ mapPosition: pos }),
  
  // 서버 상태는 React Query가 관리하므로 제거
  // weatherData, forecast, newsData 등 제거
}));
```

### 8. 적용 우선순위

1. **1단계**: 날씨 API 호출 (가장 핵심 기능)
   - `useCurrentWeather`
   - `useForecast`
   - `useAirPollution`

2. **2단계**: 뉴스/유튜브 데이터
   - `useWeatherNews`
   - `useYoutubeVideos`

3. **3단계**: 기타 API
   - 강수량 정보
   - 지역 정보 등

### 9. 성능 최적화 팁

#### 쿼리 키 구조화
```javascript
// 계층적 쿼리 키 사용
['weather'] // 모든 날씨 데이터
['weather', 'current'] // 현재 날씨만
['weather', 'current', 'Seoul'] // 서울 현재 날씨
['weather', 'forecast', 'Seoul'] // 서울 예보
```

#### 미리 로딩 (Prefetching)
```javascript
const useWeatherPrefetch = () => {
  const queryClient = useQueryClient();
  
  const prefetchWeather = (city) => {
    queryClient.prefetchQuery({
      queryKey: ['weather', 'current', city],
      queryFn: () => weatherApi.getCurrentWeather(city),
      staleTime: 5 * 60 * 1000,
    });
  };
  
  return { prefetchWeather };
};
```

#### 백그라운드 업데이트
```javascript
export const useCurrentWeather = (city) => {
  return useQuery({
    queryKey: ['weather', 'current', city],
    queryFn: () => weatherApi.getCurrentWeather(city),
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000, // 10분마다 자동 갱신
    refetchOnWindowFocus: true, // 윈도우 포커스 시 갱신
  });
};
```

### 10. 에러 처리

#### 글로벌 에러 처리
```javascript
// queryClient.js에 추가
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.error('쿼리 에러:', error);
        // 토스트 메시지나 에러 리포팅
      },
    },
    mutations: {
      onError: (error) => {
        console.error('뮤테이션 에러:', error);
      },
    },
  },
});
```

#### 컴포넌트별 에러 처리
```javascript
const WeatherBox = () => {
  const city = useGlobalStore((state) => state.selectedCity);
  const { data: weather, isLoading, error, refetch } = useCurrentWeather(city);
  
  if (error) {
    return (
      <div className="error-container">
        <p>날씨 정보를 불러오는데 실패했습니다.</p>
        <button onClick={refetch}>다시 시도</button>
      </div>
    );
  }
  
  // 나머지 로직...
};
```

### 11. 마이그레이션 체크리스트

- [ ] React Query 패키지 설치
- [ ] QueryClient 설정 및 Provider 래핑
- [ ] API 함수들을 별도 파일로 분리
- [ ] 커스텀 훅 생성 (`useCurrentWeather`, `useForecast` 등)
- [ ] 기존 컴포넌트에서 React Query 훅으로 교체
- [ ] Zustand에서 서버 상태 제거 (UI 상태만 유지)
- [ ] 에러 처리 및 로딩 상태 개선
- [ ] DevTools 설정 (개발 환경)
- [ ] 성능 최적화 (쿼리 키, 캐시 시간 등)

이렇게 단계적으로 적용하면 기존 기능을 유지하면서도 더 나은 데이터 관리와 사용자 경험을 제공할 수 있습니다.