#!/bin/bash

echo "날씨 앱 프록시 서버들을 시작합니다..."

echo ""
echo "포트 5000 - 네이버 뉴스 프록시 서버 시작..."
gnome-terminal --title="Naver News Proxy" -- bash -c "node naver-news-proxy.js; exec bash" &

echo ""
echo "포트 5001 - YouTube API 프록시 서버 시작..."
gnome-terminal --title="YouTube API Proxy" -- bash -c "node youtube-api-proxy.js; exec bash" &

echo ""
echo "모든 서버가 시작되었습니다!"
echo "- 네이버 뉴스 프록시: http://localhost:5000"
echo "- YouTube API 프록시: http://localhost:5001"
echo ""
echo "React 앱을 시작하려면: npm start" 