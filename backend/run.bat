@echo off
REM Roda o backend Xavier Agent em modo desenvolvimento
REM Execute a partir da pasta backend\ ou use o atalho na raiz do projeto

cd /d "%~dp0"
uvicorn app.main:app --reload --port 8000
