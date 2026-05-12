/**
 * Map Manager Module
 * Handles interactions with the interactive map and POI hotspots.
 */

const MapManager = {
    init() {
        console.log('MapManager initialized');
        this.setupHotspots();
        this.revealIcons();
    },
    
    setupHotspots() {
        const hotspots = document.querySelectorAll('.hotspot');
        hotspots.forEach(hotspot => {
            const handleAction = (e) => {
                e.stopPropagation();
                if (e.isPrimary) {
                    const poiId = hotspot.getAttribute('data-poi');
                    this.onPOISelected(poiId);
                }
            };
            
            hotspot.addEventListener('pointerdown', handleAction);
        });
    },

    revealIcons() {
        const hotspots = Array.from(document.querySelectorAll('.hotspot'));
        
        // Reset visibility
        hotspots.forEach(h => {
            h.style.opacity = '0';
            h.style.transform = 'translate(-50%, calc(-50% + 20px)) scale(0.8)';
            h.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });

        // Sort by 'top' percentage (bottom to top = higher percentage to lower)
        hotspots.sort((a, b) => {
            const topA = parseFloat(a.style.top);
            const topB = parseFloat(b.style.top);
            return topB - topA;
        });

        // Gradually reveal
        hotspots.forEach((h, index) => {
            setTimeout(() => {
                h.style.opacity = '1';
                h.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 200 * index);
        });
    },
    
    onPOISelected(poiId) {
        console.log(`POI Selected: ${poiId}`);
        KioskState.transitionTo(KioskState.VIDEO, { poiId: poiId });
    }
};

window.MapManager = MapManager;
