# 🎨 Tutorial Panels & Blur Effect - Implementazione

## 📋 Panoramica

Implementato un sistema di tutorial con:
1. **Effetto blur iniziale** che si dissipa gradualmente
2. **Due pannelli laterali 3D** (tendine) con istruzioni

## ✨ Feature Implementate

### 1. **Effetto Blur Iniziale**

#### Come Funziona
- All'avvio, la scena appare **sfocata** (blur strength: 5)
- Quando si clicca "START", il blur si **dissolve gradualmente** in 2 secondi
- Usa **UnrealBloomPass** per creare l'effetto blur/sfocatura

#### Tecnica
```javascript
// Post-processing con EffectComposer
this.composer = new EffectComposer(this.renderer);
this.bloomPass = new UnrealBloomPass(..., blurAmount: 5, ...);

// Animazione rimozione blur
gsap.to(this, {
    blurAmount: 0,
    duration: 2,
    onUpdate: () => this.bloomPass.strength = this.blurAmount
});
```

### 2. **Tutorial Panels (Tendine Laterali)**

#### Caratteristiche
- **Due pannelli 3D** ai lati sinistro e destro
- **Background blu professionale** (#1e3a8a) semi-trasparente
- **Bordo dorato** (#fbbf24) per eleganza
- **Testo bianco** con istruzioni chiare

#### Contenuto Pannelli

**Pannello Sinistro**:
```
Benvenuto! 👋

Usa il mouse per:
• Guardarti intorno
• Esplorare lo spazio

Clicca per interagire
con gli elementi
```

**Pannello Destro**:
```
Istruzioni 📋

Desktop virtuale:
• Clicca LOGIN
• Esplora le cartelle
• CV e Progetti

Divertiti! ✨
```

#### Timeline Animazioni
```
t=0s:   Click START button
t=0s:   Inizio rimozione blur
t=1s:   Pannelli appaiono (slide-in con bounce)
t=2s:   Blur completamente rimosso
t=3s:   Boot sequence monitor inizia
t=8s:   Pannelli scompaiono (slide-out)
```

## 🎬 Sequenza Completa

```
1. Scena iniziale (sfocata)
2. User click "START"
3. ┌─ Blur inizia a dissolversi (2s)
   ├─ Camera zoom verso monitor (3s)
   ├─ Pannelli laterali appaiono (1s delay, 0.8s animation)
   └─ Boot sequence monitor (3s delay)
4. Pannelli scompaiono (8s totali)
5. Desktop operativo
```

## 🎨 Stile Pannelli

### Dimensioni
- **Larghezza**: 3 unità
- **Altezza**: 4 unità
- **Posizione**: ±6 unità dai lati della camera

### Colori
| Elemento | Colore | Hex | Opacità |
|----------|--------|-----|---------|
| Background | Blu professionale | `#1e3a8a` | 0.9 |
| Bordo | Oro | `#fbbf24` | 1.0 |
| Testo | Bianco | `#FFFFFF` | 1.0 |

### Font
- **Titolo**: Bold 42px Arial
- **Sottotitoli**: Bold 32px Arial  
- **Testo normale**: 28px Arial

## 📁 File Creati/Modificati

### Nuovo File
**`src/tutorialPanels.js`**
- Classe `TutorialPanels`
- Metodi: `createPanel()`, `show()`, `hide()`, `update()`
- Gestione completa dei pannelli laterali

### File Modificati

**`src/main.js`**
- Import `TutorialPanels`, `EffectComposer`, `RenderPass`, `UnrealBloomPass`
- Aggiunto `this.tutorialPanels`, `this.composer`, `this.bloomPass`
- Nuovo metodo `setupPostProcessing()`
- Nuovo metodo `removeBlur()`
- Modificato `onStartClick()` per gestire blur e pannelli
- Modificato `onWindowResize()` per aggiornare composer
- Modificato `animate()` per usare composer

## 🔧 Parametri Configurabili

### Effetto Blur
```javascript
// In main.js constructor
this.blurAmount = 5; // Intensità iniziale (0-10)

// In removeBlur()
duration: 2 // Durata dissoluzione blur (secondi)
```

### Tutorial Panels
```javascript
// In tutorialPanels.js - show()
duration: 0.8,          // Durata animazione apparizione
ease: 'back.out(1.7)'   // Effetto bounce

// In tutorialPanels.js - hide()
duration: 0.5,          // Durata animazione scomparsa
delay: 0.1              // Delay tra pannelli

// In main.js - onStartClick()
setTimeout(..., 1000)   // Delay apparizione pannelli (1s)
setTimeout(..., 8000)   // Delay scomparsa pannelli (8s)
```

## 🎯 Personalizzazione

### Modificare Testo Pannelli

Modifica in `src/tutorialPanels.js`:

```javascript
// Pannello sinistro
this.leftPanel = this.createPanel('left', [
    'Tuo Titolo! 👋',
    '',
    'Tua sezione:',
    '• Punto 1',
    '• Punto 2',
    // ... altro testo
]);

// Pannello destro
this.rightPanel = this.createPanel('right', [
    'Altro Titolo 📋',
    // ... altro testo
]);
```

### Modificare Colori

```javascript
// Background pannello
color: 0x1e3a8a,  // Blu professionale

// Bordo
color: 0xfbbf24,  // Oro

// Alternative:
// Blu più chiaro: 0x3b82f6
// Verde: 0x10b981
// Viola: 0x8b5cf6
```

### Modificare Timing

```javascript
// In main.js - onStartClick()

// Quando appaiono i pannelli
setTimeout(() => this.tutorialPanels.show(), 1000); // 1s

// Quando scompaiono i pannelli  
setTimeout(() => this.tutorialPanels.hide(), 8000); // 8s

// Durata blur
removeBlur() { duration: 2 } // 2s
```

## 🧪 Testing

1. **Ricarica pagina**
2. **Osserva**: Scena sfocata inizialmente
3. **Click "START"**
4. **Osserva**:
   - Blur si dissolve gradualmente
   - Pannelli appaiono ai lati dopo 1s
   - Camera si avvicina al monitor
   - Pannelli scompaiono dopo 8s totali

## 📊 Performance

- **Post-processing**: Leggero impatto sulle performance
- **Bloom Pass**: Ottimizzato per effetto blur temporaneo
- **Tutorial Panels**: 2 mesh semplici, impatto minimo

## 🔍 Debug

Console logs disponibili:
```javascript
'🎨 Post-processing configurato (blur iniziale)'
'📋 Tutorial panels inizializzati'
'🎨 Rimozione blur...'
'✅ Blur rimosso completamente'
'📋 Mostrando tutorial panels...'
'📋 Nascondendo tutorial panels...'
```

---

**Data**: 18 Ottobre 2025  
**Feature**: Tutorial Panels & Blur Effect  
**Files**: `tutorialPanels.js` (nuovo), `main.js` (modificato)
