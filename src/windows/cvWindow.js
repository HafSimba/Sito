// CV Window Module
// This module creates the CV (Curriculum Vitae) window with profile image and typing animation

export function createCVContent(theme) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const sectionBg = isDark ? '#0f172a' : '#f8fafc';
  
  return `
    <div class="cv-window" style="
      background: ${bgColor};
      color: ${textColor};
      height: 100%;
      overflow-y: auto;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 32px;
    ">
      <!-- Download PDF Button -->
      <div style="
        position: sticky;
        top: 0;
        z-index: 100;
        background: ${bgColor};
        padding: 16px 0;
        margin-bottom: 16px;
        border-bottom: 2px solid ${borderColor};
      ">
        <button id="download-cv-pdf" style="
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          width: 100%;
          justify-content: center;
        ">
          <i data-lucide="download" style="width: 20px; height: 20px;"></i>
          <span>Scarica CV in PDF</span>
        </button>
      </div>

      <!-- Header con foto profilo -->
      <div style="
        display: flex;
        align-items: center;
        gap: 32px;
        margin-bottom: 40px;
        padding-bottom: 32px;
        border-bottom: 2px solid ${borderColor};
      ">
        <img 
          src="/images/ImmagineProfilo.jpg" 
          alt="Gianluca Giaffreda"
          style="
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #3b82f6;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          "
        />
        <div>
          <h1 class="typing-text" data-text="GIANLUCA GIAFFREDA" style="
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #3b82f6;
          "></h1>
          <h2 class="typing-text" data-text="STUDENTE ITS - FULL STACK DEVELOPER WITH CLOUD TECHNOLOGIES" style="
            font-size: 18px;
            font-weight: 500;
            margin: 0;
            color: ${textColor};
          "></h2>
        </div>
      </div>

      <!-- Contatti e Informazioni -->
      <div style="
        background: ${sectionBg};
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 32px;
        border-left: 4px solid #3b82f6;
      ">
        <h2 style="
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #3b82f6;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <i data-lucide="user" style="width: 20px; height: 20px;"></i>
          <span class="typing-text" data-text="CONTATTI E INFORMAZIONI"></span>
        </h2>
        <div style="display: grid; gap: 12px;">
          <p class="typing-text" data-text="📅 19/09/2002 MI" style="margin: 0; font-size: 15px;"></p>
          <p class="typing-text" data-text="📍 Mozzate CO 22076" style="margin: 0; font-size: 15px;"></p>
          <p class="typing-text" data-text="✉️ gianlugiaffreda@gmail.com" style="margin: 0; font-size: 15px;"></p>
          <p class="typing-text" data-text="📱 +39 345 033 3502" style="margin: 0; font-size: 15px;"></p>
          <p class="typing-text" data-text="🚗 Automunito" style="margin: 0; font-size: 15px;"></p>
        </div>
      </div>

      <!-- Lingue -->
      <div style="
        background: ${sectionBg};
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 32px;
        border-left: 4px solid #8b5cf6;
      ">
        <h2 style="
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #8b5cf6;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <i data-lucide="languages" style="width: 20px; height: 20px;"></i>
          <span class="typing-text" data-text="LINGUE"></span>
        </h2>
        <div style="display: grid; gap: 12px;">
          <p class="typing-text" data-text="🇮🇹 Italiano: Madre lingua" style="margin: 0; font-size: 15px;"></p>
          <p class="typing-text" data-text="🇬🇧 Inglese: B2" style="margin: 0; font-size: 15px;"></p>
        </div>
      </div>

      <!-- Certificato -->
      <div style="
        background: ${sectionBg};
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 32px;
        border-left: 4px solid #10b981;
      ">
        <h2 style="
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #10b981;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <i data-lucide="award" style="width: 20px; height: 20px;"></i>
          <span class="typing-text" data-text="CERTIFICATO"></span>
        </h2>
        <p class="typing-text" data-text="🏆 Certificazione First B2 Cambridge" style="margin: 0; font-size: 15px;"></p>
      </div>

      <!-- Competenze Tecniche -->
      <div style="
        background: ${sectionBg};
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 32px;
        border-left: 4px solid #f59e0b;
      ">
        <h2 style="
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #f59e0b;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <i data-lucide="code-2" style="width: 20px; height: 20px;"></i>
          <span class="typing-text" data-text="COMPETENZE TECNICHE"></span>
        </h2>
        <div style="display: grid; gap: 16px;">
          <div>
            <h4 class="typing-text" data-text="💻 Linguaggi di Programmazione" style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #06b6d4;"></h4>
            <p class="typing-text" data-text="HTML, CSS, JavaScript, React, Java, C, C++, Python, PHP" style="margin: 0; font-size: 14px;"></p>
          </div>
          <div>
            <h4 class="typing-text" data-text="🗄️ Database" style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #8b5cf6;"></h4>
            <p class="typing-text" data-text="SQL, NoSQL" style="margin: 0; font-size: 14px;"></p>
          </div>
          <div>
            <h4 class="typing-text" data-text="🖥️ Hardware & Server" style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #10b981;"></h4>
            <p class="typing-text" data-text="Assemblaggio PC, configurazione e gestione server (base)" style="margin: 0; font-size: 14px;"></p>
          </div>
          <div>
            <h4 class="typing-text" data-text="🌐 Sviluppo Web & Applicazioni" style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #f59e0b;"></h4>
            <p class="typing-text" data-text="Siti portfolio, web app responsive, gestionali interni" style="margin: 0; font-size: 14px;"></p>
          </div>
          <div>
            <h4 class="typing-text" data-text="🤖 AI & Machine Learning" style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #ec4899;"></h4>
            <p class="typing-text" data-text="Sviluppo e addestramento modelli AI (esperienza base)" style="margin: 0; font-size: 14px;"></p>
          </div>
          <div>
            <h4 class="typing-text" data-text="⚙️ DevOps & Setup" style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #6366f1;"></h4>
            <p class="typing-text" data-text="Configurazione ambienti software, deployment, versionamento" style="margin: 0; font-size: 14px;"></p>
          </div>
        </div>
      </div>

      <!-- Soft Skills -->
      <div style="
        background: ${sectionBg};
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 32px;
        border-left: 4px solid #ec4899;
      ">
        <h2 style="
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #ec4899;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <i data-lucide="heart-handshake" style="width: 20px; height: 20px;"></i>
          <span class="typing-text" data-text="SOFT SKILLS"></span>
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 8px;">
          <p class="typing-text" data-text="• Cordialità" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Problem solving" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Tecniche di negoziazione" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Utilizzo di CRM" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Multitasking" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Assistenza clienti" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Programmazione appuntamenti" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Gestione dei reclami" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Capacità comunicative" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Pazienza" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Customer service" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Predisposizione all'ascolto" style="margin: 0; font-size: 14px;"></p>
          <p class="typing-text" data-text="• Gestione delle banche dati" style="margin: 0; font-size: 14px;"></p>
        </div>
      </div>

      <!-- Esperienze Lavorative -->
      <div style="
        background: ${sectionBg};
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 32px;
        border-left: 4px solid #6366f1;
      ">
        <h2 style="
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 24px 0;
          color: #6366f1;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <i data-lucide="briefcase" style="width: 20px; height: 20px;"></i>
          <span class="typing-text" data-text="ESPERIENZE LAVORATIVE"></span>
        </h2>

        <!-- Esperienza 1 - PIÙ RECENTE -->
        <div style="margin-bottom: 24px;">
          <h3 class="typing-text" data-text="BaitService - Full Stack Developer | 07/2024 - 10/2024 | Cantalupo MI" style="
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 12px 0;
            color: ${textColor};
          "></h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li class="typing-text" data-text="Assemblaggio e manutenzione PC" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Sviluppo web di webapp" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Sviluppo di gestionali interni" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Sviluppo siti commerciali" style="margin-bottom: 0; font-size: 14px;"></li>
          </ul>
        </div>

        <!-- Esperienza 2 -->
        <div style="margin-bottom: 24px;">
          <h3 class="typing-text" data-text="LCC Srl - Operatore Telefonico | 12/2022 - 06/2024 | Gerenzano VA" style="
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 12px 0;
            color: ${textColor};
          "></h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li class="typing-text" data-text="Pianificazione di appuntamenti a supporto dei commerciali" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Effettuazione di telefonate a un elenco di clienti al fine di proporre prodotti e servizi o reperire informazioni" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Interazione con i clienti nei canali inbound e/o outbound mediante buone doti commerciali, relazionali e comunicative volte ad aumentare la customer satisfaction" style="margin-bottom: 0; font-size: 14px;"></li>
          </ul>
        </div>

        <!-- Esperienza 3 -->
        <div style="margin-bottom: 24px;">
          <h3 class="typing-text" data-text="AquaMea - Promoter | 11/2022 - 12/2022 | Rescaldina MI" style="
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 12px 0;
            color: ${textColor};
          "></h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li class="typing-text" data-text="Promozione e comunicazione a diretto contatto con il pubblico in stand, eventi e store convenzionati" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Illustrazione ed eventuale dimostrazione delle caratteristiche, dei benefici e dei vantaggi dei prodotti o dei servizi" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Analisi rapida del cliente e utilizzo del miglior approccio in base alle sue caratteristiche" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Acquisizione e caricamento di dati e anagrafiche del cliente" style="margin-bottom: 0; font-size: 14px;"></li>
          </ul>
        </div>

        <!-- Esperienza 4 -->
        <div>
          <h3 class="typing-text" data-text="Libraccio | 07/2022 - 09/2022 | Saronno VA" style="
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 12px 0;
            color: ${textColor};
          "></h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li class="typing-text" data-text="Assistenza clienti e gestione punto vendita" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Consulenza nella scelta dei prodotti" style="margin-bottom: 8px; font-size: 14px;"></li>
            <li class="typing-text" data-text="Gestione cassa e operazioni di vendita" style="margin-bottom: 0; font-size: 14px;"></li>
          </ul>
        </div>
      </div>

      <!-- Privacy -->
      <div style="
        margin-top: 40px;
        padding-top: 24px;
        border-top: 1px solid ${borderColor};
        text-align: center;
      ">
        <p class="typing-text" data-text="Autorizzo il trattamento dei dati personali contenuti nel mio curriculum vitae in base al D. Lgs. 196/2003, coordinato con il D. Lgs. 101/2018, e al Regolamento UE 2016/679." style="
          font-size: 12px;
          color: ${isDark ? '#94a3b8' : '#64748b'};
          font-style: italic;
          margin: 0;
        "></p>
      </div>

      <style>
        .cv-window::-webkit-scrollbar {
          width: 8px;
        }
        
        .cv-window::-webkit-scrollbar-track {
          background: ${isDark ? '#0f172a' : '#f1f5f9'};
        }
        
        .cv-window::-webkit-scrollbar-thumb {
          background: ${isDark ? '#475569' : '#cbd5e1'};
          border-radius: 4px;
        }
        
        .cv-window::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#64748b' : '#94a3b8'};
        }

        #download-cv-pdf:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        #download-cv-pdf:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .cv-window {
            padding: 20px;
          }
          
          .cv-window > div:first-child {
            flex-direction: column;
            text-align: center;
          }
          
          .cv-window h1 {
            font-size: 24px !important;
          }
          
          .cv-window h2 {
            font-size: 16px !important;
          }
          
          .cv-window h3 {
            font-size: 14px !important;
          }
        }
      </style>
    </div>
  `;
}

