@echo off
echo Force Closing the Kiosk...
taskkill /IM chrome.exe /F
echo Kiosk Closed.
timeout /t 2 >nul
exit
