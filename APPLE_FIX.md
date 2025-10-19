# Fix Compatibilità Apple/iOS

## Problemi Risolti

### 1. **WebGL Performance su iOS**
- ✅ Disabilitato antialiasing su iOS (risparmio GPU)
- ✅ Limitato pixelRatio a 1.5 su iOS (invece di 2-3)
- ✅ Disabilitate ombre dinamiche su iOS
- ✅ Disabilitato post-processing pesante (bloom/blur) su iOS
- ✅ Configurato `powerPreference: 'low-power'` per dispositivi Apple

### 2. **Viewport e Layout iOS Safari**
- ✅ Aggiunto `viewport-fit=cover` per notch iPhone
- ✅ Usato `-webkit-fill-available` per height corretta
- ✅ Previsto `maximum-scale=1.0` per evitare zoom indesiderato
- ✅ Aggiunto `touch-action: pan-x pan-y` per prevenire gesture iOS
- ✅ Body fixed per prevenire bounce scroll di Safari

### 3. **Touch Events**
- ✅ Già implementato supporto touch completo in `cameraController.js`
- ✅ Gestione smart tap vs drag (5px threshold)
- ✅ preventDefault() solo su drag confermato

### 4. **WebGL Context Loss**
- ✅ Aggiunto listener per `webglcontextlost`
- ✅ Auto-recovery con `forceContextRestore()`
- ✅ Error handling globale per promise rejections

### 5. **CORS e Sicurezza**
- ✅ Aggiunto `crossorigin="anonymous"` agli script esterni
- ✅ Configurato headers CORS in `vercel.json`
- ✅ Cache headers ottimizzati per assets

### 6. **Ottimizzazioni CSS Safari**
- ✅ Font stack con `-apple-system` come priorità
- ✅ `-webkit-user-select: none` per prevenire selezione
- ✅ `-webkit-tap-highlight-color: transparent`
- ✅ Supporto `-webkit-background-clip` già presente

## Testing Checklist

### iPhone/iPad (Safari)
- [ ] Sito si carica senza errori
- [ ] Animazione 3D fluida (30+ FPS)
- [ ] Bottone "Inizia" funziona
- [ ] Touch per ruotare camera funziona
- [ ] Click su "Ho Capito" funziona
- [ ] Desktop UI appare dopo zoom
- [ ] Tutte le finestre draggabili
- [ ] PDF download funziona
- [ ] Nessun bounce scroll

### macOS (Safari)
- [ ] WebGL si carica correttamente
- [ ] Post-processing attivo (bloom/blur)
- [ ] Mouse control funziona
- [ ] Performance fluide

## Debug su iOS

Se il sito non si carica, controllare:

1. **Console Safari iOS**:
   - Collega iPhone/iPad al Mac
   - Apri Safari su Mac → Develop → [Nome dispositivo] → [Tab sito]
   - Controlla errori console

2. **Memoria**:
   - iOS ha limite ~300MB per tab Safari
   - Se superi, browser forza reload
   - Controlla con Safari Web Inspector

3. **WebGL Support**:
   - Testa su https://get.webgl.org/
   - Se fallisce, problema hardware/iOS version

## Versioni iOS Supportate

- ✅ iOS 15+ (consigliato)
- ⚠️ iOS 13-14 (limitato, performance ridotte)
- ❌ iOS 12 e precedenti (WebGL2 non garantito)

## Note

- Su iOS il sito usa rendering semplificato (no shadows, no post-processing)
- Questo migliora notevolmente FPS e riduce memory usage
- L'esperienza visiva è comunque ottima, solo meno effetti
