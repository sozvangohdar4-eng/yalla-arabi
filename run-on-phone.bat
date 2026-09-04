@echo off
title Yalla Arabi - Samsung Galaxy S23 Ultra Mobile Server
chcp 65001 >nul
cls

echo ============================================================
echo   🌴 یەڵڵا عەرەبی | پەیوەستکردنی ئەپ بە Samsung Galaxy S23 Ultra
echo ============================================================
echo.

node serve-mobile.js
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [!] Error: Node.js was not found or failed to start.
  echo     Please make sure Node.js is installed.
  pause
)
