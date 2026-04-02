@echo off
cd /d "%~dp0"
echo ============================================
echo  TaskMate Backend - Starting Server
echo ============================================
echo.
echo Installing dependencies...
pip install -r requirements.txt
echo.
echo Starting FastAPI server on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
