/**
 * TouchHandler manages touch events for mobile/tablet interaction
 */
export class TouchHandler {
    constructor(viewport, viewportElement) {
        this.viewport = viewport;
        this.viewportElement = viewportElement;
        this.lastTouchDistance = 0;
        this.initialPinchScale = 1;
        this.lastTouchCenter = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.viewportElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1) {
                // Single touch - panning
                this.viewport.startPan(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2) {
                // Two finger touch - prepare for pinch zoom + pan
                this.viewport.stopPan();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                
                // Store initial distance for zoom
                this.lastTouchDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                this.initialPinchScale = this.viewport.scale;
                
                // Store initial center point for panning
                this.lastTouchCenter = {
                    x: (touch1.clientX + touch2.clientX) / 2,
                    y: (touch1.clientY + touch2.clientY) / 2
                };
            }
        }, { passive: false });

        this.viewportElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1 && this.viewport.isPanning()) {
                // Single touch - pan
                this.viewport.updatePan(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2) {
                // Two finger pinch zoom + pan
                this.handlePinchZoom(e.touches[0], e.touches[1]);
            }
        }, { passive: false });

        this.viewportElement.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                this.viewport.stopPan();
            } else if (e.touches.length === 1) {
                // Transition from pinch to pan
                this.viewport.startPan(e.touches[0].clientX, e.touches[0].clientY);
            }
        });

        this.viewportElement.addEventListener('touchcancel', () => {
            this.viewport.stopPan();
        });
    }

    /**
     * Handle pinch zoom with simultaneous panning
     */
    handlePinchZoom(touch1, touch2) {
        // Calculate current center point between fingers
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        // Calculate current distance between fingers
        const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
        
        // Calculate zoom point in world coordinates (before zoom)
        const xs = (this.lastTouchCenter.x - this.viewport.pointX) / this.viewport.scale;
        const ys = (this.lastTouchCenter.y - this.viewport.pointY) / this.viewport.scale;
        
        // Update scale based on pinch distance change
        this.viewport.scale = this.initialPinchScale * (currentDistance / this.lastTouchDistance);
        
        // Apply zoom transformation
        this.viewport.pointX = this.lastTouchCenter.x - xs * this.viewport.scale;
        this.viewport.pointY = this.lastTouchCenter.y - ys * this.viewport.scale;
        
        // Apply pan based on center point movement
        const deltaX = centerX - this.lastTouchCenter.x;
        const deltaY = centerY - this.lastTouchCenter.y;
        this.viewport.pointX += deltaX;
        this.viewport.pointY += deltaY;
        
        // Update last center for continuous panning
        this.lastTouchCenter = { x: centerX, y: centerY };
        
        this.viewport.setTransform();
    }
}
