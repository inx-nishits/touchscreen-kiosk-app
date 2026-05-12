/**
 * Main Application Entry Point
 * Orchestrates the initialization of all modules.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Premium Kiosk App Initializing...');
    
    // Initialize Modules
    AssetLoader.preloadAll();
    IntroAnimation.init();
    InactivityTimer.init();
    VideoEngine.init();
    MapManager.init();
    KioskState.init();

    // Ensure Attract Video starts playing and hides the preloader
    const attractVideo = document.getElementById('attract-video');
    const overlay = document.getElementById('global-transition-overlay');
    
    if (attractVideo) {
        // Pre-warm video
        attractVideo.addEventListener('canplaythrough', () => {
            console.log("Video ready, revealing app...");
            attractVideo.play().catch(() => {});
            setTimeout(() => {
                if (overlay) overlay.classList.remove('active');
                document.body.classList.add('ready');
            }, 500);
        }, { once: true });
        
        // Fallback for fast connections/cached video
        if (attractVideo.readyState >= 3) {
            attractVideo.play().catch(() => {});
            if (overlay) overlay.classList.remove('active');
            document.body.classList.add('ready');
        }
    } else {
        // Fallback if no video
        if (overlay) overlay.classList.remove('active');
        document.body.classList.add('ready');
    }
    
    // Global Interaction Fail-safe for Kiosk
    window.addEventListener('pointerdown', (e) => {
        // Only trigger ripple for primary contact to avoid multi-touch chaos
        if (e.isPrimary) {
            createRipple(e.clientX, e.clientY);
        }
        if (typeof KioskState !== 'undefined' && KioskState.currentState === KioskState.IDLE) {
            KioskState.transitionTo(KioskState.INTRO);
        }
    }, true);

    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }
    
    // Global Error Handling for Kiosk
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('Kiosk Error:', msg, 'at', url, ':', lineNo);
        return false;
    };
    
    // Prevent context menu (long press)
    window.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    // Kiosk Fullscreen Toggle (Triple tap top right)
    const kioskTools = document.getElementById('kiosk-tools');
    let tapCount = 0;
    let tapTimer = null;
    
    if (kioskTools) {
        kioskTools.addEventListener('click', () => {
            tapCount++;
            clearTimeout(tapTimer);
            tapTimer = setTimeout(() => { tapCount = 0; }, 500);
            
            if (tapCount >= 3) {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
                tapCount = 0;
            }
        });
    }

    // Performance: Pre-warm animations
    document.body.classList.add('ready');
});
