/**
 * Contacts Window
 * Finestra per i contatti con effetto typing e link funzionali
 */

export function createContactsContent(theme) {
  const isDark = theme === 'dark';
  
  return `
    <div style="
      height: 100%;
      overflow-y: auto;
      padding: 30px;
      background: ${isDark ? '#1a1a2e' : '#f8f9fa'};
      color: ${isDark ? '#e0e0e0' : '#2c3e50'};
      font-family: 'Segoe UI', system-ui, sans-serif;
    ">
      <!-- Header -->
      <div style="
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 2px solid ${isDark ? '#3a3a5a' : '#dee2e6'};
      ">
        <div style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin-bottom: 20px;
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        ">
          <i data-lucide="mail" style="width: 40px; height: 40px; color: white;"></i>
        </div>
        <h2 style="
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        ">Contatti</h2>
      </div>

      <!-- Intro Text with Typing Effect -->
      <div style="margin-bottom: 40px;">
        <p class="typing-text" data-text="Sono sempre disponibile per nuove opportunità e collaborazioni. Sentiti libero di contattarmi attraverso uno dei seguenti canali:" style="
          font-size: 16px;
          line-height: 1.8;
          color: ${isDark ? '#b0b0b0' : '#495057'};
          min-height: 50px;
        "></p>
      </div>

      <!-- Contact Cards -->
      <div style="
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-width: 600px;
        margin: 0 auto;
      ">
        <!-- Email Card -->
        <a href="mailto:gianlugiaffreda@gmail.com" style="
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: ${isDark ? '#2a2a3e' : '#ffffff'};
          border-radius: 16px;
          border: 2px solid ${isDark ? '#3a3a5a' : '#e9ecef'};
          text-decoration: none;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        " class="contact-card">
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 12px;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
          ">
            <i data-lucide="mail" style="width: 30px; height: 30px; color: white;"></i>
          </div>
          <div style="flex: 1;">
            <div style="
              font-size: 14px;
              font-weight: 600;
              color: ${isDark ? '#888' : '#6c757d'};
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            ">Email</div>
            <div class="typing-text" data-text="gianlugiaffreda@gmail.com" style="
              font-size: 18px;
              font-weight: 600;
              color: ${isDark ? '#e0e0e0' : '#2c3e50'};
              word-break: break-all;
              min-height: 27px;
            "></div>
          </div>
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: ${isDark ? '#3a3a5a' : '#f8f9fa'};
            border-radius: 10px;
            flex-shrink: 0;
          ">
            <i data-lucide="arrow-right" style="width: 20px; height: 20px; color: ${isDark ? '#b0b0b0' : '#6c757d'};"></i>
          </div>
        </a>

        <!-- Phone Card -->
        <a href="tel:+393450333502" style="
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: ${isDark ? '#2a2a3e' : '#ffffff'};
          border-radius: 16px;
          border: 2px solid ${isDark ? '#3a3a5a' : '#e9ecef'};
          text-decoration: none;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        " class="contact-card">
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            border-radius: 12px;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
          ">
            <i data-lucide="phone" style="width: 30px; height: 30px; color: white;"></i>
          </div>
          <div style="flex: 1;">
            <div style="
              font-size: 14px;
              font-weight: 600;
              color: ${isDark ? '#888' : '#6c757d'};
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            ">Telefono</div>
            <div class="typing-text" data-text="+39 345 033 3502" style="
              font-size: 18px;
              font-weight: 600;
              color: ${isDark ? '#e0e0e0' : '#2c3e50'};
              min-height: 27px;
            "></div>
          </div>
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: ${isDark ? '#3a3a5a' : '#f8f9fa'};
            border-radius: 10px;
            flex-shrink: 0;
          ">
            <i data-lucide="arrow-right" style="width: 20px; height: 20px; color: ${isDark ? '#b0b0b0' : '#6c757d'};"></i>
          </div>
        </a>
      </div>

      <!-- Info Text -->
      <div style="
        margin-top: 40px;
        padding: 20px;
        background: ${isDark ? '#2a2a3e' : '#e7f3ff'};
        border-left: 4px solid #667eea;
        border-radius: 8px;
      ">
        <p class="typing-text" data-text="Clicca sull'email per aprire il tuo client di posta preferito, oppure sul numero di telefono per chiamare direttamente da mobile." style="
          font-size: 14px;
          line-height: 1.6;
          color: ${isDark ? '#b0b0b0' : '#495057'};
          margin: 0;
          min-height: 42px;
        "></p>
      </div>

      <!-- Response Time -->
      <div style="
        margin-top: 30px;
        text-align: center;
      ">
        <p class="typing-text" data-text="Tempo di risposta medio: 24-48 ore" style="
          font-size: 14px;
          color: ${isDark ? '#888' : '#6c757d'};
          font-style: italic;
          margin: 0;
          min-height: 21px;
        "></p>
      </div>

      <style>
        .contact-card:hover {
          transform: translateY(-4px);
          border-color: #667eea !important;
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.2) !important;
        }

        .contact-card:active {
          transform: translateY(-2px);
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .typing-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background-color: ${isDark ? '#e0e0e0' : '#2c3e50'};
          margin-left: 2px;
          animation: blink 1s infinite;
          vertical-align: middle;
        }

        @media (max-width: 480px) {
          .contact-card {
            flex-direction: column;
            text-align: center;
            gap: 16px !important;
          }
        }
      </style>
    </div>
  `;
}

/**
 * Initialize typing effect for contacts window
 */
export function initContactsTypingEffect(windowElement) {
  // Se non viene passato un context, usa il documento intero (fallback)
  const context = windowElement || document;
  const typingElements = context.querySelectorAll('.typing-text');
  let currentIndex = 0;
  let isTyping = true; // Flag per controllare se l'animazione è attiva

  function typeNextElement() {
    if (!isTyping) return;
    
    if (currentIndex >= typingElements.length) {
      return; // Tutte le animazioni completate
    }

    const element = typingElements[currentIndex];
    const text = element.getAttribute('data-text');
    
    if (!text) {
      currentIndex++;
      typeNextElement();
      return;
    }

    let charIndex = 0;
    element.textContent = '';
    
    // Aggiungi il cursore lampeggiante
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    element.appendChild(cursor);

    // Usa requestAnimationFrame per animazioni indipendenti
    let lastTime = performance.now();
    const charDuration = 8;
    
    function animate(currentTime) {
      if (!isTyping) return;
      
      const elapsed = currentTime - lastTime;
      
      if (elapsed >= charDuration) {
        if (charIndex < text.length) {
          const textNode = document.createTextNode(text[charIndex]);
          element.insertBefore(textNode, cursor);
          charIndex++;
          lastTime = currentTime;
          requestAnimationFrame(animate);
        } else {
          // Completato
          if (cursor.parentNode) {
            cursor.remove();
          }
          currentIndex++;
          setTimeout(typeNextElement, 100);
        }
      } else {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }

  // Inizia l'animazione immediatamente
  setTimeout(typeNextElement, 50);
  
  // Ritorna funzione di cleanup
  return () => {
    isTyping = false;
  };
}
