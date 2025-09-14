@echo off
echo Starting CodeBros Platform...

echo [1/3] Installing dependencies...
call npm install
call cd client && npm install

echo [2/3] Building the application...
call npm run build

start "" "http://localhost:3006"

echo [3/3] Starting backend and frontend...
start "Backend Server" cmd /k "npm run dev"
cd client
start "Frontend Server" cmd /k "npx vite"

echo.
echo ============================================
echo CodeBros Platform is starting up!
echo - Frontend: http://localhost:3006
echo - Backend API: http://localhost:5000
echo ============================================
echo.
pause