# Zustand + React Query 리팩토링 분석 보고서

## 📊 현재 상황 분석

### 설치된 패키지
- **zustand**: 5.0.6 ✅ 
- **React**: 18.3.1
- **axios**: 1.10.0 (HTTP 클라이언트)

### 현재 아키텍처
- **전역 상태 관리**: zustand로 모든 상태 관리
- **API 호출**: 수동으로 fetch API 사용
- **로딩 관리**: 수동으로 isLoading 상태 관리
- **에러 핸들링**: 기본적인 error 상태만 존재

## 🔄 리팩토링 가능성 및 이점

### ✅ 완전히 가능한 이유
1. **상호 보완적 관계**: zustand(클라이언트 상태) + React Query(서버 상태)
2. **점진적 마이그레이션**: 기존 코드를 단계적으로 변경 가능
3. **호환성**: React 18과 완벽 호환

### 🚀 리팩토링 후 개선사항

#### 1. 서버 상태 관리 개선
- **자동 캐싱**: API 응답 자동 캐시
- **백그라운드 리프레시**: 데이터 자동 동기화
- **중복 요청 제거**: 동일한 요청 자동 중복 제거
- **에러 재시도**: 실패 시 자동 재시도

#### 2. 성능 최적화
- **최적화된 리렌더링**: 필요한 컴포넌트만 리렌더링
- **메모리 효율성**: 사용하지 않는 데이터 자동 가비지 컬렉션
- **네트워크 최적화**: 스마트한 데이터 페칭

#### 3. 개발자 경험 개선
- **DevTools**: React Query DevTools로 디버깅 향상
- **로딩/에러 상태**: 자동 관리로 보일러플레이트 코드 감소
- **타입 안정성**: TypeScript 지원 강화

## 🏗️ 리팩토링 전략

### Phase 1: React Query 설치 및 설정
```bash
npm install @tanstack/react-query
```

### Phase 2: 상태 분리 계획

#### React Query로 이관할 서버 상태
- `weatherData`: 현재 날씨 데이터
- `forecast`: 예보 데이터  
- `newsData`: 뉴스 데이터
- `youtubeVideos`: YouTube 비디오
- `hourlyRainfall`: 시간별 강수량

#### zustand에서 유지할 클라이언트 상태
- `currentCity`: 현재 선택된 도시
- `selectedCity`: 검색된 도시
- `mapPosition`: 지도 위치/줌
- `initialLoading`: 초기 로딩 상태
- `locationName`: 위치명

### Phase 3: 구현 예시

#### Custom Hooks 생성
```javascript
// hooks/useWeatherData.js
export const useWeatherData = (city) => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchWeatherData(city),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

// hooks/useForecastData.js
export const useForecastData = (city) => {
  return useQuery({
    queryKey: ['forecast', city],
    queryFn: () => fetchForecastData(city),
    staleTime: 15 * 60 * 1000, // 15분
  });
};
```

#### 리팩토링된 zustand Store
```javascript
// store/useGlobalStore.js
const useGlobalStore = create((set) => ({
  // 클라이언트 상태만 관리
  currentCity: null,
  setCurrentCity: (city) => set({ currentCity: city }),
  
  selectedCity: null,
  setSelectedCity: (city) => set({ selectedCity: city }),
  
  mapPosition: [37.5665, 126.9780],
  setMapPosition: (pos) => set({ mapPosition: pos }),
  
  mapZoom: 7,
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  
  initialLoading: true,
  setInitialLoading: (val) => set({ initialLoading: val }),
  
  locationName: '',
  setLocationName: (name) => set({ locationName: name }),
}));
```

## 📈 예상 효과

### 코드 품질
- **라인 수 감소**: 40-50% 보일러플레이트 코드 제거
- **가독성 향상**: 관심사 분리로 코드 이해도 증가
- **유지보수성**: 버그 발생률 감소

### 사용자 경험
- **빠른 로딩**: 캐시된 데이터로 즉시 표시
- **부드러운 전환**: 백그라운드 업데이트
- **안정성**: 네트워크 오류 시 자동 복구

### 개발 효율성
- **디버깅**: React Query DevTools 활용
- **테스팅**: Mock 데이터 쉬운 적용
- **확장성**: 새로운 API 엔드포인트 쉬운 추가

## 🎯 권장사항

### 즉시 시작 가능
현재 프로젝트 구조와 zustand 사용 패턴이 React Query와의 통합에 매우 적합합니다. 특히:

1. **명확한 서버/클라이언트 상태 구분 가능**
2. **기존 컴포넌트 구조 재사용 가능**
3. **점진적 마이그레이션으로 위험도 최소화**

### 마이그레이션 순서
1. React Query 설치 및 QueryClient 설정
2. 날씨 API 호출 부분부터 시작 (핵심 기능)
3. 뉴스, YouTube API 순차 적용
4. 최적화 및 DevTools 활용

**결론**: zustand + React Query 조합은 현재 프로젝트에 **매우 이상적인 선택**이며, 코드 품질과 사용자 경험을 크게 향상시킬 것으로 예상됩니다.