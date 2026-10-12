@echo off
title Chanakya Campus Connect & Certificates Vault
cd /d "%~dp0"
echo ========================================================
echo   Starting Chanakya Campus Connect (Supervised Live Mode)
echo ========================================================
echo.
echo Launching Server, HTTP/2 Tunnel, and Active Keep-Alive...
node scripts/run_portal.js
pause
