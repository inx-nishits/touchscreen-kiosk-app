# 4K Touchscreen Kiosk: Technical Setup & Operations Guide

This document provides a comprehensive guide for setting up and maintaining the **Bulgarian Heritage 4K Kiosk Application**. Follow these instructions to ensure the application runs smoothly, securely, and without interruption in a public exhibition environment.

---

## 1. Hardware & System Requirements

For a professional, high-performance experience, the kiosk PC must meet these minimum specifications:

*   **Operating System:** Windows 10 or 11 (Pro version recommended for easier management).
*   **Storage:** **SSD (NVMe or SATA)** is strictly required. Running the app from a slow HDD or USB drive will cause video stuttering.
*   **Monitor:** 4K Touchscreen (3840 x 2160).
*   **Display Settings:** Windows Scaling must be set to **100%**. 
    *   *Settings > System > Display > Scale and layout > 100%*
*   **Network:** Not required. The application runs **100% offline**.

---

## 2. Initial Installation & Directory Setup

The kiosk application runs as a "Portable" app and does not require a traditional installer.

1.  Copy the folder **`Touchscreen-kiosk-app`** to the internal drive of the kiosk PC.
2.  **Recommended Path:** `C:\KioskApp\`
3.  Ensure the folder contains:
    *   `index.html` (The main application file)
    *   `assets/videos/` (All 4K video content)
    *   `start-kiosk.bat` (The startup script)
    *   `force-close-kiosk.bat` (The emergency exit script)

---

## 3. Launching in Production Mode

To ensure the app is locked down and the browser "Exit" or "ESC" messages are suppressed, you **must** use the provided startup script.

### Launch Instructions:
1.  Navigate to `C:\KioskApp\`.
2.  Double-click **`start-kiosk.bat`**.
3.  Wait 5 seconds. Google Chrome will launch in a dedicated "Kiosk Mode" with all toolbars, tabs, and Windows menus hidden.

### What this script does:
*   **Full Lockdown:** Hides all browser UI and prevents users from "swiping back."
*   **Autoplay Enforcement:** Bypasses browser security to allow videos to play instantly without a user touch.
*   **Local Access:** Allows the browser to read the local 4K video files from your hard drive safely.
*   **Isolated Profile:** Uses a dedicated temporary profile so it won't interfere with any other Chrome windows.

---

## 4. Video Playback Behavior

The application has been specifically tuned for museum-style viewing:

*   **Full Viewing:** Once a video starts, the "Auto-Reset" timer is paused. The video will play to the very end without interruption, even if it is very long.
*   **Manual Interrupt:** If a visitor touches the screen *while* a video is playing, the app will instantly return to the 8-POI Map screen.
*   **Auto-Reset:** If the kiosk is left idle on the Map screen for **120 seconds**, it will automatically transition back to the "Attract Video" (Idle Screen) for the next visitor.

---

## 5. Maintenance & Content Updates

### Updating Videos:
To replace a video, simply name your new file exactly like the existing one in `assets/videos/` and overwrite it.
*   **Recommended Format:** MP4 (H.264)
*   **Recommended Bitrate:** 25-30 Mbps for 4K.
*   **Optimization:** For fastest loading, ensure your MP4 is exported with the **"Fast Start"** or **"Moov Atom at Start"** option enabled.

### Closing the App:
Since there is no "X" button, you must use a keyboard:
1.  Connect a USB keyboard.
2.  Press **`Alt + F4`** to close the browser.
3.  Alternatively, run the **`force-close-kiosk.bat`** file from the folder.

---

## 6. Windows OS Lockdown (Highly Recommended)

To prevent Windows from interfering with the exhibition:

1.  **Disable Sleep:** Go to *Power & Sleep* settings and set both Screen and Sleep to **Never**.
2.  **Disable Notifications:** Enable "Focus Assist" in the Windows Action Center and set it to "Alarms Only."
3.  **Disable Updates:** Pause Windows Updates or set an "Active Hours" window that is outside of exhibition hours.
4.  **Hide Taskbar:** Although Kiosk Mode hides the taskbar, we recommend setting it to "Automatically hide the taskbar in desktop mode" for extra safety.
5.  **Auto-Start on Boot:**
    *   Press `Win + R`, type `shell:startup`, and press Enter.
    *   Create a **Shortcut** to `start-kiosk.bat` and drag it into that folder.
    *   The kiosk will now launch automatically whenever the computer is turned on.

---

## Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **"Press ESC to exit" message appears** | This happens if you used `F11` or clicked a button to go fullscreen. Always use the `start-kiosk.bat` to avoid this browser message. |
| **Video stutters or drops frames** | Ensure the files are on an **SSD** and the computer's **Hardware Acceleration** is turned on in Chrome settings. |
| **The screen is cut off** | Ensure Windows Display Scale is at **100%**. If it's at 150% or 300%, the 4K layout will be too large. |
| **Video doesn't play on first load** | The `start-kiosk.bat` includes a 5-second wait to let the Windows Audio service start first. If audio isn't ready, the video might pause. |
