@echo off
cd /d "%~dp0"
title Push Yalla Arabi to GitHub
if exist "%LOCALAPPDATA%\Programs\Git\cmd" set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
cls

echo ============================================================
echo   Pushing Yalla Arabi to your GitHub Repository...
echo   https://github.com/sozvangohdar4-eng/yalla-arabi.git
echo ============================================================
echo.

git push -u origin main

echo.
if errorlevel 1 (
    echo [!] If a browser window popped up, please sign in to GitHub to authorize the push.
) else (
    echo ============================================================
    echo [SUCCESS] Your code is now live on GitHub!
    echo ============================================================
    echo.
    echo Next step:
    echo 1. Open: https://github.com/sozvangohdar4-eng/yalla-arabi/actions
    echo 2. Click on "Build Yalla Arabi Android APK"
    echo 3. In ~2 minutes, download your APK from the Artifacts section!
    echo.
)

pause
