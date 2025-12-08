/**
 * Main entry point - Initialize the application
 */
import { Viewport } from './viewport.js';
import { MouseHandler } from './mouseHandler.js';
import { TouchHandler } from './touchHandler.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const viewportElement = document.getElementById('viewport');
    const worldElement = document.getElementById('world');

    // Create viewport manager
    const viewport = new Viewport(viewportElement, worldElement);

    // Setup input handlers
    new MouseHandler(viewport, viewportElement);
    new TouchHandler(viewport, viewportElement);

    console.log('Canvas initialized successfully');
});
