/**
 * Tutorial Panels (Tendine)
 * Crea pannelli 3D laterali con istruzioni per l'uso del sito
 */

import * as THREE from 'three';
import gsap from 'gsap';

export class TutorialPanels {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.leftPanel = null;
        this.rightPanel = null;
        this.isVisible = false;

        this.createPanels();
    }

    createPanels() {
        // PANNELLO SINISTRO
        this.leftPanel = this.createPanel('left', [
            'Benvenuto! 👋',
            '',
            'Usa il mouse per:',
            '• Guardarti intorno',
            '• Esplorare lo spazio',
            '',
            'Clicca per interagire',
            'con gli elementi'
        ]);

        // PANNELLO DESTRO
        this.rightPanel = this.createPanel('right', [
            'Istruzioni 📋',
            '',
            'Desktop virtuale:',
            '• Clicca LOGIN',
            '• Esplora le cartelle',
            '• CV e Progetti',
            '',
            'Divertiti! ✨'
        ]);

        // Posiziona i pannelli fuori schermo inizialmente
        this.leftPanel.position.set(-8, 2, 0);
        this.rightPanel.position.set(8, 2, 0);
        this.leftPanel.visible = false;
        this.rightPanel.visible = false;

        this.scene.add(this.leftPanel);
        this.scene.add(this.rightPanel);

        console.log('📋 Tutorial panels creati');
    }

    createPanel(side, textLines) {
        const group = new THREE.Group();

        // Dimensioni pannello
        const width = 3;
        const height = 4;
        const padding = 0.2;

        // Background pannello (semi-trasparente)
        const bgGeometry = new THREE.PlaneGeometry(width, height);
        const bgMaterial = new THREE.MeshBasicMaterial({
            color: 0x1e3a8a, // Blu professionale
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        const background = new THREE.Mesh(bgGeometry, bgMaterial);
        group.add(background);

        // Bordo pannello (frame dorato)
        const borderGeometry = new THREE.EdgesGeometry(bgGeometry);
        const borderMaterial = new THREE.LineBasicMaterial({ 
            color: 0xfbbf24, // Oro
            linewidth: 2 
        });
        const border = new THREE.LineSegments(borderGeometry, borderMaterial);
        border.position.z = 0.01;
        group.add(border);

        // Testo su canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 682; // Proporzione con altezza pannello
        const ctx = canvas.getContext('2d');

        // Background canvas trasparente
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Disegna testo
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        let yOffset = 40;
        textLines.forEach((line, index) => {
            if (line === '') {
                yOffset += 20; // Spaziatura per linee vuote
            } else {
                // Titolo più grande
                if (index === 0) {
                    ctx.font = 'bold 42px Arial';
                } else {
                    ctx.font = index === 2 || index === 4 ? 'bold 32px Arial' : '28px Arial';
                }
                ctx.fillText(line, canvas.width / 2, yOffset);
                yOffset += index === 0 ? 60 : 45;
            }
        });

        const textTexture = new THREE.CanvasTexture(canvas);
        const textGeometry = new THREE.PlaneGeometry(width - padding, height - padding);
        const textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.z = 0.02;
        group.add(textMesh);

        return group;
    }

    /**
     * Mostra i pannelli con animazione slide-in
     */
    show() {
        if (this.isVisible) return;
        this.isVisible = true;

        // Calcola posizioni finali in base alla camera
        const cameraPos = this.camera.position.clone();
        const leftFinalX = cameraPos.x - 6;
        const rightFinalX = cameraPos.x + 6;
        const finalY = cameraPos.y;
        const finalZ = cameraPos.z - 8; // Davanti alla camera

        // Posizioni iniziali (fuori schermo)
        this.leftPanel.position.set(leftFinalX - 3, finalY, finalZ);
        this.rightPanel.position.set(rightFinalX + 3, finalY, finalZ);
        this.leftPanel.visible = true;
        this.rightPanel.visible = true;
        this.leftPanel.scale.set(0, 0, 0);
        this.rightPanel.scale.set(0, 0, 0);

        console.log('📋 Mostrando tutorial panels...');

        // Animazione slide-in da sinistra e destra
        gsap.to(this.leftPanel.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });

        gsap.to(this.rightPanel.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: 0.2
        });
    }

    /**
     * Nascondi i pannelli con animazione slide-out
     */
    hide() {
        if (!this.isVisible) return;
        this.isVisible = false;

        console.log('📋 Nascondendo tutorial panels...');

        gsap.to(this.leftPanel.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                this.leftPanel.visible = false;
            }
        });

        gsap.to(this.rightPanel.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: 'power2.in',
            delay: 0.1,
            onComplete: () => {
                this.rightPanel.visible = false;
            }
        });
    }

    /**
     * Aggiorna posizione pannelli per seguire la camera (opzionale)
     */
    update() {
        if (!this.isVisible) return;

        // I pannelli possono seguire la camera se necessario
        // Per ora rimangono statici
    }

    dispose() {
        if (this.leftPanel) {
            this.scene.remove(this.leftPanel);
        }
        if (this.rightPanel) {
            this.scene.remove(this.rightPanel);
        }
    }
}
