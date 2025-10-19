/**
 * ExternalLinksWindow - Finestra con link ai social
 */
export function createExternalLinksContent(theme = 'dark') {
    const isDark = theme === 'dark';
    
    const links = [
        {
            name: 'LinkedIn',
            icon: 'linkedin',
            url: 'https://www.linkedin.com/in/gianluca-giaffreda-259056353?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            color: '#0A66C2',
            description: 'Profilo professionale'
        },
        {
            name: 'GitHub',
            icon: 'github',
            url: 'https://github.com/HafSimba',
            color: '#181717',
            description: 'Repository e progetti'
        },
        {
            name: 'Instagram',
            icon: 'instagram',
            url: 'https://www.instagram.com/haf_simba?igsh=cWtmaGdiYjExYXBs',
            color: '#E4405F',
            description: 'Profilo personale'
        }
    ];

    return `
        <div style="
            display: flex;
            flex-direction: column;
            gap: 20px;
            height: 100%;
        ">
            <div style="
                text-align: center;
                padding-bottom: 10px;
                border-bottom: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            ">
                <h2 style="
                    margin: 0 0 8px 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: ${isDark ? 'white' : '#1e293b'};
                ">I miei profili</h2>
                <p style="
                    margin: 0;
                    font-size: 14px;
                    color: ${isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
                ">Seguimi sui social network</p>
            </div>

            <div style="
                display: grid;
                grid-template-columns: 1fr;
                gap: 15px;
                flex: 1;
            ">
                ${links.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                       class="social-link"
                       style="
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        padding: 20px;
                        background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
                        border-radius: 12px;
                        text-decoration: none;
                        transition: all 0.3s ease;
                        border: 2px solid transparent;
                        cursor: pointer;
                    "
                    onmouseover="
                        this.style.background='${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}';
                        this.style.borderColor='${link.color}';
                        this.style.transform='translateY(-2px)';
                        this.querySelector('.social-icon-container').style.transform='scale(1.1)';
                        this.querySelector('.social-icon-container').style.boxShadow='0 8px 24px ${link.color}66';
                    "
                    onmouseout="
                        this.style.background='${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}';
                        this.style.borderColor='transparent';
                        this.style.transform='translateY(0)';
                        this.querySelector('.social-icon-container').style.transform='scale(1)';
                        this.querySelector('.social-icon-container').style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.3)';
                    ">
                        <div class="social-icon-container" style="
                            width: 64px;
                            height: 64px;
                            min-width: 64px;
                            background: linear-gradient(135deg, ${link.color}, ${link.color}aa);
                            border-radius: 16px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                            transition: all 0.3s ease;
                        ">
                            <i data-lucide="${link.icon}" style="width: 32px; height: 32px; color: white;"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="
                                font-size: 18px;
                                font-weight: 600;
                                color: ${isDark ? 'white' : '#1e293b'};
                                margin-bottom: 4px;
                            ">${link.name}</div>
                            <div style="
                                font-size: 13px;
                                color: ${isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
                            ">${link.description}</div>
                        </div>
                        <i data-lucide="external-link" style="
                            width: 20px;
                            height: 20px;
                            color: ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'};
                        "></i>
                    </a>
                `).join('')}
            </div>

            <div style="
                text-align: center;
                padding-top: 10px;
                border-top: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            ">
                <p style="
                    margin: 0;
                    font-size: 12px;
                    color: ${isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
                ">
                    <i data-lucide="info" style="width: 14px; height: 14px; vertical-align: middle;"></i>
                    Clicca per aprire in una nuova scheda
                </p>
            </div>
        </div>
    `;
}
