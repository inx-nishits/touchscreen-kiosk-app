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
            const btnHome = document.getElementById('btn-video-home');
            if (btnHome) {
                btnHome.addEventListener('touchstart', (e) => {
                    e.stopPropagation();
                    KioskState.transitionTo(KioskState.IDLE);
                });
                btnHome.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    KioskState.transitionTo(KioskState.IDLE);
                });
            }

            // Back to Map Button
            const btnBack = document.getElementById('btn-video-back');
            if (btnBack) {
                btnBack.addEventListener('touchstart', (e) => {
                    e.stopPropagation();
                    KioskState.transitionTo(KioskState.MAP);
                });
                btnBack.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    KioskState.transitionTo(KioskState.MAP);
                });
            }
            
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
        return new Promise((resolve) => {
            console.log(`[Kiosk] Playing POI: ${poiId}`);
            this.activePOI = poiId;
            
            // Map POI IDs to specific filenames
            const videoMap = {
                'holy-forty-martyrs': 'assets/videos/holy-forty-martyrs.mp4',
                'chilandar': 'assets/videos/chilandar.mp4',
                'hagia-sophia': 'assets/videos/hagia-sophia.mp4',
                'hagios-demetrios': 'assets/videos/hagios-demetrios.mp4',
                'church-holy-sepulchre': 'assets/videos/church-holy-sepulchre.mp4',
                'mar-saba': 'assets/videos/mar-saba.mp4',
                'trip': 'assets/videos/trip.mp4',
                'mytobahe': 'assets/videos/mytobahe.mp4'
            };

            const videoSrc = videoMap[poiId] || `assets/videos/${poiId}.mp4`;
            
            // Set up one-time playing listener
            const onPlaying = () => {
                this.player.removeEventListener('playing', onPlaying);
                resolve();
            };
            this.player.addEventListener('playing', onPlaying);
            
            this.player.pause();
            this.player.src = videoSrc;
            this.player.load(); // Force immediate load
            
            const playPromise = this.player.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("[Kiosk] Auto-play retry...", error);
                    this.player.play();
                });
            }

            // Fallback for missing videos: resolve after a short delay so transition isn't blocked
            setTimeout(resolve, 2000); 
        });
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
