# 🧠 Sito Portfolio 3D — Project Plan

## 🎯 Obiettivo

Realizzare un **portfolio personale interattivo** con un ambiente 3D renderizzato nel browser.  
L’utente entrerà in una **stanza 3D** con una scrivania e un PC; cliccando su **"Inizia"** la **camera** effettuerà uno zoom sullo schermo del PC, dove saranno presenti **icone interattive** che fungeranno da menu del sito (es: CV, Progetti, Contatti, ecc.).

---

## 🧩 Stack Tecnologico

| Tecnologia | Descrizione | Link ufficiale |
|-------------|--------------|----------------|
| **Three.js** | Libreria JavaScript per WebGL. Gestirà tutta la logica 3D, le animazioni, la camera e l’ottimizzazione runtime. | [threejs.org/docs](https://threejs.org/docs) |
| **GLTF / GLB** | Formato standard per modelli 3D ottimizzati per il web, supporta materiali, animazioni e texture. | [khronos.org/gltf](https://www.khronos.org/gltf) |
| **Vite / Vanilla JS** *(opzionale)* | Per gestire lo sviluppo moderno e il live reload. | [vitejs.dev](https://vitejs.dev) |

---

## 🧱 Stato Attuale del Progetto

✅ **SETUP COMPLETATO!** (2025-10-18)

📦 SitoPortfolio
┣ 📂 assets
┃ ┣ 📂 models
┃ ┃ ┗ environment.glb ← **INSERISCI QUI IL TUO MODELLO 3D**
┃ ┗ � textures
┣ 📂 src
┃ ┣ main.js ✅
┃ ┣ scene.js ✅
┃ ┣ cameraController.js ✅
┃ ┣ loader.js ✅
┃ ┗ uiScene.js ✅
┣ 📂 public
┣ index.html ✅
┣ package.json ✅
┣ vite.config.js ✅
┣ .gitignore ✅
┣ SETUP_GUIDE.md ← **Guida dettagliata setup**
┗ README.md

### 🚀 Come Avviare

```powershell
# Installa dipendenze (già fatto!)
npm install

# Avvia server di sviluppo
npm run dev

# Build produzione
npm run build
```
---

## 🧱 Architettura del Sito

### 1. Scena Iniziale
- Caricamento del modello `.glb` (`/model/environment.glb`)
- Visuale panoramica iniziale (camera statica)
- Luce principale e ambiente di base
- Oggetto principale: **monitor** che conterrà la texture dinamica

### 2. Interazione “Inizia”
- Pulsante HTML o mesh 3D cliccabile
- Al click: **animazione camera** (via codice Three.js)
- Quando la camera arriva vicino al monitor:
  - Si blocca la rotazione
  - Si attiva la mini-scena sullo schermo

### 3. UI nel Monitor — Opzione B (Render Target 3D)
- Il **monitor** diventa una **texture dinamica** che mostra una **mini-scena Three.js**:
  - Icone 3D cliccabili
  - Finestrine animate (es. CV, Progetti)
  - Interazioni con animazioni via codice
- Tutto renderizzato dentro un `WebGLRenderTarget` applicato come `map` del materiale del monitor

---

## 🎞️ Animazioni — Solo via Codice (Three.js)

Tutte le animazioni verranno scritte in JS, senza Blender:

- **Camera movement:** interpolazione `Vector3` via `gsap` o `tween.js`
- **Oggetti:** animazioni con `AnimationMixer`, oppure manuali nel render loop
- **Effetti luce/materiale:** modifiche di proprietà (`intensity`, `color`, `opacity`)

Esempi utili:
- [AnimationMixer — Three.js Docs](https://threejs.org/docs/#api/en/animation/AnimationMixer)
- [Tween.js](https://github.com/tweenjs/tween.js/)
- [GSAP](https://greensock.com/docs/)

---

## ⚙️ Ottimizzazione via Codice

Poiché non usi Blender, tutto sarà gestito runtime con Three.js:

| Ottimizzazione | Metodo / API |
|----------------|--------------|
| Riduzione draw calls | `InstancedMesh` per oggetti ripetuti |
| LOD automatico | `THREE.LOD()` |
| Texture leggere | carica `.jpg` o `.ktx2` con `TextureLoader` |
| Limitare antialias | `renderer.setPixelRatio(window.devicePixelRatio * 0.75)` |
| Evitare luci pesanti | usa una sola `DirectionalLight` + `AmbientLight` |
| Frustum culling | automatico (verifica bounding box corretto) |
| Monitor scene FPS | `renderer.info.render.calls` e `Stats.js` |

---

## 🧮 Flusso UX / UI

1. **Scena iniziale:** stanza 3D con PC e scrivania  
2. **Click “Inizia”:** camera zooma sullo schermo  
3. **Monitor attivo:** UI 3D (mini-scena render target)  
4. **Click icona:** apre finestra 3D interna  
5. **Transizioni:** gestite via GSAP o codice nativo Three.js  

---

## 🚧 Prossimi Passi (Incrementali)

| Step | Attività | Output previsto | Status |
|------|-----------|----------------|--------|
| 1 | Setup ambiente Three.js + test scena vuota | `main.js` con scena, camera, renderer | ✅ **FATTO** |
| 2 | Caricare `environment.glb` dal folder `/assets/models` | Modello visibile nel browser | ⏳ **PROSSIMO** |
| 3 | Aggiungere pulsante "Inizia" e zoom camera | Camera animata via codice | ✅ **FATTO** |
| 4 | Implementare mini-scena render target | Texture dinamica sul monitor | ✅ **FATTO** |
| 5 | Interazioni (click, hover) nel monitor | Finestrine 3D funzionanti | 🔜 TODO |
| 6 | Ottimizzazioni runtime | Framerate stabile (> 45 FPS) | 🔜 TODO |
| 7 | Deploy su GitHub Pages / Vercel | Versione pubblica del portfolio | 🔜 TODO |

### 📝 Note Step 2 (Prossimo)
**Per completare lo Step 2, devi:**
1. Inserire il file `environment.glb` nella cartella `/assets/models/`
2. Il modello deve contenere un oggetto chiamato "monitor" o "screen"
3. Dopo aver inserito il modello, esegui `npm run dev` per testarlo

---

## 📘 Risorse Ufficiali

- [Three.js Documentation](https://threejs.org/docs)
- [Three.js Examples](https://threejs.org/examples/)
- [GLTF (Khronos Group)](https://www.khronos.org/gltf)
- [Discover Three.js Guide](https://discoverthreejs.com/)
- [GSAP Docs](https://greensock.com/docs/)
- [Three.js Render Target Tutorial](https://threejs.org/manual/#en/render-targets)

---

## 🧠 Suggerimenti

- Mantieni il file `.glb` < 10 MB per caricamento rapido  
- Testa con `renderer.info.render.calls` per ridurre draw calls  
- Disattiva `OrbitControls` una volta raggiunta la posizione monitor  
- Usa `requestAnimationFrame` per controllare tutte le animazioni  
- Suddividi le logiche in file separati appena il progetto cresce  

---

**Autore:** *[tuo nome]*  
**Versione documento:** `v1.2`  
**Ultimo aggiornamento:** 2025-10-18