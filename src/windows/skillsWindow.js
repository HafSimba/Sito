/**
 * Skills Window
 * Finestra per le competenze tecniche con effetto typing
 */

export function createSkillsContent(theme) {
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
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          border-radius: 50%;
          margin-bottom: 20px;
          box-shadow: 0 8px 16px rgba(6, 182, 212, 0.3);
        ">
          <i data-lucide="zap" style="width: 40px; height: 40px; color: white;"></i>
        </div>
        <h2 style="
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        ">Competenze Tecniche</h2>
      </div>

      <!-- Linguaggi di Programmazione -->
      <div style="
        margin-bottom: 32px;
        padding: 24px;
        background: ${isDark ? '#2a2a3e' : '#ffffff'};
        border-radius: 12px;
        border-left: 4px solid #06b6d4;
      ">
        <h3 style="
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: ${isDark ? '#06b6d4' : '#0891b2'};
        ">
          <i data-lucide="code-2" style="width: 24px; height: 24px;"></i>
          Linguaggi di Programmazione
        </h3>
        <p class="typing-text" data-text="Esperienza nello sviluppo con HTML, CSS, JavaScript, React, Java, C, C++, Python e PHP. Competenze trasversali nella programmazione sia front-end che back-end." style="
          font-size: 15px;
          line-height: 1.8;
          color: ${isDark ? '#b0b0b0' : '#495057'};
          margin: 0;
          min-height: 54px;
        "></p>
      </div>

      <!-- Database -->
      <div style="
        margin-bottom: 32px;
        padding: 24px;
        background: ${isDark ? '#2a2a3e' : '#ffffff'};
        border-radius: 12px;
        border-left: 4px solid #8b5cf6;
      ">
        <h3 style="
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: ${isDark ? '#8b5cf6' : '#7c3aed'};
        ">
          <i data-lucide="database" style="width: 24px; height: 24px;"></i>
          Database
        </h3>
        <p class="typing-text" data-text="Gestione e progettazione di database relazionali (SQL) e non relazionali (NoSQL) per applicazioni web e gestionali aziendali." style="
          font-size: 15px;
          line-height: 1.8;
          color: ${isDark ? '#b0b0b0' : '#495057'};
          margin: 0;
          min-height: 54px;
        "></p>
      </div>

      <!-- Hardware & Server -->
      <div style="
        margin-bottom: 32px;
        padding: 24px;
        background: ${isDark ? '#2a2a3e' : '#ffffff'};
        border-radius: 12px;
        border-left: 4px solid #10b981;
      ">
        <h3 style="
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: ${isDark ? '#10b981' : '#059669'};
        ">
          <i data-lucide="cpu" style="width: 24px; height: 24px;"></i>
          Hardware & Server
        </h3>
        <p class="typing-text" data-text="Assemblaggio e manutenzione di PC desktop. Prime esperienze nella configurazione e gestione di server per ambienti di sviluppo e produzione." style="
          font-size: 15px;
          line-height: 1.8;
          color: ${isDark ? '#b0b0b0' : '#495057'};
          margin: 0;
          min-height: 54px;
        "></p>
      </div>

      <!-- Sviluppo Web & Applicazioni -->
      <div style="
        margin-bottom: 32px;
        padding: 24px;
        background: ${isDark ? '#2a2a3e' : '#ffffff'};
        border-radius: 12px;
        border-left: 4px solid #f59e0b;
      ">
        <h3 style="
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: ${isDark ? '#f59e0b' : '#d97706'};
        ">
          <i data-lucide="globe" style="width: 24px; height: 24px;"></i>
          Sviluppo Web & Applicazioni
        </h3>
        <p class="typing-text" data-text="Realizzazione di siti portfolio, web app responsive e gestionali interni per aziende. Sviluppo full-stack con particolare attenzione all'esperienza utente." style="
          font-size: 15px;
          line-height: 1.8;
          color: ${isDark ? '#b0b0b0' : '#495057'};
          margin: 0;
          min-height: 54px;
        "></p>
      </div>

      <!-- AI & Machine Learning -->
      <div style="
        margin-bottom: 32px;
        padding: 24px;
        background: ${isDark ? '#2a2a3e' : '#ffffff'};
        border-radius: 12px;
        border-left: 4px solid #ec4899;
      ">
        <h3 style="
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: ${isDark ? '#ec4899' : '#db2777'};
        ">
          <i data-lucide="brain" style="width: 24px; height: 24px;"></i>
          AI & Machine Learning
        </h3>
        <p class="typing-text" data-text="Prime esperienze nello sviluppo e addestramento di modelli AI personalizzati. Interesse attivo nell'apprendimento automatico e nelle tecnologie emergenti." style="
          font-size: 15px;
          line-height: 1.8;
          color: ${isDark ? '#b0b0b0' : '#495057'};
          margin: 0;
          min-height: 54px;
        "></p>
      </div>

      <!-- DevOps & Environment Setup -->
      <div style="
        margin-bottom: 32px;
        padding: 24px;
        background: ${isDark ? '#2a2a3e' : '#ffffff'};
        border-radius: 12px;
        border-left: 4px solid #6366f1;
      ">
        <h3 style="
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: ${isDark ? '#6366f1' : '#4f46e5'};
        ">
          <i data-lucide="settings" style="width: 24px; height: 24px;"></i>
          DevOps & Setup
        </h3>
        <p class="typing-text" data-text="Configurazione e setup di ambienti di lavoro software, gestione di dipendenze e strumenti di sviluppo. Familiarità con workflow di deployment e versionamento." style="
          font-size: 15px;
          line-height: 1.8;
          color: ${isDark ? '#b0b0b0' : '#495057'};
          margin: 0;
          min-height: 54px;
        "></p>
      </div>

      <style>
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
          div[style*='padding: 30px;'] {
            padding: 20px !important;
          }
          
          div[style*='padding: 24px;'] {
            padding: 16px !important;
          }
          
          h2 {
            font-size: 24px !important;
          }
          
          h3 {
            font-size: 18px !important;
          }
        }
      </style>
    </div>
  `;
}

/**
 * Initialize typing effect for skills window
 */
export function initSkillsTypingEffect() {
  const typingElements = document.querySelectorAll('.typing-text');
  let currentIndex = 0;

  function typeNextElement() {
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

    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        // Inserisci il carattere prima del cursore
        const textNode = document.createTextNode(text[charIndex]);
        element.insertBefore(textNode, cursor);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        // Rimuovi il cursore e passa al prossimo elemento
        cursor.remove();
        currentIndex++;
        setTimeout(typeNextElement, 100); // Piccola pausa tra elementi
      }
    }, 8); // 8ms per carattere (veloce)
  }

  // Inizia l'animazione dopo un piccolo delay
  setTimeout(typeNextElement, 100);
}
