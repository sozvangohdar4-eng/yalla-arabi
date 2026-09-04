@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Push Yalla Arabi to GitHub
cls

:: Auto-detect Git in local AppData
if exist "%LOCALAPPDATA%\Programs\Git\cmd" (
    set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;!PATH!"
)

echo ============================================================
echo   Yalla Arabi - Push to GitHub for Automated APK Build
echo ============================================================
echo.

:: 1. Check if git is installed
where git >nul 2>nul
if errorlevel 1 (
    echo [!] Git is not found on your system.
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git is detected on your system.
echo.

:: 2. Sync web assets
echo Synchronizing web assets into Android project...
node sync-assets.js
echo.

:: 3. Initialize Git repository if needed
if not exist ".git" (
    echo Initializing local Git repository...
    git init
    git branch -M main
)

:: 4. Ask for GitHub URL
echo ------------------------------------------------------------
echo Enter your GitHub repository URL:
echo (Example: https://github.com/your-username/yalla-arabi.git)
echo ------------------------------------------------------------
set /p REPO_URL="Repository URL: "

if "%REPO_URL%"=="" (
    echo [!] Error: Repository URL cannot be empty.
    pause
    exit /b 1
)

:: 5. Setup remote and push
git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%

echo.
echo Adding files and committing...
git add .
git commit -m "Yalla Arabi - Automated APK Build for Samsung S23 Ultra"

echo.
echo Pushing to GitHub (main branch)...
git push -u origin main --force

if errorlevel 1 (
    echo.
    echo [!] Push failed. Please check your GitHub URL or login credentials.
) else (
    echo.
    echo ============================================================
    echo [SUCCESS] Your code has been pushed to GitHub!
    echo ============================================================
    echo.
    echo What to do next:
    echo 1. Open your repository on GitHub.com in your browser.
    echo 2. Click on the "Actions" tab at the top.
    echo 3. Click on the "Build Yalla Arabi Android APK" workflow.
    echo 4. Wait ~2 minutes for the build to finish with a green checkmark.
    echo 5. Scroll down to "Artifacts" at the bottom and download:
    echo    "yalla-arabi-debug-apk"
    echo.
)

pause
