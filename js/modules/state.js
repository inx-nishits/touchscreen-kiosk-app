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
    
    async transitionTo(newState, data = {}) {
        console.log(`[Kiosk] Transitioning to: ${newState}`);
        
        const oldScreen = document.querySelector('.screen.active');
        const newScreen = document.getElementById(`screen-${newState}`);
        
        if (!newScreen) {
            console.error(`[Kiosk] Screen NOT found: screen-${newState}`);
            return;
        }
        
        this.handleExit(this.currentState);
        
        // If we're going to video, pre-start the player to avoid black flash
        if (newState === this.VIDEO && data.poiId) {
            await VideoEngine.playPOI(data.poiId);
        }

        // Pure Seamless Cross-fade: Add active to new, remove from old after transition
        newScreen.classList.add('active');
        const oldState = this.currentState;
        this.currentState = newState;
        
        // Handle entry logic (excluding video play which we handled above)
        if (newState !== this.VIDEO) {
            this.handleEntry(newState, data);
        } else {
            // Video is already playing, just start inactivity timer
            InactivityTimer.start();
            window.dispatchEvent(new CustomEvent('kiosk-interaction'));
        }
        
        setTimeout(() => {
            if (oldScreen && oldScreen !== newScreen) {
                oldScreen.classList.remove('active');
            }
        }, 1000); // Wait for the 1s CSS transition defined in main.css to complete
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
                break;
                
            case this.MAP:
                MapManager.revealIcons();
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
