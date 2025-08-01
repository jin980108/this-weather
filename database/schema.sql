-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS weather_app;
USE weather_app;

-- 즐겨찾기 도시 테이블
CREATE TABLE IF NOT EXISTS favorite_cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 검색 기록 테이블
CREATE TABLE IF NOT EXISTS search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 날씨 데이터 캐시 테이블 (선택사항)
CREATE TABLE IF NOT EXISTS weather_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    weather_data JSON,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    INDEX idx_city_expires (city, expires_at)
);

-- 사용자 설정 테이블 (선택사항)
CREATE TABLE IF NOT EXISTS user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    theme VARCHAR(20) DEFAULT 'dark',
    temperature_unit VARCHAR(10) DEFAULT 'celsius',
    language VARCHAR(10) DEFAULT 'ko',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- sql 구문 작성 
