/**
 * Kiosk State Machine
 * Manages the transitions between different screens (Idle, Intro, Map, Video).
 */

const KioskState = {
    IDLE: 'idle',
    INTRO: 'intro',
    MAP: 'map',
    VIDEO: 'video',
    
    currentState: 'idle',
    
    init() {
        console.log('KioskState initialized');
        this.transitionTo(this.IDLE);
        
        // Unified interaction listener for Idle Screen
        const handleStart = (e) => {
            if (this.currentState === this.IDLE) {
                this.transitionTo(this.INTRO);
            }
        };

        const idleScreen = document.getElementById('screen-idle');
        idleScreen.addEventListener('touchstart', handleStart);
        idleScreen.addEventListener('mousedown', handleStart);
    },
    
    transitionTo(newState, data = {}) {
        console.log(`[Kiosk] Transitioning to: ${newState}`);
        
        const oldScreen = document.querySelector('.screen.active');
        const newScreen = document.getElementById(`screen-${newState}`);
        
        if (!newScreen) {
            console.error(`[Kiosk] Screen NOT found: screen-${newState}`);
            return;
        }
        
        this.handleExit(this.currentState);
        
        const overlay = document.getElementById('global-transition-overlay');
        if (overlay) overlay.classList.add('active');
        
        // Faster transition for snappier feel
        setTimeout(() => {
            if (oldScreen) oldScreen.classList.remove('active');
            newScreen.classList.add('active');
            
            console.log(`[Kiosk] Switched to: ${newState}`);
            this.currentState = newState;
            this.handleEntry(newState, data);
            
            setTimeout(() => {
                if (overlay) overlay.classList.remove('active');
            }, 300);
        }, 300);
    },
    
    handleEntry(state, data) {
        // Start timer for any screen that is not IDLE
        if (state !== this.IDLE) {
            InactivityTimer.start();
        }

        switch (state) {
            case this.IDLE:
                const video = document.getElementById('attract-video');
                if (video) video.play();
                InactivityTimer.stop();
                break;
                
            case this.INTRO:
                IntroAnimation.start();
                // Auto transition to MAP after intro animation
                setTimeout(() => {
                    this.transitionTo(this.MAP);
                }, 3000);
                break;
                
            case this.MAP:
                // Timer already started above
                break;
                
            case this.VIDEO:
                if (data.poiId) {
                    VideoEngine.playPOI(data.poiId);
                }
                // Timer already started above
                break;
        }
        
        // Reset timer on any interaction in active states
        if (state !== this.IDLE) {
            window.dispatchEvent(new CustomEvent('kiosk-interaction'));
        }
    },
    
    handleExit(state) {
        switch (state) {
            case this.IDLE:
                const video = document.getElementById('attract-video');
                if (video) video.pause();
                break;
            case this.VIDEO:
                VideoEngine.stop();
                break;
        }
    }
};

window.KioskState = KioskState;