export function initCVTypingEffect(windowElement) {
  // Se non viene passato un context, usa il documento intero (fallback)
  const context = windowElement || document;
  const typingElements = context.querySelectorAll('.typing-text');
  let currentIndex = 0;
  let isTyping = true; // Flag per controllare se l'animazione è attiva

  function typeText(element, text, callback) {
    let charIndex = 0;
    element.textContent = '';
    
    // Add cursor
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.animation = 'blink 1s infinite';
    element.appendChild(cursor);
    
    const typingInterval = setInterval(() => {
      if (!isTyping) {
        clearInterval(typingInterval);
        return;
      }
      
      if (charIndex < text.length) {
        element.textContent = text.substring(0, charIndex + 1);
        element.appendChild(cursor);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        if (cursor.parentNode) {
          cursor.remove();
        }
        if (callback) callback();
      }
    }, 8); // 8ms per carattere (veloce)
  }

  function typeNextElement() {
    if (!isTyping) return;
    
    if (currentIndex < typingElements.length) {
      const element = typingElements[currentIndex];
      const text = element.getAttribute('data-text');
      
      typeText(element, text, () => {
        currentIndex++;
        setTimeout(typeNextElement, 100); // Pausa ridotta tra elementi
      });
    } else {
      // Re-initialize Lucide icons after all text is typed
      if (window.lucide && isTyping) {
        window.lucide.createIcons();
      }
    }
  }

  // Add CSS animation for cursor (solo se non esiste già)
  if (!document.getElementById('cv-typing-cursor-style')) {
    const style = document.createElement('style');
    style.id = 'cv-typing-cursor-style';
    style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  typeNextElement();
  
  // Setup PDF download button
  setupPDFDownload();
  
  // Ritorna funzione di cleanup
  return () => {
    isTyping = false;
  };
}

function setupPDFDownload() {
  const downloadBtn = document.getElementById('download-cv-pdf');
  if (!downloadBtn) return;
  
  // Click to download
  downloadBtn.addEventListener('click', () => {
    generatePDF();
  });
  
  // Re-initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function generatePDF() {
  try {
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
      alert('Errore: libreria PDF non caricata. Ricarica la pagina e riprova.');
      return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Colori
    const primaryBlue = [59, 130, 246];
    const darkText = [30, 41, 59];
    const lightGray = [148, 163, 184];
    
    let yPos = 20;
    const leftMargin = 20;
    const rightMargin = 190;
    const lineHeight = 7;
    
    // === HEADER ===
    doc.setFillColor(...primaryBlue);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('GIANLUCA GIAFFREDA', leftMargin, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('STUDENTE ITS - FULL STACK DEVELOPER', leftMargin, 28);
    doc.text('WITH CLOUD TECHNOLOGIES', leftMargin, 35);
    
    yPos = 55;
    
    // === CONTATTI ===
    doc.setTextColor(...darkText);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTATTI E INFORMAZIONI', leftMargin, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Data di nascita: 19/09/2002 - Milano', leftMargin, yPos);
    yPos += 5;
    doc.text('Residenza: Via Don Luigi Sturzo, 4 - Mozzate CO 22076', leftMargin, yPos);
    yPos += 5;
    doc.text('Email: gianlugiaffreda@gmail.com', leftMargin, yPos);
    yPos += 5;
    doc.text('Telefono: +39 345 033 3502', leftMargin, yPos);
    yPos += 5;
    doc.text('Automunito', leftMargin, yPos);
    
    yPos += 10;
    
    // === LINGUE ===
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryBlue);
    doc.text('LINGUE', leftMargin, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text('Italiano: Madre lingua', leftMargin, yPos);
    yPos += 5;
    doc.text('Inglese: B2 - Certificazione First B2 Cambridge', leftMargin, yPos);
    
    yPos += 10;
    
    // === COMPETENZE TECNICHE ===
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryBlue);
    doc.text('COMPETENZE TECNICHE', leftMargin, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text('Linguaggi di Programmazione', leftMargin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('HTML, CSS, JavaScript, React, Java, C, C++, Python, PHP', leftMargin + 5, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Database', leftMargin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('SQL, NoSQL', leftMargin + 5, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Hardware & Server', leftMargin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('Assemblaggio PC, configurazione e gestione server (base)', leftMargin + 5, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Sviluppo Web & Applicazioni', leftMargin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('Siti portfolio, web app responsive, gestionali interni', leftMargin + 5, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('AI & Machine Learning', leftMargin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('Sviluppo e addestramento modelli AI (esperienza base)', leftMargin + 5, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('DevOps & Setup', leftMargin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('Configurazione ambienti software, deployment, versionamento', leftMargin + 5, yPos);
    
    yPos += 10;
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // === ESPERIENZE LAVORATIVE ===
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryBlue);
    doc.text('ESPERIENZE LAVORATIVE', leftMargin, yPos);
    
    yPos += 8;
    
    // Esperienza 1
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text('Full Stack Developer - BaitService', leftMargin, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...lightGray);
    doc.text('07/2024 - 10/2024 | Cantalupo MI', leftMargin, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text('• Assemblaggio e manutenzione PC', leftMargin + 5, yPos);
    yPos += 5;
    doc.text('• Sviluppo web di webapp', leftMargin + 5, yPos);
    yPos += 5;
    doc.text('• Sviluppo di gestionali interni', leftMargin + 5, yPos);
    yPos += 5;
    doc.text('• Sviluppo siti commerciali', leftMargin + 5, yPos);
    
    yPos += 8;
    
    // Esperienza 2
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Operatore Telefonico - LCC Srl', leftMargin, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...lightGray);
    doc.text('12/2022 - 06/2024 | Gerenzano VA', leftMargin, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text('• Pianificazione di appuntamenti a supporto dei commerciali', leftMargin + 5, yPos);
    yPos += 5;
    const line1 = doc.splitTextToSize('• Effettuazione di telefonate per proporre prodotti e servizi', rightMargin - leftMargin - 5);
    doc.text(line1, leftMargin + 5, yPos);
    yPos += line1.length * 5;
    const line2 = doc.splitTextToSize('• Interazione con clienti per aumentare la customer satisfaction', rightMargin - leftMargin - 5);
    doc.text(line2, leftMargin + 5, yPos);
    yPos += line2.length * 5;
    
    yPos += 8;
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Esperienza 3
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Promoter - AquaMea', leftMargin, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...lightGray);
    doc.text('11/2022 - 12/2022 | Rescaldina MI', leftMargin, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text('• Promozione a diretto contatto con il pubblico', leftMargin + 5, yPos);
    yPos += 5;
    doc.text('• Illustrazione caratteristiche prodotti e servizi', leftMargin + 5, yPos);
    yPos += 5;
    doc.text('• Analisi cliente e approccio personalizzato', leftMargin + 5, yPos);
    yPos += 5;
    doc.text('• Acquisizione e caricamento dati clienti', leftMargin + 5, yPos);
    
    yPos += 8;
    
    // Esperienza 4
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Commesso - Libraccio', leftMargin, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...lightGray);
    doc.text('07/2022 - 09/2022 | Saronno VA', leftMargin, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text('• Assistenza clienti e gestione punto vendita', leftMargin + 5, yPos);
    yPos += 5;
    doc.text('• Consulenza nella scelta dei prodotti', leftMargin + 5, yPos);
    yPos += 5;
    doc.text('• Gestione cassa e operazioni di vendita', leftMargin + 5, yPos);
    
    yPos += 10;
    
    // === SOFT SKILLS ===
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryBlue);
    doc.text('SOFT SKILLS', leftMargin, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    
    const softSkills = [
      'Cordialità', 'Problem solving', 'Tecniche di negoziazione',
      'Utilizzo di CRM', 'Multitasking', 'Assistenza clienti',
      'Programmazione appuntamenti', 'Gestione dei reclami',
      'Capacità comunicative', 'Pazienza', 'Customer service',
      'Predisposizione all\'ascolto', 'Gestione delle banche dati'
    ];
    
    let col = 0;
    const colWidth = 85;
    softSkills.forEach((skill, index) => {
      doc.text('• ' + skill, leftMargin + (col * colWidth), yPos);
      if ((index + 1) % 2 === 0) {
        yPos += 5;
        col = 0;
      } else {
        col++;
      }
    });
    
    yPos += 10;
    
    // === PRIVACY ===
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...lightGray);
    const privacyText = doc.splitTextToSize(
      'Autorizzo il trattamento dei dati personali contenuti nel mio curriculum vitae in base al D. Lgs. 196/2003, coordinato con il D. Lgs. 101/2018, e al Regolamento UE 2016/679.',
      rightMargin - leftMargin
    );
    doc.text(privacyText, leftMargin, yPos);
    
    // Save the PDF
    doc.save('CV_Gianluca_Giaffreda.pdf');
    
    console.log('✅ PDF generato con successo!');
    
  } catch (error) {
    console.error('❌ Errore nella generazione del PDF:', error);
    alert('Errore durante la generazione del PDF. Controlla la console per i dettagli.');
  }
}
