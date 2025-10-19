/**
 * Desktop 3D Interattivo
 * Desktop virtuale renderizzato su texture con cursore funzionante
 */

import * as THREE from 'three';

export class Desktop3D {
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = null;
        this.desktopCamera = null;
        
        // Render target per desktop
        this.renderTarget = null;
        this.desktopPlane = null;
        
        // Canvas per desktop UI
        this.canvas = null;
        this.ctx = null;
        
        // Cursore
        this.cursorPos = { x: 0.5, y: 0.5 }; // Normalizzato (0-1)
        this.isActive = false;
        
        this.init();
    }

    init() {
        // Dimensioni desktop (16:9 aspect ratio)
        const width = 1920;
        const height = 1080;

        // Canvas per disegnare desktop UI
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');

        // Render target per desktop
        this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });

        // Scena separata per desktop
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1e3a8a); // Blu professionale

        // Camera ortografica per desktop 2D
        this.desktopCamera = new THREE.OrthographicCamera(
            -width / 2, width / 2,
            height / 2, -height / 2,
            0.1, 1000
        );
        this.desktopCamera.position.z = 100;

        // Plane per visualizzare desktop nella scena principale
        const geometry = new THREE.PlaneGeometry(20, 11.25); // Aspect 16:9, MOLTO PIÙ GRANDE
        const material = new THREE.MeshBasicMaterial({
            map: this.renderTarget.texture,
            side: THREE.DoubleSide,
            toneMapped: false, // No tone mapping per colori accurati
            transparent: false,
            opacity: 1.0
        });
        this.desktopPlane = new THREE.Mesh(geometry, material);
        this.desktopPlane.renderOrder = 9999; // Renderizza sopra tutto
        
        console.log('🖥️ Desktop 3D inizializzato');
    }

    /**
     * Disegna desktop UI sul canvas
     */
    drawDesktop() {
        if (!this.ctx) return;

        const w = this.canvas.width;
        const h = this.canvas.height;

        // Sfondo blu professionale (stesso del monitor)
        this.ctx.fillStyle = '#1e3a8a';
        this.ctx.fillRect(0, 0, w, h);

        // Testo di debug (grande e visibile)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 120px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🖥️ DESKTOP 3D', w / 2, h / 2 - 100);
        
        this.ctx.font = 'bold 60px Arial';
        this.ctx.fillText('Desktop Interattivo', w / 2, h / 2 + 50);

        // Disegna cursore
        this.drawCursor();
    }

    /**
     * Disegna cursore
     */
    drawCursor() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Posizione cursore in pixel
        const x = this.cursorPos.x * w;
        const y = this.cursorPos.y * h;

        // Salva contesto
        this.ctx.save();

        // Ombra cursore (più grande)
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;

        // Corpo cursore (freccia bianca PIÙ GRANDE)
        const scale = 2.5; // Scala 2.5x più grande
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y + 20 * scale);
        this.ctx.lineTo(x + 6 * scale, y + 15 * scale);
        this.ctx.lineTo(x + 10 * scale, y + 24 * scale);
        this.ctx.lineTo(x + 13 * scale, y + 22 * scale);
        this.ctx.lineTo(x + 9 * scale, y + 13 * scale);
        this.ctx.lineTo(x + 15 * scale, y + 13 * scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Ripristina contesto
        this.ctx.restore();
    }

    /**
     * Aggiorna posizione cursore in base al mouse
     */
    onMouseMove(event) {
        if (!this.isActive) return;

        // Normalizza coordinate mouse (0-1)
        this.cursorPos.x = event.clientX / window.innerWidth;
        this.cursorPos.y = event.clientY / window.innerHeight;
    }

    /**
     * Renderizza desktop su texture
     */
    render() {
        if (!this.isActive) return;

        // Disegna desktop UI
        this.drawDesktop();

        // Crea texture da canvas e aggiorna
        const texture = new THREE.CanvasTexture(this.canvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Aggiorna material del plane
        if (this.desktopPlane && this.desktopPlane.material) {
            this.desktopPlane.material.map = texture;
            this.desktopPlane.material.needsUpdate = true;
        }
        
        // Debug: log ogni 60 frame
        if (!this.frameCount) this.frameCount = 0;
        this.frameCount++;
        if (this.frameCount % 60 === 0) {
            console.log('🎨 Desktop rendering... Frame:', this.frameCount);
        }
    }

    /**
     * Mostra desktop 3D nella scena principale
     */
    show(targetScene) {
        if (this.isActive) return;

        this.isActive = true;
        console.log('🖥️ Mostrando desktop 3D...');

        // Posiziona plane MOLTO VICINO alla camera
        const cameraPos = this.camera.position.clone();
        
        // Posiziona direttamente davanti alla camera, MOLTO vicino
        this.desktopPlane.position.set(
            cameraPos.x,
            cameraPos.y,
            cameraPos.z - 1  // 1 unità davanti (Z negativo)
        );
        
        // Ruota per guardare la camera
        this.desktopPlane.lookAt(cameraPos);
        
        console.log('📍 Desktop posizione:', this.desktopPlane.position);
        console.log('📹 Camera posizione:', cameraPos);
        console.log('📏 Distanza:', cameraPos.distanceTo(this.desktopPlane.position));

        // Aggiungi alla scena
        targetScene.add(this.desktopPlane);

        // Event listener per mouse
        this.mouseMoveHandler = (e) => this.onMouseMove(e);
        window.addEventListener('mousemove', this.mouseMoveHandler);

        // Nascondi cursore HTML
        const container = document.getElementById('canvas-container');
        if (container) {
            container.classList.add('desktop-mode');
        }

        console.log('✅ Desktop 3D attivo');
        
        // Force render iniziale
        this.render();
    }

    /**
     * Nascondi desktop 3D
     */
    hide(targetScene) {
        if (!this.isActive) return;

        this.isActive = false;
        console.log('🖥️ Nascondendo desktop 3D...');

        // Rimuovi dalla scena
        if (this.desktopPlane && targetScene) {
            targetScene.remove(this.desktopPlane);
        }

        // Rimuovi event listener
        if (this.mouseMoveHandler) {
            window.removeEventListener('mousemove', this.mouseMoveHandler);
        }

        // Ripristina cursore HTML
        const container = document.getElementById('canvas-container');
        if (container) {
            container.classList.remove('desktop-mode');
        }
    }

    /**
     * Update loop
     */
    update() {
        if (!this.isActive) return;
        this.render();
    }

    /**
     * Cleanup
     */
    dispose() {
        if (this.renderTarget) {
            this.renderTarget.dispose();
        }
        if (this.desktopPlane) {
            this.desktopPlane.geometry.dispose();
            this.desktopPlane.material.dispose();
        }
        if (this.mouseMoveHandler) {
            window.removeEventListener('mousemove', this.mouseMoveHandler);
        }
    }
}
