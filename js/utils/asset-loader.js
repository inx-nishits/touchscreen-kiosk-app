/**
 * Asset Loader Utility
 * Handles preloading of images and videos to ensure zero-latency.
 */

const AssetLoader = {
    assets: {
        images: [
            'assets/images/map-background.jpg',
            'assets/images/chilandar-icon.png',
            'assets/images/church-of-the-holy-sepulchre-icon.png',
            'assets/images/hagia-sophia-in-lznik-icon.png',
            'assets/images/hagios-demetrios-icon.png',
            'assets/images/holy-forty-martyrs-icon.png',
            'assets/images/mar-saba-icon.png',
            'assets/images/trip-icon.png',
            'assets/images/trip-mytobahe.png'
        ],
        videos: [
            'assets/videos/beginning-video.mp4',
            'assets/videos/idle-screen.mp4',
            'assets/videos/holy-forty-martyrs.mp4',
            'assets/videos/chilandar.mp4',
            'assets/videos/hagia-sophia.mp4',
            'assets/videos/hagios-demetrios.mp4',
            'assets/videos/church-holy-sepulchre.mp4',
            'assets/videos/mar-saba.mp4',
            'assets/videos/trip.mp4',
            'assets/videos/mytobahe.mp4'
        ]
    },
    
    preloadAll() {
        console.log('Preloading assets...');
        
        // Preload Images
        this.assets.images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        
        // Preload Videos (Selective preloading)
        // We don't want to load all videos into memory at once if they are large
        // But we can "warm up" the first few
        this.assets.videos.forEach(src => {
            const video = document.createElement('video');
            video.src = src;
            video.preload = 'auto';
            video.load();
        });
    }
};

window.AssetLoader = AssetLoader;
