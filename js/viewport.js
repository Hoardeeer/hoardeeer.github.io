/**
 * Viewport class manages the pan and zoom state of the canvas
 */
export class Viewport {
    constructor(viewportElement, worldElement) {
        this.viewport = viewportElement;
        this.world = worldElement;
        
        // State
        this.scale = 1;
        this.pointX = window.innerWidth / 2;
        this.pointY = window.innerHeight / 2;
        this.panning = false;
        
        // Apply initial transform
        this.setTransform();
    }

    /**
     * Apply the current transform to the world element
     */
    setTransform() {
        this.world.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
    }

    /**
     * Zoom at a specific point
     */
    zoomAt(clientX, clientY, zoomIn) {
        const xs = (clientX - this.pointX) / this.scale;
        const ys = (clientY - this.pointY) / this.scale;

        const factor = 1.1;
        if (zoomIn) {
            this.scale *= factor;
        } else {
            this.scale /= factor;
        }

        // Optional: Cap zoom levels
        // if (this.scale > 10) this.scale = 10;
        // if (this.scale < 0.1) this.scale = 0.1;

        this.pointX = clientX - xs * this.scale;
        this.pointY = clientY - ys * this.scale;

        this.setTransform();
    }

    /**
     * Start panning from a point
     */
    startPan(clientX, clientY) {
        this.startX = clientX - this.pointX;
        this.startY = clientY - this.pointY;
        this.panning = true;
    }

    /**
     * Update pan position
     */
    updatePan(clientX, clientY) {
        if (!this.panning) return;
        
        this.pointX = clientX - this.startX;
        this.pointY = clientY - this.startY;
        
        this.setTransform();
    }

    /**
     * Stop panning
     */
    stopPan() {
        this.panning = false;
    }

    /**
     * Check if currently panning
     */
    isPanning() {
        return this.panning;
    }
}
