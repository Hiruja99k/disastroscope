@echo off
echo Starting DisastroScope Development Environment...
echo.

echo Starting Flask Backend...
start "Flask Backend" cmd /k "cd backend && call .venv\Scripts\activate && python app.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting React Frontend...
start "React Frontend" cmd /k "npm run dev"

echo.
echo Development servers are starting...
echo Flask Backend: http://localhost:5000
echo React Frontend: http://localhost:8080
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul
