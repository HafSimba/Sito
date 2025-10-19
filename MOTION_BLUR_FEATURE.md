# 🎬 Motion Blur Feature

## 📋 Panoramica

Effetto cinematografico di **motion blur** applicato durante le animazioni della camera per rendere i movimenti più fluidi e realistici, simile a quello che si vede nei film.

---

## ✨ Quando si attiva

### 1️⃣ **Primo Zoom (Click START)**
```
⏱️ Durata: 3 secondi
🎬 Motion Blur: Attivo (strength 0.7)
📹 Camera: Zoom frontale al monitor
✅ Fine: Motion blur disattivato
```

### 2️⃣ **Zoom Estremo (Click Monitor)**
```
⏱️ Durata: 2 secondi
🎬 Motion Blur: Attivo (strength 0.7)
📹 Camera: Avvicinamento estremo (Z → 0.1)
✅ Fine: Motion blur disattivato
```

---

## 🔧 Implementazione Tecnica

### **File Creato**

#### `src/motionBlurPass.js` (NUOVO)
Custom post-processing pass per Three.js che crea motion blur **accumulativo**:

**Principio di funzionamento:**
1. Salva frame corrente in `prevRenderTarget`
2. Blenda frame corrente con frame precedente
3. Formula: `mix(currentFrame, previousFrame, strength)`

**Parametri:**
- `strength` (0-1): Intensità del blur
  - `0.0` = No blur
  - `0.5` = Blur medio
  - `0.7` = **Default** (cinematografico)
  - `0.9` = Blur estremo

**Metodi:**
```javascript
motionBlurPass.activate()        // Attiva effetto
motionBlurPass.deactivate()      // Disattiva effetto
motionBlurPass.setStrength(0.5)  // Cambia intensità
motionBlurPass.setSize(w, h)     // Ridimensiona
```

---

