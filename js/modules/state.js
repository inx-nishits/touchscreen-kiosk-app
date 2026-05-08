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
        
        // Use direct cross-fade for Map to ensure seamless feel, use overlay for others
        if (newState === this.MAP) {
            console.log(`[Kiosk] Seamless cross-fade to: ${newState}`);
            
            newScreen.classList.add('active');
            this.currentState = newState;
            this.handleEntry(newState, data);
            
            setTimeout(() => {
                if (oldScreen) oldScreen.classList.remove('active');
                this.handleExit(oldState);
            }, 1000); // Match CSS transition duration
        } else {
            if (overlay) overlay.classList.add('active');
            
            setTimeout(() => {
                if (oldScreen) oldScreen.classList.remove('active');
                newScreen.classList.add('active');
                
                console.log(`[Kiosk] Switched to: ${newState}`);
                this.currentState = newState;
                this.handleEntry(newState, data);
                
                setTimeout(() => {
                    if (overlay) overlay.classList.remove('active');
                }, 100);
            }, 400);
        }
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
