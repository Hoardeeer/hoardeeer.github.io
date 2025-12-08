/**
 * MouseHandler manages mouse events for desktop interaction
 */
export class MouseHandler {
    constructor(viewport, viewportElement) {
        this.viewport = viewport;
        this.viewportElement = viewportElement;
        this.init();
    }

    init() {
        // Wheel zoom
        this.viewportElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomIn = -e.deltaY > 0;
            this.viewport.zoomAt(e.clientX, e.clientY, zoomIn);
        }, { passive: false });

        // Pan with mouse drag
        this.viewportElement.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.viewport.startPan(e.clientX, e.clientY);
        });

        this.viewportElement.addEventListener('mouseup', () => {
            this.viewport.stopPan();
        });

        this.viewportElement.addEventListener('mouseleave', () => {
            this.viewport.stopPan();
        });

        this.viewportElement.addEventListener('mousemove', (e) => {
            e.preventDefault();
            this.viewport.updatePan(e.clientX, e.clientY);
        });

        // Disable context menu
        this.viewportElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
}
