/**
 * Motion Blur Pass (Custom)
 * Crea un effetto motion blur accumulando frame precedenti
 */

import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import * as THREE from 'three';

export class MotionBlurPass extends Pass {
    constructor(strength = 0.5) {
        super();

        this.strength = strength;
        this.isActive = false;

        // Shader per blendare frame corrente con frame precedente
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                'tDiffuse': { value: null },
                'tPrev': { value: null },
                'strength': { value: this.strength }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform sampler2D tPrev;
                uniform float strength;
                varying vec2 vUv;

                void main() {
                    vec4 texel = texture2D(tDiffuse, vUv);
                    vec4 prevTexel = texture2D(tPrev, vUv);
                    
                    // Blenda frame corrente con frame precedente
                    gl_FragColor = mix(texel, prevTexel, strength);
                }
            `
        });

        // Render target per frame precedente
        this.prevRenderTarget = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            }
        );

        // Camera e scena per il quad fullscreen
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
        this.quad.frustumCulled = false;
        this.scene.add(this.quad);
    }

    render(renderer, writeBuffer, readBuffer) {
        if (!this.isActive) {
            // Se non attivo, passa solo il frame corrente
            if (this.renderToScreen) {
                renderer.setRenderTarget(null);
            } else {
                renderer.setRenderTarget(writeBuffer);
                if (this.clear) renderer.clear();
            }
            
            this.material.uniforms.tDiffuse.value = readBuffer.texture;
            this.material.uniforms.tPrev.value = readBuffer.texture;
            this.material.uniforms.strength.value = 0; // No blur
            
            renderer.render(this.scene, this.camera);
            return;
        }

        // Motion blur attivo
        this.material.uniforms.tDiffuse.value = readBuffer.texture;
        this.material.uniforms.tPrev.value = this.prevRenderTarget.texture;
        this.material.uniforms.strength.value = this.strength;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
        }

        renderer.render(this.scene, this.camera);

        // Copia frame corrente nel render target per il prossimo frame
        const tempTarget = writeBuffer.clone();
        renderer.setRenderTarget(this.prevRenderTarget);
        this.material.uniforms.tDiffuse.value = readBuffer.texture;
        this.material.uniforms.tPrev.value = readBuffer.texture;
        this.material.uniforms.strength.value = 0;
        renderer.render(this.scene, this.camera);
    }

    setSize(width, height) {
        this.prevRenderTarget.setSize(width, height);
    }

    activate() {
        this.isActive = true;
        console.log('🎬 Motion blur attivato');
    }

    deactivate() {
        this.isActive = false;
        console.log('🎬 Motion blur disattivato');
    }

    setStrength(value) {
        this.strength = value;
        this.material.uniforms.strength.value = value;
    }

    dispose() {
        this.material.dispose();
        this.prevRenderTarget.dispose();
        this.quad.geometry.dispose();
    }
}