## 📊 Timeline Completa

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLICK START (t=0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0.0s → 🎬 Motion blur ATTIVO (strength 0.7)
0.0s → 🌫️ Dissolvi blur statico (strength 5→0 in 2s)
0.0s → 📹 Camera zoom (3s)
3.0s → 🎬 Motion blur DISATTIVATO
3.0s → 🖥️ Boot sequence desktop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLICK MONITOR (t=0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0.0s → 🎬 Motion blur ATTIVO (strength 0.7)
0.0s → 📹 Camera zoom estremo (2s, Z → 0.1)
2.0s → 🎬 Motion blur DISATTIVATO
2.0s → 🌅 Fade out scena 3D
3.0s → 🖥️ Desktop fullscreen
```

---

## 🎨 Shader Custom

### **Vertex Shader**
```glsl
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

### **Fragment Shader**
```glsl
uniform sampler2D tDiffuse;    // Frame corrente
uniform sampler2D tPrev;       // Frame precedente
uniform float strength;        // Intensità blur

varying vec2 vUv;

void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec4 prevTexel = texture2D(tPrev, vUv);
    
    // Blenda frame corrente con precedente
    gl_FragColor = mix(texel, prevTexel, strength);
}
```

---

## 📝 Codice Integrazione

### **main.js - Setup**
```javascript
import { MotionBlurPass } from './motionBlurPass.js';

// Constructor
this.motionBlurPass = null;

// setupPostProcessing()
this.motionBlurPass = new MotionBlurPass(0.7);
this.composer.addPass(this.motionBlurPass);
```

### **main.js - Attivazione/Disattivazione**
```javascript
// Attiva durante animazione
if (this.motionBlurPass) {
    this.motionBlurPass.activate();
}

// Disattiva dopo animazione
setTimeout(() => {
    if (this.motionBlurPass) {
        this.motionBlurPass.deactivate();
    }
}, 3000);
```

---

## 🎯 Vantaggi

### **Realismo Cinematografico**
- ✅ Movimenti più fluidi e naturali
- ✅ Simula la persistenza della retina umana
- ✅ Nasconde microjitter e stuttering

### **Performance**
- ✅ Shader semplice e ottimizzato
- ✅ Solo 1 render target extra
- ✅ Attivato solo durante animazioni (non sempre)

### **Controllo Granulare**
- ✅ Attiva/disattiva on-demand
- ✅ Strength regolabile in runtime
- ✅ Non interferisce con altri effetti

---

## 🛠️ Personalizzazione

### **Cambia Intensità Blur**
```javascript
// motionBlurPass.js - Constructor
this.motionBlurPass = new MotionBlurPass(0.5); // Più leggero
this.motionBlurPass = new MotionBlurPass(0.9); // Più intenso
```

### **Cambia Durata Effetto**
```javascript
// main.js - onStartClick()
setTimeout(() => {
    this.motionBlurPass.deactivate();
}, 2000); // Disattiva dopo 2s invece di 3s
```

### **Motion Blur Permanente**
```javascript
// setupPostProcessing()
this.motionBlurPass = new MotionBlurPass(0.3);
this.motionBlurPass.activate(); // Sempre attivo (leggero)
```

---

## 🔍 Console Logs

### **Sequenza Normale**
```
🎨 Post-processing configurato (blur iniziale + motion blur)
🎬 Inizio animazione zoom frontale...
🎬 Motion blur attivato
[...3 secondi...]
🎬 Motion blur disattivato
[...click monitor...]
🎬 Motion blur attivato
[...2 secondi...]
🎬 Motion blur disattivato
```

---

## ⚡ Performance Note

### **Costo Rendering**
- **WebGLRenderTarget**: 1 buffer extra (dimensioni schermo)
- **Shader**: 2 texture lookup + 1 mix operation
- **Impatto FPS**: < 5% (su GPU moderne)

### **Ottimizzazioni**
- Blur attivo **solo durante animazioni** (non sempre)
- Render target riutilizzato tra frame
- Shader molto semplice (no loop, no branching)

---

## 🎮 Confronto Prima/Dopo

### **PRIMA (senza motion blur)**
```
📹 Camera si muove → Movimento "a scatti"
👁️ Percezione: Meccanico, digitale
```

### **DOPO (con motion blur)**
```
📹 Camera si muove → Scia fluida di movimento
👁️ Percezione: Cinematografico, naturale
🎬 Effetto: Come un film vero
```

---

## 🚀 Possibili Estensioni

### **1. Motion Blur Direzionale**
Blur lungo la direzione del movimento (più realistico):
```javascript
// Calcola velocità camera
const velocity = camera.position.clone().sub(prevPosition);
// Applica blur lungo velocity vector
```

### **2. Motion Blur Variabile**
Intensità proporzionale alla velocità:
```javascript
const speed = camera.position.distanceTo(prevPosition);
motionBlurPass.setStrength(Math.min(speed * 0.5, 0.9));
```

### **3. Motion Blur per Oggetti**
Blur solo su oggetti in movimento (camera ferma):
```javascript
// Per ogni oggetto animato
object.userData.velocity = calculateVelocity(object);
// Applica blur selettivo nello shader
```

---

## ✅ Testing Checklist

- [x] Motion blur attivato correttamente durante zoom
- [x] Motion blur disattivato dopo animazione
- [x] No artifact visibili (ghosting controllato)
- [x] Performance accettabili (>30 FPS)
- [ ] Test su diversi browser
- [ ] Test su mobile
- [ ] Test con GPU integrata (Intel HD)

---

## 📚 Riferimenti Tecnici

### **Mix Function**
```glsl
// GLSL built-in
mix(a, b, t) = a * (1 - t) + b * t

// Esempi:
mix(current, prev, 0.0) = current  // No blur
mix(current, prev, 0.5) = 50% blur
mix(current, prev, 1.0) = prev     // Full previous
```

### **Render Target**
```javascript
new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearFilter,  // Smooth sampling
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat        // 4 canali (RGBA)
});
```

---

**Ultima modifica**: 18 Ottobre 2025  
**Versione**: 1.0.0  
**Stato**: ✅ Implementato e funzionante
