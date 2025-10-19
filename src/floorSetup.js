/**
 * Floor Setup - Pavimento con texture parquet
 */

import * as THREE from 'three';

export function createFloor(scene) {
    // Crea una texture procedurale per il parquet
    const parquetTexture = createParquetTexture();
    
    // Geometria del pavimento (grande piano)
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    
    // Materiale con texture
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: parquetTexture,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide
    });

    // Imposta ripetizione texture (per effetto parquet ripetuto)
    parquetTexture.wrapS = THREE.RepeatWrapping;
    parquetTexture.wrapT = THREE.RepeatWrapping;
    parquetTexture.repeat.set(20, 20); // 20x20 ripetizioni

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    
    // Ruota il piano per renderlo orizzontale
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    
    // Abilita le ombre
    floor.receiveShadow = true;
    
    scene.add(floor);
    
    console.log('🪵 Pavimento parquet aggiunto');
    
    return floor;
}

/**
 * Crea una texture procedurale che simula il parquet
 */
function createParquetTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Colori del parquet (tonalità legno chiaro/medio)
    const baseColor = '#c19a6b';  // Legno chiaro
    const darkColor = '#8b6f47';  // Legno scuro
    const lightColor = '#d4b896'; // Legno molto chiaro

    // Riempimento base
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Crea pattern di listelli di parquet
    const plankWidth = 128;
    const plankHeight = 512;
    
    for (let x = 0; x < 512; x += plankWidth) {
        // Alterna colori per creare variazione
        const variation = Math.random();
        if (variation > 0.6) {
            ctx.fillStyle = darkColor;
        } else if (variation > 0.3) {
            ctx.fillStyle = baseColor;
        } else {
            ctx.fillStyle = lightColor;
        }
        
        ctx.fillRect(x, 0, plankWidth - 2, plankHeight);
        
        // Aggiungi venature del legno
        ctx.strokeStyle = darkColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < 5; i++) {
            const startY = Math.random() * 512;
            const endY = Math.random() * 512;
            
            ctx.beginPath();
            ctx.moveTo(x + Math.random() * plankWidth, startY);
            ctx.lineTo(x + Math.random() * plankWidth, endY);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;
        
        // Linea di separazione tra listelli
        ctx.strokeStyle = '#5a4a3a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + plankWidth - 1, 0);
        ctx.lineTo(x + plankWidth - 1, 512);
        ctx.stroke();
    }

    // Aggiungi un po' di rumore per realismo
    const imageData = ctx.getImageData(0, 0, 512, 512);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 20;
        data[i] += noise;     // R
        data[i + 1] += noise; // G
        data[i + 2] += noise; // B
    }
    
    ctx.putImageData(imageData, 0, 0);

    // Crea texture da canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
}

/**
 * Alternativa: Carica texture parquet da URL esterno (se preferisci)
 * Puoi usare textures da Poly Haven, Textures.com, etc.
 */
export async function createFloorWithExternalTexture(scene, textureLoader) {
    // Esempio con URL texture gratuita
    const textureUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/hardwood2_diffuse.jpg';
    
    try {
        const texture = await textureLoader.loadTexture(textureUrl);
        
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        
        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        
        scene.add(floor);
        
        console.log('🪵 Pavimento con texture esterna aggiunto');
        
        return floor;
    } catch (error) {
        console.warn('⚠️ Impossibile caricare texture esterna, uso procedurale');
        return createFloor(scene);
    }
}
