/**
 * Test Scene - Scena di fallback per testare senza modello 3D
 * Crea una stanza semplice con scrivania e monitor procedurali
 */

import * as THREE from 'three';

export function createFallbackScene(scene) {
    console.log('📦 Creazione scena di fallback...');

    // Pavimento
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a3e,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Muro posteriore
    const wallGeometry = new THREE.PlaneGeometry(20, 10);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a2e 
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(0, 5, -10);
    wall.receiveShadow = true;
    scene.add(wall);

    // Scrivania
    const deskGroup = createDesk();
    deskGroup.position.set(0, 0, -5);
    scene.add(deskGroup);

    // Monitor (oggetto principale!)
    const monitor = createMonitor();
    monitor.position.set(0, 1.5, -5);
    monitor.name = 'monitor'; // IMPORTANTE per essere trovato dal main.js
    scene.add(monitor);

    // Sedia (opzionale)
    const chair = createChair();
    chair.position.set(0, 0.5, -2);
    scene.add(chair);

    // Lampada decorativa
    const lamp = createLamp();
    lamp.position.set(-2, 1.5, -5);
    scene.add(lamp);

    console.log('✅ Scena di fallback creata!');
    
    return monitor; // Ritorna il monitor per riferimento
}

function createDesk() {
    const desk = new THREE.Group();

    // Piano scrivania
    const topGeometry = new THREE.BoxGeometry(4, 0.1, 2);
    const topMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.7,
        metalness: 0.1
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 1;
    top.castShadow = true;
    top.receiveShadow = true;
    desk.add(top);

    // Gambe
    const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    
    const positions = [
        [-1.8, 0.5, -0.9],
        [1.8, 0.5, -0.9],
        [-1.8, 0.5, 0.9],
        [1.8, 0.5, 0.9]
    ];

    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        desk.add(leg);
    });

    return desk;
}

function createMonitor() {
    const monitor = new THREE.Group();
    monitor.name = 'monitor';

    // Base
    const baseGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.3;
    monitor.add(base);

    // Supporto
    const standGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
    const stand = new THREE.Mesh(standGeometry, baseMaterial);
    stand.position.y = 0;
    monitor.add(stand);

    // Schermo
    const screenGeometry = new THREE.BoxGeometry(1.6, 0.9, 0.05);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        metalness: 0.5,
        roughness: 0.3
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0.3, 0);
    screen.name = 'screen'; // Questo verrà usato per la texture
    screen.castShadow = true;
    monitor.add(screen);

    // Cornice schermo
    const frameGeometry = new THREE.BoxGeometry(1.7, 1, 0.1);
    const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.7,
        roughness: 0.3
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 0.3, -0.03);
    monitor.add(frame);

    return monitor;
}

function createChair() {
    const chair = new THREE.Group();

    // Seduta
    const seatGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    const seatMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.6
    });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.castShadow = true;
    chair.add(seat);

    // Schienale
    const backGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1);
    const back = new THREE.Mesh(backGeometry, seatMaterial);
    back.position.set(0, 0.4, -0.3);
    back.castShadow = true;
    chair.add(back);

    // Gambe (stella a 5 punte)
    const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x666666,
        metalness: 0.8
    });

    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(
            Math.cos(angle) * 0.3,
            -0.25,
            Math.sin(angle) * 0.3
        );
        leg.rotation.x = Math.PI / 6;
        leg.rotation.y = angle;
        chair.add(leg);
    }

    return chair;
}

function createLamp() {
    const lamp = new THREE.Group();

    // Base
    const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        metalness: 0.8
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    lamp.add(base);

    // Braccio
    const armGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
    const arm = new THREE.Mesh(armGeometry, baseMaterial);
    arm.position.y = 0.4;
    arm.rotation.z = Math.PI / 6;
    lamp.add(arm);

    // Lampada
    const shadeGeometry = new THREE.ConeGeometry(0.15, 0.2, 32);
    const shadeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x667eea,
        emissive: 0x667eea,
        emissiveIntensity: 0.5
    });
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    shade.position.set(0.3, 0.7, 0);
    shade.rotation.z = -Math.PI / 4;
    lamp.add(shade);

    // Luce dalla lampada
    const pointLight = new THREE.PointLight(0x667eea, 0.5, 5);
    pointLight.position.set(0.3, 0.6, 0);
    lamp.add(pointLight);

    return lamp;
}
