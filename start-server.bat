@echo off
echo.
echo  ✦ Rays - Audio Reactive Particles
echo  ══════════════════════════════════
echo.

:: Check for Python
where python >nul 2>nul
if %errorlevel%==0 (
    echo Starting server at http://localhost:8080
    echo Press Ctrl+C to stop.
    echo.
    python server.py
    exit /b
)

:: Try Python 3
where python3 >nul 2>nul
if %errorlevel%==0 (
    echo Starting server at http://localhost:8080
    echo Press Ctrl+C to stop.
    echo.
    python3 server.py
    exit /b
)

:: No Python found
echo Python not found! 
echo.
echo Install Python from: https://www.python.org/downloads/
echo.
echo Or use VS Code with Live Server extension.
echo.
pause
