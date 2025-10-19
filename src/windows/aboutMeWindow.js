/**
 * AboutMeWindow - Finestra About Me con typing effect
 */
export function createAboutMeContent(theme = 'dark') {
    const isDark = theme === 'dark';
    
    return `
        <div style="
            display: flex;
            flex-direction: column;
            gap: 25px;
            height: 100%;
            overflow-y: auto;
        ">
            <!-- Header -->
            <div style="
                text-align: center;
                padding-bottom: 15px;
                border-bottom: 2px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            ">
                <h1 style="
                    margin: 0 0 10px 0;
                    font-size: 32px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #60a5fa, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">Chi Sono</h1>
                <p style="
                    margin: 0;
                    font-size: 16px;
                    color: ${isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
                    font-weight: 500;
                ">Gianluca Giaffreda</p>
            </div>

            <!-- Content con typing effect -->
            <div style="
                flex: 1;
                line-height: 1.8;
            ">
                <!-- Sezione Presentazione -->
                <div style="margin-bottom: 30px;">
                    <h2 style="
                        color: ${isDark ? '#60a5fa' : '#1e40af'};
                        font-size: 20px;
                        margin: 0 0 12px 0;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i data-lucide="user" style="width: 20px; height: 20px;"></i>
                        Presentazione
                    </h2>
                    <p id="typing-text-1" class="typing-text" data-text="Sono un ragazzo appassionato di informatica e computer, con una forte propensione al lavoro di gruppo. Le mie competenze derivano da interessi personali e da un percorso di apprendimento autodidatta nell'ambiente informatico, arricchito dalla formazione presso il corso ITS TechTalentFactory." style="
                        color: ${isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'};
                        font-size: 15px;
                        margin: 0;
                        min-height: 60px;
                    "></p>
                </div>

                <!-- Sezione Obiettivi -->
                <div style="margin-bottom: 30px;">
                    <h2 style="
                        color: ${isDark ? '#a78bfa' : '#5b21b6'};
                        font-size: 20px;
                        margin: 0 0 12px 0;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i data-lucide="target" style="width: 20px; height: 20px;"></i>
                        Obiettivi Professionali
                    </h2>
                    <p id="typing-text-2" class="typing-text" data-text="Il mio obiettivo principale è lo sviluppo di Assistenti AI per qualsiasi utilizzo quotidiano o ludico. Sono affascinato dalle potenzialità dell'intelligenza artificiale e dal suo impatto nella vita di tutti i giorni." style="
                        color: ${isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'};
                        font-size: 15px;
                        margin: 0;
                        min-height: 45px;
                    "></p>
                </div>

                <!-- Sezione Formazione -->
                <div style="margin-bottom: 30px;">
                    <h2 style="
                        color: ${isDark ? '#34d399' : '#059669'};
                        font-size: 20px;
                        margin: 0 0 12px 0;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i data-lucide="graduation-cap" style="width: 20px; height: 20px;"></i>
                        Percorso Formativo
                    </h2>
                    <p id="typing-text-3" class="typing-text" data-text="Ho completato il corso ITS TechTalentFactory, dove ho consolidato e ampliato le mie conoscenze tecniche. Il mio approccio autodidatta mi ha permesso di esplorare autonomamente diverse tecnologie e linguaggi di programmazione." style="
                        color: ${isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'};
                        font-size: 15px;
                        margin: 0;
                        min-height: 60px;
                    "></p>
                </div>

                <!-- Sezione Interessi -->
                <div style="margin-bottom: 30px;">
                    <h2 style="
                        color: ${isDark ? '#f472b6' : '#be185d'};
                        font-size: 20px;
                        margin: 0 0 12px 0;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i data-lucide="heart" style="width: 20px; height: 20px;"></i>
                        Passioni e Hobby
                    </h2>
                    <p id="typing-text-4" class="typing-text" data-text="Nel tempo libero mi dedico a diverse passioni: amo giocare e analizzare videogiochi nelle loro meccaniche e narrativa, ascolto e analizzo musica spaziando tra i generi più disparati, e colleziono carte. Sono un grande amante dei viaggi e delle escursioni nella natura, dove ricerco un contatto diretto con l'ambiente. Un'altra mia grande passione è la cucina e l'esplorazione culinaria." style="
                        color: ${isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'};
                        font-size: 15px;
                        margin: 0;
                        min-height: 90px;
                    "></p>
                </div>

                <!-- Sezione Skills Summary -->
                <div style="
                    background: ${isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(96, 165, 250, 0.15)'};
                    border-left: 4px solid #60a5fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 30px;
                ">
                    <h3 style="
                        color: ${isDark ? '#60a5fa' : '#1e40af'};
                        font-size: 18px;
                        margin: 0 0 15px 0;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i data-lucide="zap" style="width: 18px; height: 18px;"></i>
                        In Sintesi
                    </h3>
                    <ul style="
                        margin: 0;
                        padding-left: 20px;
                        color: ${isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
                        font-size: 14px;
                        line-height: 2;
                    ">
                        <li>Appassionato di tecnologia e sviluppo AI</li>
                        <li>Formazione ITS TechTalentFactory</li>
                        <li>Forte attitudine al lavoro di gruppo</li>
                        <li>Approccio autodidatta e curiosità continua</li>
                        <li>Equilibrio tra professione e passioni personali</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

/**
 * Inizializza typing effect per gli elementi
 */
export function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    const typingSpeed = 30; // millisecondi per carattere
    const delayBetweenSections = 300; // delay tra una sezione e l'altra
    
    let currentIndex = 0;

    function typeText(element, text, callback) {
        let charIndex = 0;
        element.textContent = '';
        
        // Aggiungi cursore
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.cssText = `
            animation: blink 1s infinite;
            margin-left: 2px;
        `;
        element.appendChild(cursor);
        
        // Aggiungi animazione blink per cursore
        if (!document.getElementById('typing-cursor-style')) {
            const style = document.createElement('style');
            style.id = 'typing-cursor-style';
            style.textContent = `
                @keyframes blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        const interval = setInterval(() => {
            if (charIndex < text.length) {
                element.textContent = text.substring(0, charIndex + 1);
                element.appendChild(cursor);
                charIndex++;
            } else {
                clearInterval(interval);
                // Rimuovi cursore dopo un po'
                setTimeout(() => {
                    cursor.remove();
                    if (callback) callback();
                }, 500);
            }
        }, typingSpeed);
    }

    function typeNextSection() {
        if (currentIndex < typingElements.length) {
            const element = typingElements[currentIndex];
            const text = element.dataset.text;
            
            typeText(element, text, () => {
                currentIndex++;
                setTimeout(typeNextSection, delayBetweenSections);
            });
        }
    }

    // Avvia typing effect
    setTimeout(typeNextSection, 500);
}
