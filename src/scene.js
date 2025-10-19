/**
 * Scene Setup
 * Configura la scena principale Three.js con camera, luci e ambiente
 */

import * as THREE from 'three';
import { createFloor } from './floorSetup.js';
import { createWalls } from './wallsSetup.js';

export function setupScene() {
    // Crea la scena
    const scene = new THREE.Scene();
    
    // Ambiente bianco tipo lightroom
    scene.background = new THREE.Color(0xf5f5f5); // Bianco caldo
    scene.fog = new THREE.Fog(0xf5f5f5, 20, 100); // Fog bianca distante

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,                                    // FOV
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1,                                   // Near plane
        1000                                   // Far plane
    );
    
    // Posizione iniziale: lontano dal PC, frontale (asse Z positivo)
    camera.position.set(0, 2, 15); // Centrato (x=0), altezza occhi (y=2), distante (z=15)
    camera.lookAt(0, 1.5, 0); // Guarda verso il centro del monitor

    // Luci
    setupLights(scene);

    // Pavimento con texture parquet
    createFloor(scene);

    // Pareti con pattern esagonale
    createWalls(scene);

    // Griglia di riferimento (opzionale, per debug)
    // const gridHelper = new THREE.GridHelper(20, 20);
    // scene.add(gridHelper);

    return { scene, camera };
}

function setupLights(scene) {
    // Ambient Light - luce ambiente calda tipo lightroom
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.8); // Luce calda avorio
    scene.add(ambientLight);

    // Directional Light principale - luce calda dall'alto (simula softbox studio)
    const directionalLight = new THREE.DirectionalLight(0xfff4e0, 1.2); // Luce calda giallo-arancio
    directionalLight.position.set(8, 12, 6);
    directionalLight.castShadow = true;
    
    // Ottimizzazione ombre (ombre morbide)
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    directionalLight.shadow.bias = -0.0001; // Riduci shadow acne
    
    scene.add(directionalLight);

    // Luce di riempimento (fill light) - più soft, da lato opposto
    const fillLight = new THREE.DirectionalLight(0xffeedd, 0.4);
    fillLight.position.set(-5, 8, -3);
    scene.add(fillLight);

    // Hemisphere Light - simula luce riflessa dal pavimento/soffitto
    const hemisphereLight = new THREE.HemisphereLight(
        0xffffff,  // Sky color (bianco caldo)
        0xe8dcc8,  // Ground color (parquet riflesso)
        0.6
    );
    scene.add(hemisphereLight);

    // Point Light decorativa (opzionale - luce d'accento calda)
    const accentLight = new THREE.PointLight(0xffcc99, 0.3, 15);
    accentLight.position.set(3, 4, 2);
    scene.add(accentLight);

    // Helper per visualizzare le luci (debug)
    // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
    // scene.add(directionalLightHelper);
}
