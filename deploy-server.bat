@echo off
title Yalla Arabi - Deploy Updates to Live Server
chcp 65001 >nul
cls

echo ============================================================
echo   🌴 یەڵڵا عەرەبی | ناردنی نوێکارییەکان بۆ سێرڤەری سەرەکی
echo ============================================================
echo.

echo 1. هاوکاتکردنی فایلەکان بۆ وەشانی ئەندرۆید...
node sync-assets.js

echo.
echo 2. دڵنیابوونەوە لە گۆڕانکارییەکان...
echo.
echo ئایا دەتەوێت چۆن ئەپەکە نوێ بکەیتەوە؟
echo [1] کارپێکردنی سێرڤەری لۆکاڵی (Wi-Fi) بۆ تاقیکردنەوەی خێرا
echo [2] ناردن بۆ Firebase Hosting (ئەگەر کۆنت پێکەوە بەستبێت)
echo [3] چوونەدەرەوە
echo.

set /p choice="ژمارەیەک هەڵبژێرە (1-3): "

if "%choice%"=="1" (
    echo.
    echo کارپێکردنی سێرڤەری لۆکاڵ...
    call run-on-phone.bat
)

if "%choice%"=="2" (
    echo.
    echo ناردن بۆ Firebase Hosting...
    npx -y firebase-tools deploy --only hosting
    pause
)

if "%choice%"=="3" (
    exit
)
