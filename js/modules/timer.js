/**
 * Inactivity Timer Module
 * Monitors user interaction and resets the kiosk to IDLE state after a timeout.
 */

const InactivityTimer = {
    timeoutDuration: 120, // seconds
    timeLeft: 120,
    interval: null,
    displayElement: null,
    
    init() {
        this.displayElement = document.getElementById('inactivity-timer');
        this.setupListeners();
    },
    
    setupListeners() {
        // Global interaction listener - using capture phase to ensure we catch all events
        const resetAction = () => this.reset();
        
        window.addEventListener('touchstart', resetAction, true);
        window.addEventListener('mousedown', resetAction, true);
        window.addEventListener('kiosk-interaction', resetAction, true);
    },
    
    start() {
        this.reset();
        if (this.interval) clearInterval(this.interval);
        
        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.onTimeout();
            }
        }, 1000);
    },
    
    stop() {
        if (this.interval) clearInterval(this.interval);
        this.timeLeft = this.timeoutDuration;
        this.updateDisplay();
    },
    
    reset() {
        this.timeLeft = this.timeoutDuration;
        this.updateDisplay();
    },
    
    updateDisplay() {
        if (this.displayElement) {
            this.displayElement.textContent = this.timeLeft;
        }
    },
    
    onTimeout() {
        this.stop();
        console.warn('Session Timed Out');
        
        // Show session ended modal
        const modal = document.getElementById('session-ended');
        if (modal) {
            modal.classList.add('active');
            
            setTimeout(() => {
                modal.classList.remove('active');
                KioskState.transitionTo(KioskState.IDLE);
            }, 3000);
        } else {
            KioskState.transitionTo(KioskState.IDLE);
        }
    }
};

window.InactivityTimer = InactivityTimer;
