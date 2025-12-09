/**
 * Toolbar handles button clicks and toolbar interactions
 */
export class Toolbar {
    constructor(viewport) {
        this.viewport = viewport;
        this.init();
    }

    init() {
        // Get buttons
        const btnAdd = document.getElementById('btn-add');
        const btnDelete = document.getElementById('btn-delete');
        const btnReset = document.getElementById('btn-reset');

        // Add button - just shows alert for now
        btnAdd.addEventListener('click', () => {
            alert('Add button clicked!');
        });

        // Delete button - just shows alert for now
        btnDelete.addEventListener('click', () => {
            alert('Delete button clicked!');
        });

        // Reset button - resets the view to center
        btnReset.addEventListener('click', () => {
            this.viewport.scale = 1;
            this.viewport.pointX = window.innerWidth / 2;
            this.viewport.pointY = window.innerHeight / 2;
            this.viewport.setTransform();
        });
    }
}
