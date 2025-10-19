/**
 * UI Scene
 * Gestisce la mini-scena 3D renderizzata come texture sul monitor
 * Utilizza WebGLRenderTarget per creare una UI interattiva
 */

import * as THREE from 'three';
import gsap from 'gsap';

export class UIScene {
    constructor(renderer, monitorMesh) {
        this.renderer = renderer;
        this.monitorMesh = monitorMesh;
        
        // Mini-scena separata per la UI
        this.scene = new THREE.Scene();
        // Camera con aspect ratio ULTRAWIDE per matchare il monitor (3.31:1)
        this.camera = new THREE.PerspectiveCamera(50, 3.31, 0.1, 100);
        this.camera.position.z = 10; // PIÙ LONTANO per vedere tutto
        
        // Render Target
        this.renderTarget = null;
        
        // Oggetti UI
        this.uiObjects = [];
        this.isActive = false;

        this.init();
    }

    init() {
        // Crea il render target (texture dinamica)
        // IMPORTANTE: Le dimensioni devono matchare l'aspect ratio del monitor fisico!
        // Monitor: 30.21 x 9.12 = aspect ratio 3.31:1 (ultrawide)
        const monitorAspect = 3.31; // aspect ratio del monitor fisico
        const width = 1024;
        const height = Math.round(width / monitorAspect); // ~309 pixel di altezza
        
        console.log(`📐 Render Target: ${width}x${height} (aspect: ${monitorAspect.toFixed(2)}:1)`);
        
        this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });

        // Applica il render target come texture del monitor
        if (this.monitorMesh && this.monitorMesh.material) {
            console.log('🖼️ Applicazione texture dinamica direttamente sul monitor 3D...');
            
            // ✅ NUOVO APPROCCIO: Applica texture direttamente al materiale del monitor esistente
            // Questo mantiene la geometria e curvatura originale del modello 3D
            
            // Funzione helper per applicare texture a un singolo materiale
            const applyTextureToMaterial = (mat, index) => {
                if (!mat) return;
                
                console.log(`   Material ${index || 0}:`, mat.type);
                console.log(`   - Nome materiale:`, mat.name || '(unnamed)');
                console.log(`   - Emissive supportato:`, mat.emissive !== undefined);
                
                // Salva colore originale se esiste
                const originalColor = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
                
                // Applica il render target come texture principale
                mat.map = this.renderTarget.texture;
                mat.needsUpdate = true;
                
                // Configura proprietà per simulare schermo LCD luminoso
                if (mat.emissive !== undefined) {
                    mat.emissive = new THREE.Color(0xFFFFFF); // Bianco per massima emissione
                    mat.emissiveMap = this.renderTarget.texture; // Texture come emissive
                }
                
                if (mat.emissiveIntensity !== undefined) {
                    mat.emissiveIntensity = 3.0; // Alta intensità per schermo brillante
                }
                
                // Rendi più luminoso disabilitando tone mapping
                if (mat.toneMapped !== undefined) {
                    mat.toneMapped = false;
                }
                
                // Configura per essere sempre visibile e brillante
                if (mat.transparent !== undefined) {
                    mat.transparent = false;
                }
                
                if (mat.opacity !== undefined) {
                    mat.opacity = 1.0;
                }
                
                console.log('   ✅ Texture dinamica applicata al materiale');
            };

            // Applica a tutti i materiali (supporta array multipli o singolo)
            if (Array.isArray(this.monitorMesh.material)) {
                console.log(`   Monitor ha ${this.monitorMesh.material.length} materiali (array)`);
                this.monitorMesh.material.forEach((mat, idx) => applyTextureToMaterial(mat, idx));
            } else {
                console.log('   Monitor ha 1 materiale singolo');
                applyTextureToMaterial(this.monitorMesh.material);
            }
            
            // Assicurati che il monitor sia visibile
            this.monitorMesh.visible = true;
            
            console.log('✅ Texture dinamica applicata direttamente al monitor 3D');
            console.log('   La geometria e curvatura originali del modello sono preservate');
            console.log('   Monitor mesh:', this.monitorMesh.name || '(unnamed)');
            console.log('   Position:', {
                x: this.monitorMesh.position.x.toFixed(3),
                y: this.monitorMesh.position.y.toFixed(3),
                z: this.monitorMesh.position.z.toFixed(3)
            });

            // Aggiorna status overlay
            const statusUI = document.getElementById('status-ui');
            const statusTexture = document.getElementById('status-texture');
            if (statusUI) statusUI.innerHTML = 'UI Scene: initialized';
            if (statusTexture) statusTexture.innerHTML = 'Texture: applied';
            
            console.log('✅ Render target applicato con successo');
        } else {
            console.error('❌ Monitor mesh o material non trovato - texture non può essere applicata');
        }

        // Setup UI Scene
        this.setupUIScene();

        console.log('🎨 UI Scene inizializzata (Render Target)');
    }

    setupUIScene() {
        // Background della UI (inizialmente nero/spento)
        this.scene.background = new THREE.Color(0x000000);
        this.targetBackgroundColor = new THREE.Color(0x1e3a8a); // Blu professionale (blu scuro elegante)

        // Luce per la mini-scena (ambientale per UI desktop)
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(this.ambientLight);

        this.pointLight = new THREE.PointLight(0xffffff, 1.5, 20);
        this.pointLight.position.set(0, 5, 5);
        this.scene.add(this.pointLight);

        // Stato animazione
        this.bootProgress = 0; // 0 = spento, 1 = completamente acceso
        this.isBooting = false;
        
        // Stato UI
        this.currentScreen = 'off'; // 'off' -> 'login' -> 'loading' -> 'desktop'

        // Crea schermate
        this.createLoginScreen();
        this.createDesktopUI();
        
        // Nascondi tutto inizialmente
        this.hideAllScreens();
    }

    /**
     * Crea la schermata di login con icona utente e bottone
     */
    createLoginScreen() {
        this.loginGroup = new THREE.Group();
        this.loginGroup.visible = false;
        this.loginGroup.position.x = 0; // Centrato perfettamente (modifica se necessario)
        
        // DIMENSIONI VISIBILI NELLO SCHERMO ULTRAWIDE 3.31:1 con camera a z=10, FOV=50°
        // Larghezza visibile: ~16.5 unità (molto più largo!)
        // Altezza visibile: ~5 unità
        
        // Icona utente (cerchio stilizzato)
        const userIconGeometry = new THREE.CircleGeometry(0.8, 32);
        const userIconMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.9
        });
        const userIcon = new THREE.Mesh(userIconGeometry, userIconMaterial);
        userIcon.position.y = 1.2; // Sopra il bottone
        this.loginGroup.add(userIcon);
        
        // Bottone LOGIN - DIMENSIONI CORRETTE PER ULTRAWIDE
        // Sfondo bianco del bottone
        const buttonBgGeometry = new THREE.PlaneGeometry(3.5, 1.2);
        const buttonBgMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: false
        });
        const buttonBg = new THREE.Mesh(buttonBgGeometry, buttonBgMaterial);
        buttonBg.position.set(0, 0, 0.01);
        
        // Testo LOGIN con canvas
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 512;
        textCanvas.height = 256;
        const ctx = textCanvas.getContext('2d');
        
        // Testo blu professionale (abbinato al tema)
        ctx.fillStyle = '#1e3a8a'; // Blu scuro professionale
        ctx.font = 'bold 90px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LOGIN', 256, 128);
        
        const textTexture = new THREE.CanvasTexture(textCanvas);
        const textGeometry = new THREE.PlaneGeometry(3.5, 1.2);
        const textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true
        });
        const buttonText = new THREE.Mesh(textGeometry, textMaterial);
        buttonText.position.set(0, 0, 0.02);
        
        // Gruppo bottone
        this.loginButton = new THREE.Group();
        this.loginButton.add(buttonBg);
        this.loginButton.add(buttonText);
        this.loginButton.position.y = -0.3; // Sotto l'icona
        this.loginButton.userData = { isClickable: true, action: 'login' };
        
        this.loginGroup.add(this.loginButton);
        this.scene.add(this.loginGroup);
        
        console.log('🔐 Login screen creato con dimensioni ottimizzate per ULTRAWIDE 3.31:1');
        console.log('   - loginGroup X:', this.loginGroup.position.x);
        console.log('   - Icona: radius 0.8, Y: 1.2');
        console.log('   - Bottone: 3.5x1.2, Y: -0.3');
        
        // Spinner di caricamento (nascosto inizialmente)
        this.loadingSpinner = this.createLoadingSpinner();
        this.scene.add(this.loadingSpinner);
    }
    
    /**
     * Crea uno spinner di caricamento animato
     */
    createLoadingSpinner() {
        const spinnerGroup = new THREE.Group();
        spinnerGroup.visible = false;
        
        // Cerchio esterno che ruota
        const ringGeometry = new THREE.RingGeometry(0.7, 0.9, 32, 1, 0, Math.PI * 1.5);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        spinnerGroup.add(ring);
        
        // Animazione rotazione
        spinnerGroup.userData.animate = () => {
            ring.rotation.z += 0.05;
        };
        
        return spinnerGroup;
    }

    /**
     * Nasconde tutte le schermate
     */
    hideAllScreens() {
        console.log('🙈 hideAllScreens() chiamato - nascondo tutto');
        console.trace(); // Stack trace per vedere CHI chiama questa funzione
        if (this.loginGroup) this.loginGroup.visible = false;
        if (this.loadingSpinner) this.loadingSpinner.visible = false;
        if (this.desktopGroup) this.desktopGroup.visible = false;
    }

    createDesktopUI() {
        console.log('🖥️ Creazione Desktop UI...');
        
        // Crea gruppo per elementi desktop
        this.desktopGroup = new THREE.Group();
        this.desktopGroup.visible = false;
        this.scene.add(this.desktopGroup);
        
        try {
            // NAVBAR IN BASSO (taskbar stile desktop)
            console.log('   Creazione taskbar...');
            this.createTaskbar();
            console.log('   ✅ Taskbar creata');

            // ICONE CARTELLE SUL DESKTOP (disposte in griglia)
            const folders = [
                { name: 'CV', position: [-5, 2.5, 0] },
                { name: 'Progetti', position: [-5, 0.8, 0] },
                { name: 'Contatti', position: [-5, -0.9, 0] },
                { name: 'About Me', position: [-5, -2.6, 0] }
            ];

            console.log('   Creazione cartelle...');
            folders.forEach(folder => {
                const folderGroup = this.createFolderIcon(folder.name);
                folderGroup.position.set(...folder.position);
                folderGroup.userData = { name: folder.name, isFolder: true };
                this.desktopGroup.add(folderGroup); // Aggiunto al gruppo desktop
                this.uiObjects.push(folderGroup);
            });
            console.log(`   ✅ ${folders.length} cartelle create`);
        } catch (error) {
            console.error('❌ Errore durante creazione Desktop UI:', error);
            throw error;
        }
    }

    /**
     * Crea un'icona cartella stilizzata con nome sotto
     */
    createFolderIcon(name) {
        const group = new THREE.Group();

        // ICONA CARTELLA (forma stilizzata)
        const folderGeometry = new THREE.BoxGeometry(1.2, 0.9, 0.1);
        const folderMaterial = new THREE.MeshStandardMaterial({
            color: 0xF4D03F, // Giallo cartella
            metalness: 0.2,
            roughness: 0.6
        });
        const folder = new THREE.Mesh(folderGeometry, folderMaterial);
        folder.position.y = 0.3;
        group.add(folder);

        // Tab della cartella (parte superiore)
        const tabGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.11);
        const tab = new THREE.Mesh(tabGeometry, folderMaterial);
        tab.position.set(-0.25, 0.8, 0);
        group.add(tab);

        // NOME SOTTO LA CARTELLA (usando canvas texture)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Sfondo trasparente
        ctx.clearRect(0, 0, 256, 64);
        
        // Testo
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelGeometry = new THREE.PlaneGeometry(1.5, 0.4);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.95
        });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.y = -0.5;
        group.add(label);

        return group;
    }

    /**
     * Crea la taskbar in basso (navbar desktop)
     */
    createTaskbar() {
        // Barra nera in basso (stile Windows/Mac)
        const taskbarGeometry = new THREE.PlaneGeometry(14, 1);
        const taskbarMaterial = new THREE.MeshBasicMaterial({
            color: 0x1a1a1a,
            transparent: true,
            opacity: 0.85
        });
        const taskbar = new THREE.Mesh(taskbarGeometry, taskbarMaterial);
        taskbar.position.set(0, -3.5, 0.01);
        this.desktopGroup.add(taskbar); // Aggiunto al gruppo desktop

        // Icone nella taskbar (stilizzate, non cliccabili)
        const taskbarIcons = [
            { x: -5.5, color: 0x0078D4 }, // Windows/Start
            { x: -4.2, color: 0x34A853 }, // Browser
            { x: -2.9, color: 0xFBBC05 }, // Files
            { x: -1.6, color: 0xEA4335 }  // App
        ];

        taskbarIcons.forEach(icon => {
            const iconGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.05);
            const iconMaterial = new THREE.MeshStandardMaterial({
                color: icon.color,
                metalness: 0.3,
                roughness: 0.5
            });
            const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial);
            iconMesh.position.set(icon.x, -3.5, 0.02);
            this.desktopGroup.add(iconMesh); // Aggiunto al gruppo desktop
        });

        // Clock/ora in basso a destra (simulato)
        const clockCanvas = document.createElement('canvas');
        clockCanvas.width = 128;
        clockCanvas.height = 64;
        const clockCtx = clockCanvas.getContext('2d');
        clockCtx.fillStyle = '#FFFFFF';
        clockCtx.font = 'bold 24px Arial';
        clockCtx.textAlign = 'center';
        clockCtx.fillText('12:34', 64, 40);
        
        const clockTexture = new THREE.CanvasTexture(clockCanvas);
        const clockGeometry = new THREE.PlaneGeometry(0.8, 0.4);
        const clockMaterial = new THREE.MeshBasicMaterial({
            map: clockTexture,
            transparent: true
        });
        const clock = new THREE.Mesh(clockGeometry, clockMaterial);
        clock.position.set(5.8, -3.5, 0.02);
        this.desktopGroup.add(clock); // Aggiunto al gruppo desktop
    }

    /**
     * Animazione degli elementi UI
     */
    update() {
        // Permetti il rendering anche prima dell'attivazione completa (per boot sequence)
        if (!this.isActive && this.bootProgress === 0) return;

        // Animazione boot sequence (schermo si accende progressivamente)
        if (this.isBooting || this.bootProgress < 1) {
            // Interpola colore background da nero a bordeaux
            this.scene.background.lerpColors(
                new THREE.Color(0x000000),
                this.targetBackgroundColor,
                this.bootProgress
            );

            // Aumenta intensità luci progressivamente
            this.ambientLight.intensity = this.bootProgress * 1.2; // Aumentato per vedere meglio
            this.pointLight.intensity = this.bootProgress * 1.5;
            
            // Debug occasionale
            if (Math.random() < 0.01) {
                console.log('🎨 Boot animation:', {
                    progress: this.bootProgress.toFixed(2),
                    bgColor: `#${this.scene.background.getHexString()}`,
                    ambientLight: this.ambientLight.intensity.toFixed(2)
                });
            }
        }

        // Le icone desktop sono statiche (nessuna animazione continua)
        
        // Anima lo spinner se visibile
        if (this.loadingSpinner && this.loadingSpinner.visible && this.loadingSpinner.userData.animate) {
            this.loadingSpinner.userData.animate();
        }

        // Render della mini-scena nel render target
        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null); // Torna al render principale
        
        // Debug: log occasionale per verificare rendering
        if (this.isBooting && Math.random() < 0.02) {
            console.log('🎨 Rendering UI Scene - bootProgress:', this.bootProgress.toFixed(2));
        }
    }

    activate() {
        this.isActive = true;
        this.startBootSequence();
        console.log('✅ UI Scene attivata - Avvio boot sequence');
    }

    deactivate() {
        this.isActive = false;
        console.log('⏸️ UI Scene disattivata');
    }

    /**
     * Avvia la sequenza di accensione dello schermo (blu progressivo)
     */
    startBootSequence() {
        this.isBooting = true;
        this.bootProgress = 0;
        
        console.log('🖥️ Avvio boot sequence - Schermo si accende...');
        console.log('   isActive:', this.isActive);
        console.log('   GSAP disponibile:', typeof gsap !== 'undefined');
        console.log('   Monitor mesh:', this.monitorMesh?.name || 'unnamed');

        // Animazione con GSAP per smooth transition
        if (typeof gsap !== 'undefined') {
            console.log('   ✅ Avvio animazione GSAP bootProgress 0 → 1');
            gsap.to(this, {
                bootProgress: 1,
                duration: 2, // 2 secondi per accensione completa
                ease: 'power2.out',

                onComplete: () => {
                    this.isBooting = false;
                    this.showLoginScreen(); // Mostra login invece del desktop
                    console.log('✅ Boot sequence completata - Login screen mostrato');
                }
            });
        } else {
            console.error('❌ GSAP non disponibile - animazione non può partire');
        }

        // Anima anche l'emissività del materiale dello schermo
        if (this.monitorMesh && this.monitorMesh.material) {
            const animateMaterial = (mat) => {
                if (!mat) return;
                if (typeof gsap !== 'undefined') {
                    gsap.to(mat, {
                        emissiveIntensity: 3.0, // Molto alto per schermo brillante
                        duration: 2,
                        ease: 'power2.out'
                    });
                }
            };

            if (Array.isArray(this.monitorMesh.material)) {
                this.monitorMesh.material.forEach(animateMaterial);
            } else {
                animateMaterial(this.monitorMesh.material);
            }
        }
    }

    /**
     * Mostra la schermata di login con animazione
     */
    showLoginScreen() {
        console.log('🔐 Mostrando schermata login...');
        console.log('   loginGroup:', this.loginGroup);
        console.log('   loginGroup.visible:', this.loginGroup?.visible);
        console.log('   loginGroup.children:', this.loginGroup?.children.length);
        console.log('   Camera position:', this.camera.position);
        console.log('   Scene children:', this.scene.children.length);
        
        this.currentScreen = 'login';
        
        // NON chiamare hideAllScreens() qui - nascondi SOLO gli altri elementi
        if (this.loadingSpinner) this.loadingSpinner.visible = false;
        if (this.desktopGroup) this.desktopGroup.visible = false;
        
        if (this.loginGroup) {
            this.loginGroup.visible = true;
            this.loginGroup.scale.set(0, 0, 0);
            this.loginGroup.position.set(0, 0, 0); // Assicurati che sia al centro
            
            console.log('   ✅ Login group impostato visible=true');
            console.log('   📍 Position:', this.loginGroup.position);
            console.log('   📏 Scale prima animazione:', this.loginGroup.scale);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(this.loginGroup.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                    onComplete: () => {
                        console.log('   ✅ Animazione login completata');
                        console.log('   📏 Scale finale:', this.loginGroup.scale);
                        console.log('   👁️ Visible:', this.loginGroup.visible);
                        // DEBUG: Stampa info sui children
                        this.loginGroup.children.forEach((child, i) => {
                            console.log(`   Child ${i}:`, child.type, 'pos:', child.position, 'visible:', child.visible);
                        });
                    }
                });
            } else {
                this.loginGroup.scale.set(1, 1, 1);
                console.log('   ⚠️ GSAP non disponibile, scala impostata direttamente');
            }
        } else {
            console.error('   ❌ loginGroup è null!');
        }
        
        // Setup click handler per il bottone login
        this.setupLoginClickHandler();
    }
    
    /**
     * Setup click handler per rilevare click sul bottone login
     */
    setupLoginClickHandler() {
        // Usa raycasting per rilevare click sul bottone
        window.addEventListener('click', this.onLoginClick.bind(this), { once: true });
    }
    
    /**
     * Gestisce il click sul bottone login
     */
    onLoginClick(event) {
        // Raycasting per vedere se abbiamo cliccato il bottone
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObject(this.loginButton, true);
        
        if (intersects.length > 0) {
            console.log('🔐 Login clicked!');
            this.showLoadingScreen();
        } else {
            // Se non ha cliccato il bottone, ri-attiva il listener
            this.setupLoginClickHandler();
        }
    }
    
    /**
     * Mostra lo spinner di caricamento
     */
    showLoadingScreen() {
        this.currentScreen = 'loading';
        
        // Nascondi login con fade out
        if (typeof gsap !== 'undefined' && this.loginGroup) {
            gsap.to(this.loginGroup.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    this.loginGroup.visible = false;
                }
            });
        }
        
        // Mostra spinner
        if (this.loadingSpinner) {
            this.loadingSpinner.visible = true;
            this.loadingSpinner.scale.set(0, 0, 0);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(this.loadingSpinner.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            }
        }
        
        // Dopo 1.5 secondi mostra il desktop
        setTimeout(() => {
            this.showDesktop();
        }, 1500);
    }
    
    /**
     * Mostra il desktop completo
     */
    showDesktop() {
        this.currentScreen = 'desktop';
        
        console.log('🖥️ Mostrando desktop...');
        
        // Nascondi spinner
        if (typeof gsap !== 'undefined' && this.loadingSpinner) {
            gsap.to(this.loadingSpinner.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    this.loadingSpinner.visible = false;
                }
            });
        }
        
        // Mostra gruppo desktop
        if (this.desktopGroup) {
            this.desktopGroup.visible = true;
            this.desktopGroup.scale.set(0, 0, 0);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(this.desktopGroup.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.6,
                    ease: 'back.out(1.4)',
                    onComplete: () => {
                        console.log('✅ Desktop mostrato completamente');
                    }
                });
            } else {
                this.desktopGroup.scale.set(1, 1, 1);
            }
        }
    }

    /**
     * Nasconde gli elementi UI (icone)
     */
    hideUIElements() {
        this.uiObjects.forEach(obj => {
            obj.visible = false;
        });
    }

    /**
     * Mostra gradualmente gli elementi UI
     */
    showUIElements() {
        this.uiObjects.forEach((obj, index) => {
            // Animazione scaglionata per ogni icona
            setTimeout(() => {
                obj.visible = true;
                
                // Animazione di entrata (scala da 0 a 1)
                obj.scale.set(0, 0, 0);
                if (window.gsap) {
                    gsap.to(obj.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 0.5,
                        ease: 'back.out(1.7)'
                    });
                }
            }, index * 150); // Delay di 150ms tra ogni icona
        });
    }

    dispose() {
        console.log('🗑️ Disposing UIScene...');
        
        if (this.renderTarget) {
            this.renderTarget.dispose();
            console.log('   ✅ RenderTarget disposed');
        }
        
        // Dispose geometries e materials in modo sicuro
        this.uiObjects.forEach(obj => {
            if (obj.geometry) {
                obj.geometry.dispose();
            }
            if (obj.material) {
                // Material potrebbe essere array o singolo
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => {
                        if (mat && mat.dispose) mat.dispose();
                    });
                } else if (obj.material.dispose) {
                    obj.material.dispose();
                }
            }
        });
        
        console.log('   ✅ UI Objects disposed');
        
        // Pulisci array
        this.uiObjects = [];
        
        console.log('✅ UIScene disposed completamente');
    }
}
