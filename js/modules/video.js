/**
 * Video Engine Module
 * Manages POI video playback and preloading for zero-latency experience.
 */

const VideoEngine = {
    player: null,
    progressBar: null,
    activePOI: null,
    
    init() {
        this.player = document.getElementById('poi-video-player');
        this.progressBar = document.getElementById('video-progress');
        
        if (this.player) {
            this.player.addEventListener('timeupdate', () => this.updateProgress());
            this.player.addEventListener('ended', () => this.onVideoEnded());
            
            // Return to map on tap
            this.player.parentElement.addEventListener('touchstart', (e) => {
                KioskState.transitionTo(KioskState.MAP);
            });
            this.player.parentElement.addEventListener('mousedown', (e) => {
                KioskState.transitionTo(KioskState.MAP);
            });
        }
    },
    
    playPOI(poiId) {
        console.log(`[Kiosk] Playing POI: ${poiId}`);
        this.activePOI = poiId;
        
        const videoSrc = `assets/videos/poi-${poiId}.mp4`;
        
        // Fast Playback Strategy: Reset and Load
        this.player.pause();
        this.player.currentTime = 0;
        this.player.src = videoSrc;
        
        // Use a promise to ensure play starts as soon as data is ready
        const playPromise = this.player.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("[Kiosk] Video playing instantly.");
            }).catch(error => {
                console.warn("[Kiosk] Auto-play retry...", error);
                this.player.play();
            });
        }
    },
    
    stop() {
        if (this.player) {
            this.player.pause();
            this.player.src = "";
        }
    },
    
    updateProgress() {
        if (this.player && this.progressBar) {
            const progress = (this.player.currentTime / this.player.duration) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    },
    
    onVideoEnded() {
        KioskState.transitionTo(KioskState.MAP);
    },
    
    mockPlayback() {
        console.log("Mocking video playback for dev...");
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            if (this.progressBar) this.progressBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                this.onVideoEnded();
            }
            if (KioskState.currentState !== KioskState.VIDEO) {
                clearInterval(interval);
            }
        }, 100);
    }
};

window.VideoEngine = VideoEngine;
