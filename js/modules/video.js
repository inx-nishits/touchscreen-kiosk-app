/**
 * Video Engine Module
 * Manages POI video playback and preloading for zero-latency experience.
 */

const VideoEngine = {
    player: null,
    activePOI: null,
    
    init() {
        this.player = document.getElementById('poi-video-player');
        
        if (this.player) {
            this.player.addEventListener('ended', () => this.onVideoEnded());
            
            // Error Fallback: If POI video is missing, play intro video as placeholder
            this.player.addEventListener('error', () => {
                if (this.player.src && !this.player.src.includes('beginning-video.mp4')) {
                    console.warn(`[Kiosk] Video not found: ${this.player.src}. Playing fallback placeholder.`);
                    this.player.src = 'assets/videos/beginning-video.mp4';
                    this.player.play().catch(e => console.error("Fallback playback failed", e));
                }
            });
            
            // Home Button
            document.getElementById('btn-video-home').addEventListener('touchstart', (e) => {
                e.stopPropagation();
                KioskState.transitionTo(KioskState.IDLE);
            });
            document.getElementById('btn-video-home').addEventListener('mousedown', (e) => {
                e.stopPropagation();
                KioskState.transitionTo(KioskState.IDLE);
            });

            // Back to Map Button
            document.getElementById('btn-video-back').addEventListener('touchstart', (e) => {
                e.stopPropagation();
                KioskState.transitionTo(KioskState.MAP);
            });
            document.getElementById('btn-video-back').addEventListener('mousedown', (e) => {
                e.stopPropagation();
                KioskState.transitionTo(KioskState.MAP);
            });
            
            // Return to map on tap anywhere else (Touch & Click)
            const handleClose = (e) => {
                // Ignore if clicking on navigation buttons
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    KioskState.transitionTo(KioskState.MAP);
                }
            };
            
            this.player.parentElement.addEventListener('touchstart', handleClose);
            this.player.parentElement.addEventListener('mousedown', handleClose);
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
    
    onVideoEnded() {
        KioskState.transitionTo(KioskState.MAP);
    },
    
    mockPlayback() {
        console.log("Mocking video playback for dev...");
        setTimeout(() => {
            this.onVideoEnded();
        }, 5000);
    }
};

window.VideoEngine = VideoEngine;
