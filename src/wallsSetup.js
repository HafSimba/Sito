/**
 * Walls Setup - Pareti bianche con pannelli esagonali ornamentali 3D
 */

import * as THREE from 'three';

export function createWalls(scene) {
    const walls = new THREE.Group();
    walls.name = 'walls';

    // Dimensioni stanza
    const roomWidth = 30;
    const roomDepth = 30;
    const wallHeight = 10;

    // Materiale base pareti (bianco pastello)
    const wallBaseMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5f0, // Bianco pastello caldo
        roughness: 0.9,
        metalness: 0.05
    });

    // Parete posteriore (dietro il PC)
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, wallHeight),
        wallBaseMaterial.clone()
    );
    backWall.position.set(0, wallHeight / 2, -roomDepth / 2);
    backWall.receiveShadow = true;
    walls.add(backWall);

    // Aggiungi pannelli esagonali alla parete posteriore
    addHexagonalPanels(backWall, roomWidth, wallHeight, scene);

    // Parete sinistra
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDepth, wallHeight),
        wallBaseMaterial.clone()
    );
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomWidth / 2, wallHeight / 2, 0);
    leftWall.receiveShadow = true;
    walls.add(leftWall);

    // Aggiungi pannelli esagonali alla parete sinistra
    addHexagonalPanels(leftWall, roomDepth, wallHeight, scene);

    // Parete destra
    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDepth, wallHeight),
        wallBaseMaterial.clone()
    );
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomWidth / 2, wallHeight / 2, 0);
    rightWall.receiveShadow = true;
    walls.add(rightWall);

    // Aggiungi pannelli esagonali alla parete destra
    addHexagonalPanels(rightWall, roomDepth, wallHeight, scene);

    // Soffitto bianco
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomDepth),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.95,
            metalness: 0.0
        })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = wallHeight;
    ceiling.receiveShadow = true;
    walls.add(ceiling);

    scene.add(walls);

    console.log('🧱 Pareti bianche con pannelli esagonali 3D aggiunte');

    return walls;
}

/**
 * Aggiunge pannelli esagonali ornamentali 3D sparsi sulla parete
 */
function addHexagonalPanels(wallMesh, width, height, scene) {
    const panelsGroup = new THREE.Group();
    
    // Parametri pannelli (PIÙ GRANDI)
    const hexRadius = 0.6; // Aumentato da 0.4 a 0.6
    const hexDepth = 0.2; // Aumentato da 0.15 a 0.2
    const minSpacing = hexRadius * 3; // Spaziatura minima per evitare sovrapposizioni
    
    // Palette di colori (grigio/nero con sfumature)
    const colors = [
        0x1a1a1a, // Nero
        0x2a2a2a, // Nero-grigio scuro
        0x3a3a3a, // Grigio molto scuro
        0x4a4a4a, // Grigio scuro
        0x5a5a5a, // Grigio medio-scuro
        0x6a6a6a, // Grigio medio
        0x7a7a7a, // Grigio
        0x8a8a8a, // Grigio chiaro
        0x9a9a9a, // Grigio molto chiaro
    ];

    // Array per tenere traccia delle posizioni occupate
    const occupiedPositions = [];
    
    // Numero di tentativi per posizionare pannelli
    const maxAttempts = 200;
    const targetPanels = Math.floor((width * height) / 6); // Densità ridotta per pannelli più grandi

    for (let attempt = 0; attempt < maxAttempts && occupiedPositions.length < targetPanels; attempt++) {
        // Posizione casuale sulla parete
        const x = (Math.random() - 0.5) * width * 0.85; // Margine dal bordo
        const y = (Math.random() - 0.5) * height * 0.85;

        // Controlla se la posizione è troppo vicina ad altri pannelli
        let tooClose = false;
        for (const pos of occupiedPositions) {
            const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            if (distance < minSpacing) {
                tooClose = true;
                break;
            }
        }

        // Se non c'è sovrapposizione, crea il pannello
        if (!tooClose) {
            const hexPanel = createHexagonPanel(hexRadius, hexDepth, colors);
            hexPanel.position.set(x, y, hexDepth / 2 + 0.01);
            panelsGroup.add(hexPanel);
            
            // Salva posizione occupata
            occupiedPositions.push({ x, y });
        }
    }

    console.log(`✅ ${occupiedPositions.length} pannelli esagonali posizionati senza sovrapposizioni`);

    // Copia rotazione e posizione della parete
    panelsGroup.rotation.copy(wallMesh.rotation);
    panelsGroup.position.copy(wallMesh.position);
    
    scene.add(panelsGroup);
    
    return panelsGroup;
}

/**
 * Crea un singolo pannello esagonale 3D con profondità
 */
function createHexagonPanel(radius, depth, colorPalette) {
    // Scegli colore casuale dalla palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    
    // Crea geometria esagono estruso (con profondità)
    const shape = new THREE.Shape();
    
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        if (i === 0) {
            shape.moveTo(x, y);
        } else {
            shape.lineTo(x, y);
        }
    }
    shape.closePath();

    const extrudeSettings = {
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Materiale con proprietà fisiche (PBR)
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.6,
        metalness: 0.3,
        flatShading: false
    });

    const hexMesh = new THREE.Mesh(geometry, material);
    
    // Rotazione casuale per variazione
    hexMesh.rotation.z = Math.random() * Math.PI * 2;
    
    // Abilita ombre
    hexMesh.castShadow = true;
    hexMesh.receiveShadow = true;
    
    return hexMesh;
}

/**
 * Variante: Pattern organizzato (griglia regolare invece che casuale)
 */
export function addHexagonalPanelsGrid(wallMesh, width, height, scene) {
    const panelsGroup = new THREE.Group();
    
    const hexRadius = 0.4;
    const hexDepth = 0.15;
    const spacing = hexRadius * 2.2; // Spaziatura tra pannelli
    
    const colors = [
        0x1a1a1a, 0x2a2a2a, 0x3a3a3a, 0x4a4a4a,
        0x5a5a5a, 0x6a6a6a, 0x7a7a7a, 0x8a8a8a, 0x9a9a9a
    ];

    // Griglia regolare
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Solo alcuni esagoni vengono creati (pattern sparso)
            if (Math.random() > 0.4) continue; // 60% di probabilità di skip
            
            const x = (col - cols / 2) * spacing;
            const y = (row - rows / 2) * spacing;
            
            const hexPanel = createHexagonPanel(hexRadius, hexDepth, colors);
            hexPanel.position.set(x, y, hexDepth / 2 + 0.01);
            
            panelsGroup.add(hexPanel);
        }
    }

    panelsGroup.rotation.copy(wallMesh.rotation);
    panelsGroup.position.copy(wallMesh.position);
    
    scene.add(panelsGroup);
    
    return panelsGroup;
}
