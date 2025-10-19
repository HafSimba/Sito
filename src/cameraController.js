/**
 * Camera Controller
 * Gestisce il movimento e le animazioni della camera
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

export class CameraController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.controls = null;
        this.isAnimating = false;
        this.isZoomed = false;

        this.setupControls(domElement);
    }

    setupControls(domElement) {
        this.controls = new OrbitControls(this.camera, domElement);
        
        // Configurazione iniziale - limitata per mantenere vista frontale
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2.2; // Limita rotazione verso basso
        this.controls.minPolarAngle = Math.PI / 3;   // Limita rotazione verso alto
        this.controls.target.set(0, 1.5, 0); // Target al centro del monitor
        
        // Limita rotazione orizzontale per mantenere vista frontale
        this.controls.minAzimuthAngle = -Math.PI / 6; // -30 gradi
        this.controls.maxAzimuthAngle = Math.PI / 6;   // +30 gradi
        
        console.log('🎮 Camera controls inizializzati (vista frontale)');
    }

    /**
     * Anima la camera verso il monitor (avvicinamento frontale)
     * @param {THREE.Vector3} targetPosition - Posizione del monitor
     */
    zoomToMonitor(targetPosition) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;

        // Posizione finale: davanti al monitor, all'altezza corretta
        // Usa l'altezza del monitor come riferimento e aggiungi offset per occhi
        const finalPosition = new THREE.Vector3(
            targetPosition.x,           // Centrato orizzontalmente con il monitor
            targetPosition.y + 3.8,     // 3.8 unità sopra il monitor (più alto per vista frontale)
            targetPosition.z + 3.2      // 3.2 unità davanti al monitor (vicino per vista immersiva)
        );
        
        const finalTarget = new THREE.Vector3(
            targetPosition.x,
            targetPosition.y,
            targetPosition.z
        );

        console.log('📹 Zoom frontale verso il monitor (vista frontale)...');
        console.log('   Monitor Y:', targetPosition.y);
        console.log('   Camera finale Y:', finalPosition.y, '(alzata per vista frontale)');
        console.log('   Camera finale Z:', finalPosition.z, '(vicina per immersione)');
        console.log('   Da:', this.camera.position);
        console.log('   A:', finalPosition);

        // Disabilita controls durante l'animazione per evitare conflitti
        this.controls.enabled = false;

        // Animazione con GSAP (più lenta e fluida)
        const duration = 3; // 3 secondi per un movimento cinematografico

        // Anima posizione camera
        gsap.to(this.camera.position, {
            x: finalPosition.x,
            y: finalPosition.y,
            z: finalPosition.z,
            duration: duration,
            ease: 'power2.inOut',
            onComplete: () => {
                this.onZoomComplete();
            }
        });

        // NON animare il target dei controls - mantieni la direzione naturale
        // La camera guarderà automaticamente nella direzione corretta
    }

    onZoomComplete() {
        this.isAnimating = false;
        this.isZoomed = true;
        
        // Disabilita OrbitControls e passa a controllo prima persona
        this.controls.enabled = false;
        
        // Abilita controllo mouse prima persona
        this.enableFirstPersonView();
        
        console.log('✅ Zoom completato! Controllo prima persona attivato 🖱️');
        console.log('   Muovi il mouse per guardarti intorno');
        console.log('   Clicca sul monitor per entrare nel desktop!');
    }

    /**
     * Zoom estremo al monitor (solo desktop visibile)
     * @param {THREE.Vector3} monitorPosition - Posizione del monitor
     * @param {Function} onComplete - Callback quando l'animazione finisce
     */
    zoomToDesktop(monitorPosition, onComplete) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        console.log('🖥️ Zoom estremo al desktop...');

        // Disabilita controlli prima persona durante l'animazione
        this.disableFirstPersonView();

        // Salva posizione attuale della camera
        const currentPosition = this.camera.position.clone();

        // Posizione finale: mantieni X e Y attuali, muovi solo in avanti (Z)
        const finalPosition = new THREE.Vector3(
            currentPosition.x,           // Mantieni X attuale
            currentPosition.y,           // Mantieni Y attuale (non scendere!)
            monitorPosition.z - 0.5      // MOLTO PIÙ DENTRO il monitor! (passa attraverso!)
        );

        console.log('📹 Camera da:', currentPosition);
        console.log('📹 Camera a:', finalPosition);

        // Animazione fluida con GSAP - solo movimento in avanti
        gsap.to(this.camera.position, {
            z: finalPosition.z,
            duration: 2, // 2 secondi
            ease: 'power2.inOut',
            onComplete: () => {
                this.isAnimating = false;
                console.log('✅ Zoom estremo completato!');
                if (onComplete) onComplete();
            }
        });

        // Animazione rotazione: guarda direttamente il monitor (reset rotazione)
        gsap.to(this.camera.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2,
            ease: 'power2.inOut'
        });
    }

    /**
     * Abilita controllo vista prima persona (mouse guarda intorno)
     */
    enableFirstPersonView() {
        this.isFirstPerson = true;
        this.isMouseDown = false; // Track se mouse è premuto
        this.mouse = { x: 0, y: 0 };
        this.cameraRotation = { 
            yaw: 0,   // Rotazione orizzontale
            pitch: 0  // Rotazione verticale
        };

        // Sensibilità mouse
        this.sensitivity = 0.002;

        // Event listener per mouse down/up
        const onMouseDown = (event) => {
            // Solo click sinistro
            if (event.button === 0) {
                this.isMouseDown = true;
            }
        };

        const onMouseUp = (event) => {
            if (event.button === 0) {
                this.isMouseDown = false;
            }
        };

        // Event listener per mouse movimento
        const onMouseMove = (event) => {
            if (!this.isFirstPerson || !this.isMouseDown) return; // Solo se mouse premuto

            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;

            // Aggiorna rotazione
            this.cameraRotation.yaw -= movementX * this.sensitivity;
            this.cameraRotation.pitch -= movementY * this.sensitivity;

            // Limita rotazione a ±60 gradi (circa 1.047 radianti) per mantenere focus sul monitor
            const maxYaw = Math.PI / 3;    // 60 gradi orizzontale
            const maxPitch = Math.PI / 3;  // 60 gradi verticale

            this.cameraRotation.yaw = Math.max(-maxYaw, Math.min(maxYaw, this.cameraRotation.yaw));
            this.cameraRotation.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.cameraRotation.pitch));
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        
        // Salva riferimenti per cleanup
        this.firstPersonMouseHandler = onMouseMove;
        this.firstPersonMouseDownHandler = onMouseDown;
        this.firstPersonMouseUpHandler = onMouseUp;

        console.log('💡 Tieni premuto il tasto sinistro del mouse e muovi per guardarti intorno');
        console.log('📐 Rotazione limitata a ±60° per mantenere focus sul monitor');
    }

    /**
     * Disabilita controllo prima persona
     */
    disableFirstPersonView() {
        this.isFirstPerson = false;
        this.isMouseDown = false;
        
        if (this.firstPersonMouseHandler) {
            document.removeEventListener('mousemove', this.firstPersonMouseHandler);
            this.firstPersonMouseHandler = null;
        }
        if (this.firstPersonMouseDownHandler) {
            document.removeEventListener('mousedown', this.firstPersonMouseDownHandler);
            this.firstPersonMouseDownHandler = null;
        }
        if (this.firstPersonMouseUpHandler) {
            document.removeEventListener('mouseup', this.firstPersonMouseUpHandler);
            this.firstPersonMouseUpHandler = null;
        }
    }

    /**
     * Resetta la camera alla posizione iniziale (frontale lontana)
     */
    resetCamera() {
        if (this.isAnimating) return;

        this.isAnimating = true;

        gsap.to(this.camera.position, {
            x: 0,
            y: 2,
            z: 15,
            duration: 2.5,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.controls.update();
            },
            onComplete: () => {
                this.isAnimating = false;
                this.isZoomed = false;
                this.controls.enabled = true;
            }
        });

        gsap.to(this.controls.target, {
            x: 0,
            y: 1.5,
            z: 0,
            duration: 2.5,
            ease: 'power2.inOut'
        });
    }

    update() {
        // Update OrbitControls se attivi
        if (this.controls && this.controls.enabled) {
            this.controls.update();
        }

        // Update vista prima persona se attiva
        if (this.isFirstPerson) {
            // Applica rotazione alla camera (vista prima persona)
            this.camera.rotation.order = 'YXZ';
            this.camera.rotation.y = this.cameraRotation.yaw;
            this.camera.rotation.x = this.cameraRotation.pitch;
        }
    }

    dispose() {
        if (this.controls) {
            this.controls.dispose();
        }
        this.disableFirstPersonView();
    }
}
