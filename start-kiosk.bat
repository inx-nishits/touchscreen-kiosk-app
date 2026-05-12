@echo off
echo Starting Kiosk Application...
:: Wait 5 seconds to ensure Windows graphics and audio services are fully loaded
timeout /t 5 /nobreak >nul

:: Dynamically get the exact path to where the index.html is located
set "APP_DIR=%~dp0"
set "INDEX_PATH=%APP_DIR%index.html"

:: Convert Windows backslashes to forward slashes for the browser URI
set "INDEX_PATH=%INDEX_PATH:\=/%"

:: Launch Google Chrome in heavily locked-down Kiosk Mode
:: We add --allow-file-access-from-files so local JavaScript can read local files without CORS errors.
:: We specify a separate --user-data-dir so it always opens cleanly, even if you already have regular Chrome open.
start chrome.exe --kiosk --disable-pinch --overscroll-history-navigation=0 --disable-features=TranslateUI --no-first-run --autoplay-policy=no-user-gesture-required --allow-file-access-from-files --user-data-dir="%APP_DIR%chrome-kiosk-profile" "file:///%INDEX_PATH%"

exit
