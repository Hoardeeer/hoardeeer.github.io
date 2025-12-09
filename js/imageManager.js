/**
 * ImageManager handles adding and dragging images in the world
 */
export class ImageManager {
    constructor(viewport, worldElement) {
        this.viewport = viewport;
        this.world = worldElement;
        this.images = [];
        this.draggingImage = null;
        this.dragOffset = { x: 0, y: 0 };
    }

    /**
     * Add an image to the world at specific coordinates
     */
    addImage(imageUrl, worldX = 0, worldY = 0) {
        // Create image container
        const imageDiv = document.createElement('div');
        imageDiv.className = 'world-image';
        imageDiv.style.left = worldX + 'px';
        imageDiv.style.top = worldY + 'px';

        // Create img element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'World Image';
        
        // Handle image load error
        img.onerror = () => {
            alert('Failed to load image. Please check the URL.');
            imageDiv.remove();
        };

        imageDiv.appendChild(img);
        this.world.appendChild(imageDiv);

        // Setup drag functionality
        this.setupImageDrag(imageDiv);

        // Store reference
        this.images.push({
            element: imageDiv,
            x: worldX,
            y: worldY
        });

        return imageDiv;
    }

    /**
     * Setup drag functionality for an image
     */
    setupImageDrag(imageDiv) {
        imageDiv.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Prevent viewport panning
            this.startDrag(imageDiv, e.clientX, e.clientY);
        });

        imageDiv.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            const touch = e.touches[0];
            this.startDrag(imageDiv, touch.clientX, touch.clientY);
        }, { passive: false });
    }

    /**
     * Start dragging an image
     */
    startDrag(imageDiv, clientX, clientY) {
        this.draggingImage = imageDiv;
        imageDiv.classList.add('dragging');

        // Get current position in world coordinates
        const rect = imageDiv.getBoundingClientRect();
        const worldRect = this.world.getBoundingClientRect();
        
        // Calculate offset from mouse to image top-left in screen space
        this.dragOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };

        // Setup move and end listeners
        const onMove = (e) => this.onDragMove(e);
        const onEnd = () => this.endDrag(onMove, onTouchMove, onTouchEnd);
        const onTouchMove = (e) => this.onTouchDragMove(e);
        const onTouchEnd = () => this.endDrag(onMove, onTouchMove, onTouchEnd);

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);

        // Store handlers for cleanup
        this.dragHandlers = { onMove, onEnd, onTouchMove, onTouchEnd };
    }

    /**
     * Handle mouse drag movement
     */
    onDragMove(e) {
        if (!this.draggingImage) return;
        this.updateImagePosition(e.clientX, e.clientY);
    }

    /**
     * Handle touch drag movement
     */
    onTouchDragMove(e) {
        if (!this.draggingImage) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.updateImagePosition(touch.clientX, touch.clientY);
    }

    /**
     * Update image position during drag
     */
    updateImagePosition(clientX, clientY) {
        // Convert screen coordinates to world coordinates
        const worldX = (clientX - this.dragOffset.x - this.viewport.pointX) / this.viewport.scale;
        const worldY = (clientY - this.dragOffset.y - this.viewport.pointY) / this.viewport.scale;

        // Update image position
        this.draggingImage.style.left = worldX + 'px';
        this.draggingImage.style.top = worldY + 'px';
    }

    /**
     * End dragging
     */
    endDrag(onMove, onTouchMove, onTouchEnd) {
        if (!this.draggingImage) return;

        this.draggingImage.classList.remove('dragging');
        this.draggingImage = null;

        // Remove event listeners
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', this.dragHandlers.onEnd);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    }

    /**
     * Remove all images
     */
    clearImages() {
        this.images.forEach(img => img.element.remove());
        this.images = [];
    }
}
