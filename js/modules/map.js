/**
 * Map Manager Module
 * Handles interactions with the interactive map and POI hotspots.
 */

const MapManager = {
    init() {
        console.log('MapManager initialized');
        this.setupHotspots();
    },
    
    setupHotspots() {
        const hotspots = document.querySelectorAll('.hotspot');
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                const poiId = hotspot.getAttribute('data-poi');
                this.onPOISelected(poiId);
            });
            
            hotspot.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                const poiId = hotspot.getAttribute('data-poi');
                this.onPOISelected(poiId);
            });
        });
    },
    
    onPOISelected(poiId) {
        console.log(`POI Selected: ${poiId}`);
        KioskState.transitionTo(KioskState.VIDEO, { poiId: poiId });
    }
};

window.MapManager = MapManager;
