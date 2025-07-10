import { create } from 'zustand';

const useGlobalStore = create((set) => ({
  // 현재 위치 도시
  currentCity: null,
  setCurrentCity: (city) => set({ currentCity: city }),

  // 선택된 도시 (검색/선택)
  selectedCity: null,
  setSelectedCity: (city) => set({ selectedCity: city }),

  // city는 selectedCity와 동일하게 동작 (호환성)
  city: null,
  setCity: (city) => set({ city, selectedCity: city }),

  // 날씨 데이터
  weatherData: null,
  setWeatherData: (data) => set({ weatherData: data }),

  // 로딩
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  // 예보 데이터
  forecast: [],
  setForecast: (forecast) => set({ forecast }),

  // 지도 관련
  mapPosition: [37.5665, 126.9780], // 서울 좌표
  setMapPosition: (pos) => set({ mapPosition: pos }),
  mapZoom: 7,
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  weatherInfo: null,
  setWeatherInfo: (info) => set({ weatherInfo: info }),
  initialLoading: true,
  setInitialLoading: (val) => set({ initialLoading: val }),

  // 뉴스 데이터
  newsData: [],
  setNewsData: (data) => set({ newsData: data }),
  youtubeVideos: [],
  setYoutubeVideos: (videos) => set({ youtubeVideos: videos }),
  youtubeLoading: true,
  setYoutubeLoading: (val) => set({ youtubeLoading: val }),

  // 강수 정보
  hourlyRainfall: [],
  setHourlyRainfall: (data) => set({ hourlyRainfall: data }),
  locationName: '',
  setLocationName: (name) => set({ locationName: name }),

  // 에러
  error: null,
  setError: (error) => set({ error }),

  // 필요시 추가
}));

export default useGlobalStore; 