@echo off
REM ─────────────────────────────────────────────────────────────────────────────
REM  SwapIt AI Service — Startup Script
REM  Activates the virtual environment and launches the FastAPI server on :8000
REM ─────────────────────────────────────────────────────────────────────────────

cd /d "%~dp0"

IF NOT EXIST "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found. Run setup.bat first.
    pause
    exit /b 1
)

call venv\Scripts\activate.bat
echo [SwapIt AI] Virtual environment activated.

REM Verify torch is importable
python -c "import torch" 2>NUL
IF %ERRORLEVEL% NEQ 0 (
    echo [SwapIt AI] Installing dependencies into venv...
    pip install -r requirements.txt
)

echo [SwapIt AI] Starting FastAPI server on http://localhost:8000
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
