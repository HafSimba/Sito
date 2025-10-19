/**
 * Loader
 * Gestisce il caricamento di modelli 3D, texture e altre risorse
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class Loader {
    constructor() {
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        
        // Setup Draco decoder per modelli compressi (opzionale ma raccomandato)
        this.setupDraco();
    }

    setupDraco() {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        this.gltfLoader.setDRACOLoader(dracoLoader);
        
        console.log('🗜️ Draco decoder configurato');
    }

    /**
     * Carica un modello GLTF/GLB
     * @param {string} path - Percorso del file
     * @param {Function} onProgress - Callback per il progresso
     * @returns {Promise<GLTF>}
     */
    loadGLTF(path, onProgress = null) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                path,
                (gltf) => {
                    console.log(`✅ Modello caricato: ${path}`);
                    resolve(gltf);
                },
                (xhr) => {
                    const progress = xhr.loaded / xhr.total;
                    if (onProgress) {
                        onProgress(progress);
                    }
                    console.log(`📊 Caricamento: ${Math.round(progress * 100)}%`);
                },
                (error) => {
                    console.error(`❌ Errore nel caricamento di ${path}:`, error);
                    reject(error);
                }
            );
        });
    }

    /**
     * Carica una texture
     * @param {string} path - Percorso della texture
     * @returns {Promise<THREE.Texture>}
     */
    loadTexture(path) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                path,
                (texture) => {
                    console.log(`✅ Texture caricata: ${path}`);
                    resolve(texture);
                },
                undefined,
                (error) => {
                    console.error(`❌ Errore nel caricamento della texture ${path}:`, error);
                    reject(error);
                }
            );
        });
    }

    /**
     * Carica multiple texture in parallelo
     * @param {Array<string>} paths - Array di percorsi
     * @returns {Promise<Array<THREE.Texture>>}
     */
    async loadTextures(paths) {
        const promises = paths.map(path => this.loadTexture(path));
        return Promise.all(promises);
    }
}
