/**
 * Asset Loader Utility
 * Handles preloading of images and videos to ensure zero-latency.
 */

const AssetLoader = {
    assets: {
        images: [
            'assets/images/map-base.png'
        ],
        videos: [
            'assets/videos/attract.mp4',
            'assets/videos/poi-1.mp4',
            'assets/videos/poi-2.mp4',
            'assets/videos/poi-3.mp4',
            'assets/videos/poi-4.mp4',
            'assets/videos/poi-5.mp4',
            'assets/videos/poi-6.mp4',
            'assets/videos/poi-7.mp4',
            'assets/videos/poi-8.mp4'
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
