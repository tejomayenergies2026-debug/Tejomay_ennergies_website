@echo off
echo ========================================
echo   Sonora AI (Website 2) Setup & Launch
echo ========================================
echo.

echo [1/2] Installing npm packages for Vite...
call npm install
echo Dependencies installed!
echo.

echo [2/2] Starting Vite dev server for Website 2...
echo Local App will open at http://localhost:5174
echo.
call npm run dev

pause
