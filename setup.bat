@echo off
echo ===================================================
echo             JOBSHIELD AI SETUP UTILITY            
echo ===================================================
echo.
echo Installing root project orchestrators...
call npm install
echo.
echo Installing Express Backend dependencies...
cd backend
call npm install
cd ..
echo.
echo Installing React Frontend dependencies...
cd frontend
call npm install
cd ..
echo.
echo ===================================================
echo               SETUP COMPLETED SUCCESSFULLY         
echo ===================================================
echo.
echo To run the JobShield AI stack locally, execute:
echo   npm run dev
echo.
echo This command will concurrently run:
echo 1. React Frontend (Vite) on http://localhost:5173
echo 2. Express API Server on http://localhost:5000
echo 3. FastAPI NLP engine on http://127.0.0.1:8000
echo.
echo Make sure Python and MongoDB are installed and active.
echo ===================================================
pause
