/**
 * Toolbar handles button clicks and toolbar interactions
 */
export class Toolbar {
            constructor(viewport, imageManager) {
                this.viewport = viewport;
                this.imageManager = imageManager;
                this.init();
            }

            init() {
                const btnAddImage = document.getElementById('btn-add');
                const btnDelete = document.getElementById('btn-delete');
                const btnReset = document.getElementById('btn-reset');
                const modal = document.getElementById('image-modal');
                const imageUrlInput = document.getElementById('image-url-input');
                const btnModalCancel = document.getElementById('btn-modal-cancel');
                const btnModalConfirm = document.getElementById('btn-modal-confirm');

                btnAddImage.addEventListener('click', () => {
                    modal.classList.add('active');
                    imageUrlInput.value = '';
                    imageUrlInput.focus();
                });

                btnModalCancel.addEventListener('click', () => {
                    modal.classList.remove('active');
                });

                btnModalConfirm.addEventListener('click', () => {
                    const url = imageUrlInput.value.trim();
                    if (url) {
                        const centerX = (window.innerWidth / 2 - this.viewport.pointX) / this.viewport.scale;
                        const centerY = (window.innerHeight / 2 - this.viewport.pointY) / this.viewport.scale;
                        this.imageManager.addImage(url, centerX - 100, centerY - 100);
                        modal.classList.remove('active');
                    }
                });

                imageUrlInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        btnModalConfirm.click();
                    }
                });

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                    }
                });

                btnDelete.addEventListener('click', () => {
                    alert('Delete functionality coming soon!');
                });

                btnReset.addEventListener('click', () => {
                    this.viewport.scale = 1;
                    this.viewport.pointX = window.innerWidth / 2;
                    this.viewport.pointY = window.innerHeight / 2;
                    this.viewport.setTransform();
                });
            }
        }
