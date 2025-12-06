@echo off
echo ========================================
echo   Series Event Layer - Quick Start
echo ========================================
echo.
echo Starting all services...
docker compose up -d
echo.
echo Waiting for services to start...
timeout /t 10 /nobreak >nul
echo.
echo ========================================
echo   READY! Open in your browser:
echo ========================================
echo.
echo   Main App:  http://localhost:3000/events
echo   Original:  http://localhost:3000/
echo.
echo ========================================
echo.
echo Press any key to view logs (Ctrl+C to exit)...
pause >nul
docker compose logs -f nodejs_frontend

