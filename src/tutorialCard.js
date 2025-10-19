/**
 * Tutorial Card 3D
 * Card informativa che appare durante lo zoom verso il PC
 */

import * as THREE from 'three';
import gsap from 'gsap';

export class TutorialCard {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.card = null;
        this.isVisible = false;
        this.mesh = null;
        
        this.createCard();
    }

    /**
     * Crea la card 3D con il tutorial
     */
    createCard() {
        // Crea un gruppo per la card
        this.card = new THREE.Group();
        
        // Dimensioni card ridotte e più compatte
        const width = 2.2;
        const height = 1.6;
        const depth = 0.04;

        // Geometria card (pannello rettangolare)
        const cardGeometry = new THREE.BoxGeometry(width, height, depth);
        
        // Materiale card (bianco semi-trasparente con leggero blur)
        const cardMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.98,
            roughness: 0.2,
            metalness: 0.1,
            side: THREE.DoubleSide,
            emissive: 0xffffff,
            emissiveIntensity: 0.05
        });

        this.mesh = new THREE.Mesh(cardGeometry, cardMaterial);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.card.add(this.mesh);

        // Crea canvas per il testo
        const canvas = this.createTextCanvas(width, height);
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        // Materiale per il testo
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        // Mesh per il testo (leggermente davanti alla card per evitare z-fighting)
        const textGeometry = new THREE.PlaneGeometry(width - 0.02, height - 0.02);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.z = depth / 2 + 0.001;
        this.card.add(textMesh);

        // Bordo decorativo
        const borderGeometry = new THREE.BoxGeometry(width + 0.05, height + 0.05, depth / 2);
        const borderMaterial = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.8,
            roughness: 0.2,
            metalness: 0.5
        });
        const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
        borderMesh.position.z = -depth / 2;
        this.card.add(borderMesh);

        // Aggiungi glow effect (luce puntiforme più intensa)
        const glowLight = new THREE.PointLight(0x3b82f6, 1.2, 4);
        glowLight.position.z = 0.3;
        this.card.add(glowLight);

        // Nascondi inizialmente
        this.card.visible = false;
        this.card.scale.set(0, 0, 0);
        
        this.scene.add(this.card);
        
        console.log('📋 Tutorial Card 3D creata');
    }

    /**
     * Crea canvas con il testo del tutorial
     */
    createTextCanvas(width, height) {
        // Scala per alta risoluzione (retina)
        const scale = 600;
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);

        // Sfondo semi-trasparente
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, 0, width, height);

        // Colori
        const primaryColor = '#0f172a';
        const accentColor = '#3b82f6';
        const textColor = '#475569';

        // Titolo - più grande e più in alto
        ctx.font = 'bold 0.22px "Segoe UI", system-ui, sans-serif';
        ctx.fillStyle = accentColor;
        ctx.textAlign = 'center';
        ctx.fillText('Come Utilizzare il Sito', width / 2, 0.28);

        // Linea separatrice più in alto
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 0.012;
        ctx.beginPath();
        ctx.moveTo(0.3, 0.42);
        ctx.lineTo(width - 0.3, 0.42);
        ctx.stroke();

        // Istruzioni - semplificate e più grandi
        const instructions = [
            {
                icon: '🖱️',
                text: 'Tieni premuto e trascina per ruotare la visuale'
            },
            {
                icon: '🖥️',
                text: 'Clicca sul monitor per entrare nel desktop'
            },
            {
                icon: '⚡',
                text: 'Spegni dal menu Start per uscire'
            }
        ];

        let yPos = 0.58;
        const lineHeight = 0.26;

        ctx.textAlign = 'left';

        instructions.forEach((instr, index) => {
            // Icona più grande
            ctx.font = '0.16px Arial';
            ctx.fillText(instr.icon, 0.25, yPos);

            // Testo più grande e leggibile
            ctx.font = '0.095px "Segoe UI", system-ui, sans-serif';
            ctx.fillStyle = primaryColor;
            
            // Word wrap per testo lungo
            const maxWidth = width - 0.6;
            const words = instr.text.split(' ');
            let line = '';
            let textY = yPos;

            words.forEach((word, i) => {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && line !== '') {
                    ctx.fillText(line.trim(), 0.48, textY);
                    line = word + ' ';
                    textY += 0.115;
                } else {
                    line = testLine;
                }
            });
            ctx.fillText(line.trim(), 0.48, textY);

            yPos += lineHeight;
        });

        // Bottone "Ho Capito" - più grande e in basso
        const buttonY = height - 0.22;
        const buttonWidth = 1.2;
        const buttonHeight = 0.22;
        const buttonX = (width - buttonWidth) / 2;

        // Sfondo bottone (gradiente)
        const gradient = ctx.createLinearGradient(
            buttonX, buttonY - buttonHeight / 2, 
            buttonX + buttonWidth, buttonY + buttonHeight / 2
        );
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#2563eb');

        ctx.fillStyle = gradient;
        this.roundRect(ctx, buttonX, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 0.06);
        ctx.fill();

        // Ombra bottone
        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.shadowBlur = 0.02;
        ctx.shadowOffsetY = 0.01;

        // Testo bottone più grande
        ctx.font = 'bold 0.12px "Segoe UI", system-ui, sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'transparent';
        ctx.fillText('Ho Capito', width / 2, buttonY + 0.04);

        return canvas;
    }

    /**
     * Helper per disegnare rettangoli arrotondati
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    /**
     * Mostra la card con animazione
     * @param {number} delay - Ritardo in millisecondi prima di mostrare
     */
    show(delay = 1500) {
        if (this.isVisible) return;

        setTimeout(() => {
            this.isVisible = true;
            this.card.visible = true;

            // Posiziona la card davanti alla camera
            this.updatePosition();

            // Animazione di apparizione (scale + fade)
            gsap.to(this.card.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });

            // Piccola rotazione oscillante per attirare attenzione
            gsap.to(this.card.rotation, {
                y: 0.05,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            console.log('📋 Tutorial Card mostrata');
        }, delay);
    }

    /**
     * Nascondi la card con animazione
     */
    hide() {
        if (!this.isVisible) return;

        this.isVisible = false;

        // Ferma oscillazione
        gsap.killTweensOf(this.card.rotation);

        // Animazione di scomparsa
        gsap.to(this.card.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: 'back.in(1.7)',
            onComplete: () => {
                this.card.visible = false;
                console.log('📋 Tutorial Card nascosta');
            }
        });
    }

    /**
     * Aggiorna posizione card per seguire la camera
     */
    updatePosition() {
        if (!this.card || !this.camera) return;

        // Posiziona la card davanti alla camera, ma leggermente più in alto
        const distance = 2.5; // Distanza ridotta dalla camera (più vicina)
        const verticalOffset = 0.3; // Offset verticale per alzarla sopra la scrivania
        
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        
        const position = this.camera.position.clone();
        position.add(direction.multiplyScalar(distance));
        
        // Alza la card leggermente sopra il livello della camera
        position.y += verticalOffset;

        this.card.position.copy(position);

        // Orienta la card verso la camera
        this.card.lookAt(this.camera.position);
    }

    /**
     * Controlla se il click è sulla card (per chiudere)
     */
    checkClick(raycaster) {
        if (!this.isVisible || !this.mesh) return false;

        const intersects = raycaster.intersectObject(this.mesh, true);
        
        if (intersects.length > 0) {
            // Click sulla card - chiudi
            this.hide();
            return true;
        }

        return false;
    }

    /**
     * Update loop (mantiene card centrata)
     */
    update() {
        if (this.isVisible) {
            this.updatePosition();
        }
    }

    /**
     * Cleanup
     */
    dispose() {
        if (this.card) {
            gsap.killTweensOf(this.card.scale);
            gsap.killTweensOf(this.card.rotation);
            this.scene.remove(this.card);
            
            // Dispose geometries e materials
            this.card.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            });
        }
    }
}
