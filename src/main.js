/**
 * Main Entry Point - Portfolio 3D
 * Gestisce l'inizializzazione della scena Three.js e l'orchestrazione generale
 */

import * as THREE from 'three';
import { setupScene } from './scene.js';
import { CameraController } from './cameraController.js';
import { Loader } from './loader.js';
import { UIScene } from './uiScene.js';
import { createFallbackScene } from './fallbackScene.js';
import { TutorialPanels } from './tutorialPanels.js';
import { TutorialCard } from './tutorialCard.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { MotionBlurPass } from './motionBlurPass.js';
import { DesktopFullscreen } from './desktopFullscreen.js';
import gsap from 'gsap';

class Portfolio3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cameraController = null;
        this.loader = null;
        this.uiScene = null;
        this.monitor = null;
        this.tutorialPanels = null;
        this.tutorialCard = null;
        this.desktopFullscreen = null;
        
        // Scena separata per tutorial panels (non affetta da blur)
        this.overlayScene = null;
        
        // Post-processing
        this.composer = null;
        this.bloomPass = null;
        this.motionBlurPass = null;
        this.blurAmount = 5; // Blur iniziale
        
        // Raycasting per click sul monitor
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.canClickMonitor = false; // Abilitato dopo primo zoom
        
        // Bind event handler per click
        this.onCanvasClickBound = (event) => this.onCanvasClick(event);

        this.init();
    }

    async init() {
        console.log('🚀 Inizializzazione Portfolio 3D...');

        // Setup renderer
        this.setupRenderer();

        // Setup scena principale
        const sceneSetup = setupScene();
        this.scene = sceneSetup.scene;
        this.camera = sceneSetup.camera;

        // Setup post-processing DOPO aver creato scene e camera
        this.setupPostProcessing();

        // Setup camera controller
        this.cameraController = new CameraController(this.camera, this.renderer.domElement);

        // Setup loader
        this.loader = new Loader();

        // Carica il modello 3D principale
        await this.loadEnvironment();

        // Setup UI Scene (render target per il monitor)
        this.setupUIScene();

        // Event listeners
        this.setupEventListeners();

        // Nascondi loading screen e mostra pulsante
        this.hideLoadingScreen();

        // Start render loop
        this.animate();

        console.log('✅ Portfolio 3D inizializzato con successo!');
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Ottimizzazione
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Ombre morbide
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2; // Aumentato per ambiente lightroom

        const container = document.getElementById('canvas-container');
        container.appendChild(this.renderer.domElement);
    }

    setupPostProcessing() {
        if (!this.scene || !this.camera) {
            console.warn('⚠️ Scene o Camera non ancora inizializzate, skip post-processing');
            return;
        }

        // Composer per post-processing effects
        this.composer = new EffectComposer(this.renderer);
        
        // Render pass (scena base)
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Bloom pass (usato per creare effetto blur iniziale)
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.blurAmount, // Strength (blur iniziale forte)
            0.4,  // Radius
            0.85  // Threshold
        );
        this.composer.addPass(this.bloomPass);

        // Motion Blur pass (attivato durante animazioni camera)
        this.motionBlurPass = new MotionBlurPass(0.95); // Strength 0.95 (molto aggressivo!)
        this.composer.addPass(this.motionBlurPass);

        console.log('🎨 Post-processing configurato (blur iniziale + motion blur)');
    }

    async loadEnvironment() {
        try {
            const onProgress = (progress) => {
                const loadingProgress = document.getElementById('loading-progress');
                if (loadingProgress) {
                    loadingProgress.textContent = `${Math.round(progress * 100)}%`;
                }
            };

            console.log('📦 Caricamento modello environment.glb...');
            const gltf = await this.loader.loadGLTF('/assets/models/environment.glb', onProgress);
            
            this.scene.add(gltf.scene);
            console.log('✅ Modello caricato con successo!');

            // Trova il monitor nella scena
            this.findMonitor(gltf.scene);

            // Abilita le ombre
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

        } catch (error) {
            console.warn('⚠️ Modello environment.glb non trovato, uso scena di fallback');
            console.log('💡 Per usare il tuo modello, inserisci environment.glb in /assets/models/');
            
            // Usa scena procedurale di fallback
            this.monitor = createFallbackScene(this.scene);
            
            // Trova lo schermo dentro il monitor
            this.monitor.traverse((child) => {
                if (child.name === 'screen') {
                    this.monitor = child; // Usa lo schermo come superficie per la UI
                }
            });
        }
    }

    findMonitor(scene) {
        // Cerca un oggetto mesh che rappresenti il monitor/schermo
        const candidates = [];

        scene.traverse((child) => {
            if (!child.isMesh) return;

            const name = (child.name || '').toLowerCase();

            // Nome molto probabile
            if (name.includes('monitor') || name.includes('screen') || name.includes('display') || name.includes('schermo') || name.includes('lcd') || name.includes('tv')) {
                candidates.push({ mesh: child, reason: 'name' });
                return;
            }

            // Controllo dimensioni del bounding box (cerco superficie rettangolare orientata verso l'asse Z)
            try {
                const box = new THREE.Box3().setFromObject(child);
                const size = new THREE.Vector3();
                box.getSize(size);

                // Evita piccoli oggetti
                const area = size.x * size.y;
                if (area < 0.01) return;

                const aspect = Math.max(size.x / size.y, size.y / size.x);

                // Schermo tipicamente largo e sottile (alto/basso spessore)
                if (aspect > 1.3 && size.z < Math.min(size.x, size.y) * 0.2) {
                    candidates.push({ mesh: child, reason: 'shape', aspect, size });
                }
            } catch (e) {
                // ignorare errori di bounding box
            }
        });

        if (candidates.length > 0) {
            // Preferisci candidate con nome, poi per area/aspect
            candidates.sort((a, b) => {
                if (a.reason === 'name' && b.reason !== 'name') return -1;
                if (b.reason === 'name' && a.reason !== 'name') return 1;
                // ordina per area (approssimata)
                const aBox = new THREE.Box3().setFromObject(a.mesh);
                const bBox = new THREE.Box3().setFromObject(b.mesh);
                const aSize = new THREE.Vector3();
                const bSize = new THREE.Vector3();
                aBox.getSize(aSize);
                bBox.getSize(bSize);
                return (bSize.x * bSize.y) - (aSize.x * aSize.y);
            });

            this.monitor = candidates[0].mesh;
            console.log('🖥️ Monitor candidato selezionato:', this.monitor.name || '(unnamed)', 'motivo:', candidates[0].reason);
        } else {
            console.warn('⚠️ Monitor non trovato nella scena.');
            console.log('🔍 Analisi dettagliata di tutte le mesh per trovare lo schermo...');
            
            const meshAnalysis = [];
            scene.traverse((child) => {
                if (child.isMesh) {
                    try {
                        const box = new THREE.Box3().setFromObject(child);
                        const size = new THREE.Vector3();
                        box.getSize(size);
                        const center = new THREE.Vector3();
                        box.getCenter(center);
                        
                // Calcola area e aspect ratio sui 3 assi
                const areaXY = size.x * size.y;
                const areaXZ = size.x * size.z;
                const areaYZ = size.y * size.z;
                const maxArea = Math.max(areaXY, areaXZ, areaYZ);
                
                // Trova quale asse è il più sottile
                const dimensions = [size.x, size.y, size.z].sort((a, b) => a - b);
                const thinnest = dimensions[0];
                const middle = dimensions[1];
                const largest = dimensions[2];
                
                const aspectXY = size.x > 0 && size.y > 0 ? Math.max(size.x / size.y, size.y / size.x) : 0;
                const thinness = thinnest < middle * 0.15; // Più permissivo
                const area = maxArea;                        meshAnalysis.push({
                            name: child.name || '(unnamed)',
                            size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) },
                            center: { x: center.x.toFixed(2), y: center.y.toFixed(2), z: center.z.toFixed(2) },
                            area: area.toFixed(2),
                            aspect: aspectXY.toFixed(2),
                            thin: thinness,
                            vertices: child.geometry.attributes.position.count,
                            mesh: child
                        });
                    } catch (e) {
                        // ignora errori
                    }
                }
            });
            
            // Ordina per area (più grande prima)
            meshAnalysis.sort((a, b) => parseFloat(b.area) - parseFloat(a.area));
            
            // Stampa analisi
            console.log(`📊 Trovate ${meshAnalysis.length} mesh totali`);
            console.log('🔍 Prime 15 mesh ordinate per area:');
            
            meshAnalysis.slice(0, 15).forEach((m, i) => {
                console.log(`${i+1}. ${m.name}`);
                console.log(`   Size: ${m.size.x} x ${m.size.y} x ${m.size.z} | Area: ${m.area} | Aspect: ${m.aspect}`);
                console.log(`   Posizione Y: ${m.center.y} | Sottile? ${m.thin ? '✅' : '❌'} | Vertici: ${m.vertices}`);
            });
            
            console.table(meshAnalysis.slice(0, 15).map(m => ({
                Nome: m.name,
                'Larghezza': m.size.x,
                'Altezza': m.size.y,
                'Profondità': m.size.z,
                'Area': m.area,
                'Aspect': m.aspect,
                'Sottile?': m.thin ? '✅' : '❌',
                'Y pos': m.center.y
            })));
            
            // STRATEGIA SPECIFICA: Cerca mesh con nome che indica lo schermo del monitor
            console.log('🎯 Strategia 1: Cerca per nome specifico (Cube001_2 - schermo ultrawide)');
            let screenCandidate = meshAnalysis.find(m => m.name === 'Cube001_2');
            if (screenCandidate) {
                console.log('   ✅ TROVATO Cube001_2 (schermo monitor):', screenCandidate);
            } else {
                // Fallback: cerca altri nomi comuni
                console.log('   ⚠️ Cube001_2 non trovato, provo altri nomi...');
                const namesToTry = ['Cube001_1', 'Plane001_1', 'Screen', 'Display'];
                for (const name of namesToTry) {
                    screenCandidate = meshAnalysis.find(m => m.name === name);
                    if (screenCandidate) {
                        console.log(`   ✅ TROVATO ${name}:`, screenCandidate);
                        break;
                    }
                }
            }
            
            console.log('🎯 Strategia 2: Cerca rettangoli sottili ad altezza monitor (Y > 0.5)');
            const screenCandidates = meshAnalysis.filter(m => {
                const isThin = m.thin;
                const hasAspect = parseFloat(m.aspect) > 1.3;
                const isSuperRect = parseFloat(m.aspect) > 10;
                const hasArea = parseFloat(m.area) > 1;
                const hasSmallAreaButRect = parseFloat(m.area) > 0.1 && isSuperRect;
                // ALTEZZA PIÙ RESTRITTIVA: deve essere SOPRA la scrivania (Y > 0.5)
                const hasHeight = parseFloat(m.center.y) > 0.5 && parseFloat(m.center.y) < 3;
                
                if (isThin || hasAspect || isSuperRect) {
                    console.log(`   Valutazione ${m.name}:`, {
                        sottile: isThin ? '✅' : '❌',
                        aspect: hasAspect ? `✅ (${m.aspect})` : `❌ (${m.aspect})`,
                        superRect: isSuperRect ? `✅ SUPER (${m.aspect})` : '❌',
                        area: (hasArea || hasSmallAreaButRect) ? `✅ (${m.area})` : `❌ (${m.area})`,
                        altezza: hasHeight ? `✅ (${m.center.y})` : `❌ (${m.center.y})`
                    });
                }
                
                return isThin && hasAspect && (hasArea || hasSmallAreaButRect) && hasHeight;
            });
            
            console.log(`🔎 Trovati ${screenCandidates.length} candidati per lo schermo`);
            
            // Priorità: Cube001_2 (schermo) se trovato, altrimenti candidati filtrati
            if (screenCandidate) {
                this.monitor = screenCandidate.mesh;
                console.log('🖥️ MONITOR TROVATO (nome specifico):', this.monitor.name);
                console.log('   Size:', screenCandidate.size);
                console.log('   Position:', screenCandidate.center);
            } else if (screenCandidates.length > 0) {
                // Prendi il più grande tra i candidati validi
                this.monitor = screenCandidates[0].mesh;
                console.log('🖥️ MONITOR TROVATO tramite analisi geometrica:', this.monitor.name);
                console.log('   Size:', screenCandidates[0].size);
                console.log('   Position:', screenCandidates[0].center);
            } else {
                console.warn('⚠️ Nessun candidato trovato con criteri automatici');
                console.log('🎲 FALLBACK: Provo mesh con aspect ratio alto e Y > 0');
                
                // Fallback: cerca qualsiasi rettangolo ad altezza ragionevole
                const fallbackCandidates = meshAnalysis.filter(m => 
                    parseFloat(m.aspect) > 2 && 
                    parseFloat(m.area) > 5 &&
                    parseFloat(m.center.y) > 0 && 
                    parseFloat(m.center.y) < 2
                );
                
                console.log('   Candidati fallback:', fallbackCandidates.map(m => m.name));
                
                if (fallbackCandidates.length > 0) {
                    this.monitor = fallbackCandidates[0].mesh;
                    console.log('🖥️ MONITOR TROVATO (fallback):', this.monitor.name);
                    console.log('   Size:', fallbackCandidates[0].size);
                } else {
                    console.error('❌ IMPOSSIBILE trovare lo schermo - nessuna mesh valida');
                    console.log('💡 Top 5 mesh rettangolari:');
                    console.table(meshAnalysis.filter(m => parseFloat(m.aspect) > 1.5).slice(0, 5).map(m => ({
                        Nome: m.name,
                        Area: m.area,
                        Aspect: m.aspect,
                        Y: m.center.y
                    })));
                }
            }
        }
    }

    setupUIScene() {
        if (!this.monitor) {
            console.warn('⚠️ Impossibile creare UI Scene: monitor non trovato');
            return;
        }

        this.uiScene = new UIScene(this.renderer, this.monitor);
        console.log('🎨 UI Scene configurata sul monitor');

        // Crea scena overlay separata per tutorial panels (non affetta da blur)
        this.overlayScene = new THREE.Scene();
        console.log('🎨 Overlay scene creata per tutorial panels');

        // Crea tutorial panels nella scena overlay
        this.tutorialPanels = new TutorialPanels(this.overlayScene, this.camera);
        console.log('📋 Tutorial panels inizializzati');
        
        // Crea tutorial card 3D (nella scena principale)
        this.tutorialCard = new TutorialCard(this.scene, this.camera);
        console.log('📋 Tutorial card 3D inizializzata');
        
        // Inizializza desktop fullscreen HTML (nascosto)
        this.desktopFullscreen = new DesktopFullscreen();
        console.log('🖥️ Desktop fullscreen inizializzato');
        
        // Mostra tutorial panels immediatamente (prima di cliccare START)
        setTimeout(() => {
            if (this.tutorialPanels) {
                this.tutorialPanels.show();
                console.log('📋 Tutorial panels mostrati (intro)');
            }
        }, 500);
    }

    setupEventListeners() {
        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize());

        // Start button
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', () => this.onStartClick());
        }

        // Click handler per monitor
        window.addEventListener('click', this.onCanvasClickBound);

        // Keyboard shortcuts (per debug)
        window.addEventListener('keydown', (e) => {
            if (e.key === 's' || e.key === 'S') {
                // Stats rimossi
                console.log('Stats rimossi - shortcut disabilitato');
            }
        });
    }

    /**
     * Handler per click sul canvas (raycasting per monitor e tutorial card)
     */
    onCanvasClick(event) {
        // Calcola posizione mouse normalizzata (-1 a +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Raycasting
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Prima controlla se il click è sulla tutorial card (priorità)
        if (this.tutorialCard && this.tutorialCard.checkClick(this.raycaster)) {
            console.log('📋 Click su tutorial card - chiusura');
            return; // Fermati qui, card gestisce il click
        }

        // Solo se abilitato (dopo primo zoom) e tutorial card non visibile
        if (!this.canClickMonitor || !this.monitor || (this.tutorialCard && this.tutorialCard.isVisible)) return;

        const intersects = this.raycaster.intersectObject(this.monitor, true);

        if (intersects.length > 0) {
            console.log('🖱️ Click sul monitor rilevato!');
            this.onMonitorClick();
        }
    }

    /**
     * Gestisce il click sul monitor (zoom estremo + transizione a desktop)
     */
    onMonitorClick() {
        // Disabilita ulteriori click
        this.canClickMonitor = false;

        // Rimuovi cursore pointer
        const container = document.getElementById('canvas-container');
        if (container) {
            container.classList.remove('clickable');
        }

        console.log('🖥️ Avvio zoom estremo al desktop...');

        // Attiva motion blur per l'animazione
        if (this.motionBlurPass) {
            this.motionBlurPass.activate();
        }

        // Zoom estremo al monitor
        this.cameraController.zoomToDesktop(this.monitor.position, () => {
            // Callback quando l'animazione finisce
            console.log('🎬 Transizione a desktop fullscreen...');
            
            // Disattiva motion blur
            if (this.motionBlurPass) {
                this.motionBlurPass.deactivate();
            }
            
            this.transitionToDesktop();
        });
    }

    /**
     * Transizione alla pagina desktop fullscreen
     */
    transitionToDesktop() {
        console.log('🖥️ Caricamento desktop fullscreen...');
        
        // Fade out della scena 3D
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer) {
            gsap.to(canvasContainer, {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    // Nascondi canvas 3D
                    canvasContainer.style.display = 'none';
                    
                    // Mostra desktop fullscreen HTML
                    this.showDesktopFullscreen();
                }
            });
        }
    }

    /**
     * Mostra desktop virtuale fullscreen
     */
    showDesktopFullscreen() {
        console.log('🖥️ Desktop fullscreen attivo!');
        
        if (this.desktopFullscreen) {
            this.desktopFullscreen.show();
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const startButton = document.getElementById('start-button');
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
            if (startButton) {
                startButton.classList.add('visible');
            }
        }, 500);
    }

    onStartClick() {
        console.log('🎬 Inizio animazione zoom frontale...');
        
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.classList.remove('visible');
        }

        // Nascondi tutorial panels immediatamente
        if (this.tutorialPanels) {
            this.tutorialPanels.hide();
            console.log('📋 Nascondo tutorial panels');
        }

        // Rimuovi blur gradualmente con animazione (stanza diventa nitida)
        this.removeBlur();

        // Attiva motion blur per l'animazione
        if (this.motionBlurPass) {
            this.motionBlurPass.activate();
        }

        // Zoom verso il monitor (se trovato, altrimenti usa posizione di default)
        if (this.monitor) {
            this.cameraController.zoomToMonitor(this.monitor.position);
        } else {
            // Posizione di fallback se il monitor non è stato trovato
            this.cameraController.zoomToMonitor(new THREE.Vector3(0, 1.5, -5));
        }

        // Mostra tutorial card durante lo zoom (dopo 1.5 secondi)
        if (this.tutorialCard) {
            this.tutorialCard.show(1500);
        }

        // Disattiva motion blur dopo l'animazione (3 secondi)
        setTimeout(() => {
            if (this.motionBlurPass) {
                this.motionBlurPass.deactivate();
            }
        }, 3000);

        // Attiva UI Scene dopo lo zoom con boot sequence
        setTimeout(() => {
            if (this.uiScene) {
                console.log('🎬 Attivazione UI Scene e boot sequence...');
                this.uiScene.activate(); // activate() chiama internamente startBootSequence()
            }
            
            // Abilita click sul monitor dopo boot sequence
            setTimeout(() => {
                this.canClickMonitor = true;
                console.log('🖱️ Click sul monitor abilitato! Clicca per entrare nel desktop.');
                
                // Aggiungi cursore pointer
                const container = document.getElementById('canvas-container');
                if (container) {
                    container.classList.add('clickable');
                }
            }, 2000); // 2 secondi dopo boot sequence
        }, 3000); // Attiva dopo 3 secondi (durata animazione)
    }

    /**
     * Rimuove gradualmente l'effetto blur
     */
    removeBlur() {
        console.log('🎨 Rimozione blur...');
        
        // Animazione GSAP per ridurre blur da 5 a 0
        if (gsap && this.bloomPass) {
            gsap.to(this, {
                blurAmount: 0,
                duration: 2, // 2 secondi
                ease: 'power2.inOut',
                onUpdate: () => {
                    this.bloomPass.strength = this.blurAmount;
                },
                onComplete: () => {
                    console.log('✅ Blur rimosso completamente');
                }
            });
        } else {
            // Fallback: rimuovi blur istantaneamente
            console.warn('⚠️ GSAP non disponibile, rimozione blur istantanea');
            this.blurAmount = 0;
            if (this.bloomPass) {
                this.bloomPass.strength = 0;
            }
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Aggiorna anche composer
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
        
        // Aggiorna motion blur pass
        if (this.motionBlurPass) {
            this.motionBlurPass.setSize(window.innerWidth, window.innerHeight);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update camera controller
        if (this.cameraController) {
            this.cameraController.update();
        }

        // Update UI Scene
        if (this.uiScene) {
            this.uiScene.update();
        }

        // Update tutorial panels
        if (this.tutorialPanels) {
            this.tutorialPanels.update();
        }

        // Update tutorial card
        if (this.tutorialCard) {
            this.tutorialCard.update();
        }

        // Render con post-processing (blur effect sulla scena principale)
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }

        // Render overlay scene (tutorial panels) senza blur - sopra tutto
        if (this.overlayScene) {
            this.renderer.autoClear = false; // Non pulire il buffer
            this.renderer.render(this.overlayScene, this.camera);
            this.renderer.autoClear = true;
        }
    }
}

// Inizializza l'applicazione
new Portfolio3D();
