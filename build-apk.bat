@echo off
title Yalla Arabi - Build Android APK
chcp 65001 >nul
cls

echo ============================================================
echo   🌴 یەڵڵا عەرەبی | دروستکردنی فایلی APK بۆ ئەندرۆید
echo ============================================================
echo.

echo 1. هاوکاتکردنی فایلەکان بۆ ناو پڕۆژەی ئەندرۆید...
node sync-assets.js
if %ERRORLEVEL% NEQ 0 (
    echo [!] هەڵە لە هاوکاتکردنی فایلەکان.
    pause
    exit /b
)

echo.
echo 2. پشکنینی ئامرازەکانی ئەندرۆید (Java / Gradle)...
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ------------------------------------------------------------
    echo [!] جاڤا (Java JDK) لەسەر ئەم کۆمپیوتەرە نەدۆزرایەوە.
    echo.
    echo بۆ دروستکردنی فایلی APK بە ئۆتۆماتیکی (بێ دابەزاندنی جاڤا):
    echo - پڕۆژەکە بنێرە بۆ سەر GitHub، فایلەکە بە خۆڕایی لە بەشی
    echo   Actions دروست دەبێت (.github/workflows/build-apk.yml).
    echo.
    echo یان دەتوانیت پڕۆژەی android/ لەناو بەرنامەی Android Studio
    echo بکەیتەوە و کلیک لە "Build -> Build APK" بکەیت.
    echo ------------------------------------------------------------
    echo.
    pause
    exit /b
)

echo جاڤا ئامادەیە! دەستپێکردنی کۆمپایلکردنی APK...
cd android
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo [✓] فایلی APK بە سەرکەوتوویی دروستکرا!
    echo شوێن: android\app\build\outputs\apk\debug\app-debug.apk
    echo ============================================================
) else (
    echo.
    echo [!] کێشەیەک ڕوویدا لە کاتی دروستکردنی APK.
)
cd ..
pause
