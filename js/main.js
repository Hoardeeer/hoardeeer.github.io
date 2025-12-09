/**
 * Main entry point - Initialize the application
 */
import { Viewport } from './viewport.js';
import { MouseHandler } from './mouseHandler.js';
import { TouchHandler } from './touchHandler.js';
import { Toolbar } from './toolbar.js';
import { ImageManager } from './imageManager.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const viewportElement = document.getElementById('viewport');
    const worldElement = document.getElementById('world');

    // Create viewport manager
    const viewport = new Viewport(viewportElement, worldElement);

    // Create image manager
    const imageManager = new ImageManager(viewport, worldElement);

    // Setup input handlers
    new MouseHandler(viewport, viewportElement);
    new TouchHandler(viewport, viewportElement);

    // Setup toolbar
    new Toolbar(viewport, imageManager);

    console.log('Canvas initialized successfully');
});
