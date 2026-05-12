# Touchscreen Kiosk: Setup & Operations Guide

This guide provides step-by-step instructions for the on-site exhibition technical team to properly set up, launch, and secure the interactive 4K touchscreen kiosk application.

---

## 1. System Requirements

*   **Operating System:** Windows 10 or Windows 11
*   **Browser:** Google Chrome (Latest Version)
*   **Hardware:** Touchscreen display supporting 4K resolution (3840 x 2160)
*   **Network:** No internet connection required. The application runs 100% offline.

---

## 2. Initial Installation

The kiosk application requires no formal "installation" (no `.exe` to install). It runs directly from the provided folder.

1.  Copy the entire **`Touchscreen-kiosk-app`** folder from the delivery USB drive.
2.  Paste the folder onto the kiosk PC's internal storage (We recommend placing it in `C:\KioskApp\`).
3.  Ensure the folder contains all files, including `index.html`, the `assets/` folder, and the `.bat` scripts.

---

## 3. Launching the Kiosk Application

To ensure the application runs perfectly fullscreen and cannot be closed or broken by public visitors, you **must** use the provided startup script. 

**Do NOT double-click the `index.html` file directly.**

### How to Start:
1. Navigate to the folder where you copied the application (e.g., `C:\KioskApp\`).
2. Double-click the file named **`start-kiosk.bat`**.
3. A black command prompt window will briefly appear, wait 5 seconds, and then Google Chrome will launch in an aggressive, locked-down fullscreen mode.

### What the Startup Script Does:
*   Forces absolute fullscreen (hides the URL bar, tabs, and Windows taskbar).
*   Disables pinch-to-zoom touch gestures.
*   Disables edge-swipe browser navigation (preventing visitors from swiping "back" to a blank page).
*   Runs in incognito mode to ensure a fresh session upon every launch.

---

## 4. How to Exit Kiosk Mode (Maintenance)

Because the application is locked down, there are no "X" buttons to close the window. To perform maintenance or update the PC:

1. Plug a physical USB keyboard into the kiosk machine.
2. Press **`Alt + F4`** (or **`Ctrl + W`**) on the keyboard to instantly close the browser.
3. Alternatively, you can press the **`Windows Key`** to bring up the start menu.
4. If you need to force close it manually, double-click the included **`force-close-kiosk.bat`** file from the folder.

---

## 5. Setting up "Auto-Start" on PC Boot (Highly Recommended)

For an exhibition environment, the application should automatically launch if the PC reboots or loses power.

1.  Press `Windows Key + R` on the keyboard to open the "Run" dialog.
2.  Type **`shell:startup`** and press Enter. This opens the Windows Startup folder.
3.  Navigate back to your kiosk folder (`C:\KioskApp\`).
4.  **Right-click** on `start-kiosk.bat` and select **"Create Shortcut"**.
5.  Drag and drop that newly created shortcut into the `shell:startup` folder you opened in Step 2.
6.  *Test it:* Restart the PC. Windows will boot, load the desktop, and within 10 seconds, the kiosk will automatically launch fullscreen.

---

## 6. Windows OS Lockdown Recommendations

To prevent visitors from accidentally disrupting the kiosk, please apply the following Windows settings:

*   **Disable Notifications:** Go to Windows Settings > System > Focus Assist and turn it to "Alarms Only" to prevent pop-up notifications.
*   **Disable Screen Sleep:** Go to Power Options and set "Turn off display" and "Put the computer to sleep" to **Never**.
*   **Disable Edge Swipes:** If users accidentally open the Windows notification panel by swiping from the extreme right edge of the monitor, disable edge gestures via the Windows Registry or Group Policy.

---

## Troubleshooting

*   **Videos are black or not playing:** Ensure you launched the app via `start-kiosk.bat`. Browsers block auto-playing video if launched normally.
*   **The screen looks zoomed in or cut off:** Ensure your Windows Display Scaling (Settings > Display > Scale and layout) is set to **100%**. Do not use 150% or 300% scaling.
*   **Updating Content:** To update a video, simply replace the corresponding `.mp4` file in the `assets/videos/` folder. Keep the file name exactly the same. No code updates are required.
