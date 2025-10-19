/**
 * Desktop Fullscreen Mode
 * Desktop virtuale in stile Windows con taskbar, icone e menu
 */

import { WindowManager } from './windowManager.js';
import { createExternalLinksContent } from './windows/externalLinksWindow.js';
import { createAboutMeContent, initTypingEffect } from './windows/aboutMeWindow.js';
import { createContactsContent, initContactsTypingEffect } from './windows/contactsWindow.js';
import { createSkillsContent, initSkillsTypingEffect } from './windows/skillsWindow.js';
import { createCVContent, initCVTypingEffect } from './windows/cvWindow.js';

export class DesktopFullscreen {
    constructor() {
        this.container = null;
        this.isActive = false;
        this.theme = 'dark'; // 'dark' o 'light'
        this.menuOpen = false;
        this.aiChatOpen = false;
        this.windowManager = new WindowManager(this.theme, (windows) => {
            this.updateTaskbarWindows(windows);
        });
        
        this.init();
    }

    init() {
        // Crea container per desktop fullscreen
        this.container = document.createElement('div');
        this.container.id = 'desktop-fullscreen';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1e3a8a;
            display: none;
            z-index: 10000;
            opacity: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        document.body.appendChild(this.container);
        
        this.createDesktopUI();
        this.setupEventListeners();
    }

    createDesktopUI() {
        this.container.innerHTML = `
            <!-- Desktop Icons Area -->
            <div id="desktop-icons" style="
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 80px;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(90px, 100px));
                grid-auto-rows: 100px;
                gap: 15px;
                align-content: start;
                padding: 10px;
                overflow-y: auto;
            ">
                ${this.createDesktopIcon('folder', 'Progetti', 0, '#60a5fa')}
                ${this.createDesktopIcon('file-text', 'CV', 1, '#a78bfa')}
                ${this.createDesktopIcon('mail', 'Contatti', 2, '#34d399')}
                ${this.createDesktopIcon('user', 'About Me', 3, '#fbbf24')}
                ${this.createDesktopIcon('code', 'Skills', 4, '#fb923c')}
            </div>

            <!-- Taskbar -->
            <div id="taskbar" style="
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 60px;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(20px);
                display: flex;
                align-items: center;
                padding: 0 10px;
                gap: 10px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                transform: translateY(100%);
                z-index: 900;
            ">
                <!-- Start Menu Button -->
                <button id="start-menu-btn" style="
                    width: 48px;
                    height: 48px;
                    min-width: 48px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                " onmouseover="this.style.background='rgba(255,255,255,0.2)'" 
                   onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    <i data-lucide="menu" style="width: 24px; height: 24px;"></i>
                </button>

                <!-- AI Assistant Button -->
                <button id="ai-assistant-btn" style="
                    width: 48px;
                    height: 48px;
                    min-width: 48px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    position: relative;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(102, 126, 234, 0.5)'" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'">
                    <i data-lucide="bot" style="width: 24px; height: 24px;"></i>
                    <!-- Indicatore "coming soon" -->
                    <div style="
                        position: absolute;
                        top: -6px;
                        right: -6px;
                        width: 18px;
                        height: 18px;
                        background: #ef4444;
                        border-radius: 50%;
                        border: 2px solid rgba(0, 0, 0, 0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: bold;
                    ">!</div>
                </button>

                <!-- AI Chat Box (hidden by default) -->
                <div id="ai-chat-box" style="
                    position: absolute;
                    bottom: 70px;
                    left: 70px;
                    width: 400px;
                    max-width: calc(100vw - 90px);
                    height: 500px;
                    max-height: calc(100vh - 150px);
                    background: rgba(20, 20, 40, 0.98);
                    backdrop-filter: blur(30px);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: none;
                    flex-direction: column;
                    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
                    transform: scale(0.95);
                    transform-origin: bottom left;
                    opacity: 0;
                    transition: all 0.3s ease;
                    z-index: 1000;
                ">
                    <!-- Chat Header -->
                    <div style="
                        padding: 20px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
                        border-radius: 16px 16px 0 0;
                    ">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="
                                width: 40px;
                                height: 40px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <i data-lucide="bot" style="width: 24px; height: 24px; color: white;"></i>
                            </div>
                            <div>
                                <h3 style="
                                    color: white;
                                    margin: 0;
                                    font-size: 16px;
                                    font-weight: 600;
                                ">Bittron AI</h3>
                                <p style="
                                    color: rgba(255, 255, 255, 0.6);
                                    margin: 0;
                                    font-size: 12px;
                                ">Il mio assistente virtuale</p>
                            </div>
                        </div>
                        <button id="close-ai-chat-btn" style="
                            width: 32px;
                            height: 32px;
                            background: rgba(255, 255, 255, 0.1);
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='rgba(255,255,255,0.2)'" 
                           onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                            <i data-lucide="x" style="width: 18px; height: 18px; color: white;"></i>
                        </button>
                    </div>

                    <!-- Chat Content -->
                    <div style="
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 40px;
                        text-align: center;
                    ">
                        <div style="
                            width: 120px;
                            height: 120px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 24px;
                            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
                        ">
                            <i data-lucide="bot" style="width: 64px; height: 64px; color: white;"></i>
                        </div>
                        
                        <h2 style="
                            color: white;
                            font-size: 24px;
                            font-weight: 700;
                            margin: 0 0 12px 0;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                        ">Bittron Coming Soon</h2>
                        
                        <p style="
                            color: rgba(255, 255, 255, 0.7);
                            font-size: 16px;
                            line-height: 1.6;
                            margin: 0 0 24px 0;
                        ">Il mio assistente AI personale<br/>sarà presto disponibile per rispondere<br/>a tutte le tue domande su di me!</p>
                        
                        <div style="
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            padding: 12px 24px;
                            background: rgba(102, 126, 234, 0.2);
                            border: 1px solid rgba(102, 126, 234, 0.4);
                            border-radius: 8px;
                        ">
                            <i data-lucide="sparkles" style="width: 18px; height: 18px; color: #667eea;"></i>
                            <span style="
                                color: rgba(255, 255, 255, 0.8);
                                font-size: 14px;
                                font-weight: 500;
                            ">Powered by AI</span>
                        </div>
                    </div>
                </div>

                <!-- Finestre Aperte (taskbar icons) -->
                <div id="taskbar-windows" style="
                    display: flex;
                    gap: 5px;
                    padding: 0 10px;
                    align-items: center;
                ">
                    <!-- Le icone delle finestre saranno inserite qui dinamicamente -->
                </div>

                <!-- Spacer (hidden on mobile) -->
                <div id="taskbar-spacer" style="flex: 1;"></div>

                <!-- System Tray -->
                <div id="system-tray" style="
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    color: white;
                    font-size: 14px;
                ">
                    <i data-lucide="clock" style="width: 18px; height: 18px; display: none;"></i>
                    <div id="clock" style="padding: 0 5px; white-space: nowrap;">
                        ${this.getCurrentTime()}
                    </div>
                </div>
            </div>

            <!-- Start Menu (hidden by default) -->
            <div id="start-menu" style="
                position: absolute;
                bottom: 70px;
                left: 10px;
                width: 500px;
                max-width: calc(100vw - 20px);
                max-height: 600px;
                background: rgba(20, 20, 40, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: none;
                flex-direction: column;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                transform: scale(0.95);
                transform-origin: bottom left;
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1000;
            ">
                <!-- Menu Header -->
                <div style="
                    padding: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                ">
                    <h3 style="
                        color: white;
                        margin: 0;
                        font-size: 18px;
                        font-weight: 600;
                    ">Menu</h3>
                    <button id="close-menu-btn" style="
                        width: 32px;
                        height: 32px;
                        background: rgba(255, 255, 255, 0.1);
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.2)'" 
                       onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                        <i data-lucide="x" style="width: 18px; height: 18px; color: white;"></i>
                    </button>
                </div>

                <!-- Menu Content -->
                <div style="
                    flex: 1;
                    padding: 15px;
                    overflow-y: auto;
                ">
                    <!-- Theme Toggle -->
                    <div style="
                        padding: 15px;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 8px;
                        margin-bottom: 15px;
                    ">
                        <div style="
                            color: white;
                            font-size: 14px;
                            margin-bottom: 10px;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        ">
                            <i data-lucide="settings" style="width: 16px; height: 16px;"></i>
                            Impostazioni
                        </div>
                        
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        ">
                            <span style="color: rgba(255,255,255,0.8); font-size: 13px;">Tema Finestre</span>
                            <div id="theme-toggle" style="
                                display: flex;
                                gap: 5px;
                                background: rgba(0, 0, 0, 0.3);
                                padding: 4px;
                                border-radius: 6px;
                            ">
                                <button class="theme-btn" data-theme="dark" style="
                                    padding: 6px 12px;
                                    background: rgba(255, 255, 255, 0.2);
                                    border: none;
                                    border-radius: 4px;
                                    color: white;
                                    cursor: pointer;
                                    font-size: 12px;
                                    transition: all 0.2s;
                                    display: flex;
                                    align-items: center;
                                    gap: 6px;
                                ">
                                    <i data-lucide="moon" style="width: 14px; height: 14px;"></i>
                                    Dark
                                </button>
                                <button class="theme-btn" data-theme="light" style="
                                    padding: 6px 12px;
                                    background: transparent;
                                    border: none;
                                    border-radius: 4px;
                                    color: rgba(255,255,255,0.6);
                                    cursor: pointer;
                                    font-size: 12px;
                                    transition: all 0.2s;
                                    display: flex;
                                    align-items: center;
                                    gap: 6px;
                                ">
                                    <i data-lucide="sun" style="width: 14px; height: 14px;"></i>
                                    Light
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div style="color: rgba(255,255,255,0.6); font-size: 12px; margin-bottom: 8px;">Azioni Rapide</div>
                    ${this.createMenuAction('power', 'Spegni il Computer', 'Arresta il sistema', '#ef4444')}
                    ${this.createMenuAction('external-link', 'Link Esterni', 'GitHub, LinkedIn, etc.')}
                </div>
            </div>
        `;

        // Inizializza icone Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Applica stili responsive
        this.applyResponsiveStyles();

        // Aggiorna orologio
        this.startClock();
    }

    applyResponsiveStyles() {
        // Aggiungi media queries per mobile
        const style = document.createElement('style');
        style.textContent = `
            /* Desktop Icons Responsive */
            @media (max-width: 768px) {
                #desktop-icons {
                    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)) !important;
                    gap: 10px !important;
                    padding: 5px !important;
                }
                
                #taskbar {
                    height: 50px !important;
                    padding: 0 5px !important;
                    gap: 5px !important;
                }
                
                #start-menu-btn {
                    width: 40px !important;
                    height: 40px !important;
                    min-width: 40px !important;
                }
                
                /* AI Assistant Button responsive */
                #ai-assistant-btn {
                    width: 40px !important;
                    height: 40px !important;
                    min-width: 40px !important;
                }

                /* AI Chat Box responsive */
                #ai-chat-box {
                    left: 5px !important;
                    right: 5px !important;
                    bottom: 60px !important;
                    width: auto !important;
                    max-width: none !important;
                    height: 70vh !important;
                    max-height: 70vh !important;
                }
                
                #taskbar-spacer {
                    display: none !important;
                }

                /* Taskbar window buttons responsive */
                #taskbar-windows {
                    padding: 0 5px !important;
                }

                .taskbar-window-btn {
                    min-width: 40px !important;
                    height: 40px !important;
                    padding: 0 8px !important;
                }

                .taskbar-window-title {
                    display: none !important;
                }
                
                #start-menu {
                    left: 5px !important;
                    right: 5px !important;
                    width: auto !important;
                    max-width: none !important;
                    bottom: 60px !important;
                }
                
                #system-tray {
                    gap: 5px !important;
                }
                
                #system-tray i[data-lucide="clock"] {
                    display: none !important;
                }
                
                .desktop-icon {
                    padding: 5px !important;
                }
                
                .desktop-icon > div:first-child {
                    width: 48px !important;
                    height: 48px !important;
                }
                
                .desktop-icon > div:first-child i {
                    width: 24px !important;
                    height: 24px !important;
                }
                
                .desktop-icon > div:last-child {
                    font-size: 11px !important;
                }

                /* Finestre responsive */
                .desktop-window {
                    left: 5px !important;
                    top: 5px !important;
                    right: 5px !important;
                    bottom: 60px !important;
                    width: auto !important;
                    height: auto !important;
                    max-width: none !important;
                }

                .window-header {
                    padding: 12px 15px !important;
                }

                .window-header h3 {
                    font-size: 14px !important;
                }

                .window-content {
                    padding: 15px !important;
                }

                .social-link {
                    padding: 15px !important;
                }

                .social-icon-container {
                    width: 52px !important;
                    height: 52px !important;
                    min-width: 52px !important;
                }

                .social-icon-container i {
                    width: 26px !important;
                    height: 26px !important;
                }
            }
            
            @media (max-width: 480px) {
                #desktop-icons {
                    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)) !important;
                }
                
                #start-menu {
                    transform-origin: bottom center !important;
                }
                
                .menu-action {
                    padding: 10px 12px !important;
                }

                .social-link {
                    flex-direction: column !important;
                    text-align: center !important;
                    gap: 12px !important;
                }
            }
        `;
        
        // Rimuovi style precedente se esiste
        const oldStyle = document.getElementById('desktop-responsive-styles');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        style.id = 'desktop-responsive-styles';
        document.head.appendChild(style);
    }

    createDesktopIcon(iconName, label, index, color = '#60a5fa') {
        return `
            <div class="desktop-icon" data-index="${index}" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
                padding: 10px;
                border-radius: 8px;
                transition: all 0.2s;
                opacity: 0;
                transform: scale(0.8);
            " onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
               onmouseout="this.style.background='transparent'">
                <div style="
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, ${color}aa, ${color}55);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                ">
                    <i data-lucide="${iconName}" style="width: 32px; height: 32px; color: white;"></i>
                </div>
                <div style="
                    color: white;
                    font-size: 12px;
                    text-align: center;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                ">${label}</div>
            </div>
        `;
    }

    createMenuAction(iconName, label, description, accentColor = null) {
        const bgColor = accentColor ? accentColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(',') : null;
        
        return `
            <div class="menu-action" data-action="${label}" style="
                padding: 12px 15px;
                background: ${accentColor ? `rgba(${bgColor}, 0.1)` : 'rgba(255, 255, 255, 0.03)'};
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 12px;
                ${accentColor ? `border: 1px solid rgba(${bgColor}, 0.3);` : ''}
            " onmouseover="this.style.background='${accentColor ? `rgba(${bgColor}, 0.2)` : 'rgba(255,255,255,0.08)'}'" 
               onmouseout="this.style.background='${accentColor ? `rgba(${bgColor}, 0.1)` : 'rgba(255,255,255,0.03)'}'">
                <div style="
                    width: 36px;
                    height: 36px;
                    background: ${accentColor ? `rgba(${bgColor}, 0.2)` : 'rgba(255, 255, 255, 0.05)'};
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i data-lucide="${iconName}" style="width: 20px; height: 20px; color: ${accentColor || 'white'};"></i>
                </div>
                <div style="flex: 1;">
                    <div style="color: white; font-size: 13px; font-weight: 500;">${label}</div>
                    <div style="color: rgba(255,255,255,0.5); font-size: 11px;">${description}</div>
                </div>
            </div>
        `;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }

    startClock() {
        // Aggiorna orologio ogni minuto
        this.clockInterval = setInterval(() => {
            const clockEl = document.getElementById('clock');
            if (clockEl) {
                clockEl.textContent = this.getCurrentTime();
            }
        }, 60000);
    }

    createIcon(emoji, label) {
        return `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            "
            onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.borderColor='rgba(255,255,255,0.3)'; this.style.transform='translateY(-5px)';"
            onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='transparent'; this.style.transform='translateY(0)';"
            onclick="console.log('Click su: ${label}')">
                <div style="font-size: 3rem;">${emoji}</div>
                <div style="color: white; font-size: 0.9rem; font-weight: 500;">${label}</div>
            </div>
        `;
    }

    /**
     * Aggiorna icone finestre nella taskbar
     */
    updateTaskbarWindows(windows) {
        const taskbarWindows = document.getElementById('taskbar-windows');
        if (!taskbarWindows) return;

        // Pulisci taskbar
        taskbarWindows.innerHTML = '';

        // Aggiungi icona per ogni finestra
        windows.forEach(window => {
            const windowBtn = document.createElement('button');
            windowBtn.id = `taskbar-${window.id}`;
            windowBtn.className = 'taskbar-window-btn';
            windowBtn.style.cssText = `
                min-width: 48px;
                height: 48px;
                padding: 0 12px;
                background: ${window.isMinimized ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)'};
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                position: relative;
                ${!window.isMinimized ? 'border-bottom: 3px solid rgba(255, 255, 255, 0.8);' : ''}
            `;

            // Icona
            const icon = document.createElement('i');
            icon.setAttribute('data-lucide', window.icon);
            icon.style.cssText = `
                width: 20px;
                height: 20px;
                color: white;
            `;
            windowBtn.appendChild(icon);

            // Titolo (solo desktop)
            const titleSpan = document.createElement('span');
            titleSpan.textContent = window.title;
            titleSpan.style.cssText = `
                color: white;
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 120px;
            `;
            titleSpan.className = 'taskbar-window-title';
            windowBtn.appendChild(titleSpan);

            // Hover effects
            windowBtn.addEventListener('mouseover', () => {
                windowBtn.style.background = 'rgba(255, 255, 255, 0.25)';
            });

            windowBtn.addEventListener('mouseout', () => {
                windowBtn.style.background = window.isMinimized ? 
                    'rgba(255, 255, 255, 0.05)' : 
                    'rgba(255, 255, 255, 0.15)';
            });

            // Click: ripristina o minimizza
            windowBtn.addEventListener('click', () => {
                if (window.isMinimized) {
                    this.windowManager.restoreWindow(window.id);
                } else if (this.windowManager.activeWindow === window.id) {
                    // Se è già attiva, minimizza
                    this.windowManager.minimizeWindow(window.id);
                } else {
                    // Altrimenti porta in primo piano
                    this.windowManager.bringToFront(window.id);
                }
            });

            taskbarWindows.appendChild(windowBtn);
        });

        // Reinizializza icone Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupEventListeners() {
        // Start menu toggle
        const startBtn = document.getElementById('start-menu-btn');
        const startMenu = document.getElementById('start-menu');
        
        if (startBtn && startMenu) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Previeni propagazione
                this.toggleStartMenu();
            });

            // Chiudi menu cliccando fuori
            document.addEventListener('click', (e) => {
                if (this.menuOpen && 
                    !startMenu.contains(e.target) && 
                    !startBtn.contains(e.target)) {
                    this.toggleStartMenu();
                }
            });

            // Previeni chiusura quando clicchi dentro il menu
            startMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Close menu button
        const closeMenuBtn = document.getElementById('close-menu-btn');
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.menuOpen) {
                    this.toggleStartMenu();
                }
            });
        }

        // Theme toggle
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const newTheme = btn.dataset.theme;
                this.setTheme(newTheme);
                
                // Update button styles
                themeButtons.forEach(b => {
                    if (b === btn) {
                        b.style.background = 'rgba(255, 255, 255, 0.2)';
                        b.style.color = 'white';
                    } else {
                        b.style.background = 'transparent';
                        b.style.color = 'rgba(255,255,255,0.6)';
                    }
                });
            });
        });

        // AI Assistant Button
        const aiAssistantBtn = document.getElementById('ai-assistant-btn');
        const aiChatBox = document.getElementById('ai-chat-box');
        const closeAiChatBtn = document.getElementById('close-ai-chat-btn');
        
        if (aiAssistantBtn && aiChatBox) {
            aiAssistantBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleAIChat();
            });

            // Close AI chat button
            if (closeAiChatBtn) {
                closeAiChatBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleAIChat();
                });
            }

            // Close AI chat when clicking outside
            document.addEventListener('click', (e) => {
                if (this.aiChatOpen && 
                    !aiChatBox.contains(e.target) && 
                    !aiAssistantBtn.contains(e.target)) {
                    this.toggleAIChat();
                }
            });

            // Prevent close when clicking inside chat
            aiChatBox.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Desktop icons click
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            icon.addEventListener('click', () => {
                const label = icon.querySelector('div:last-child').textContent;
                console.log('🖱️ Click su icona:', label);
                
                // Apri finestra corrispondente
                if (label === 'About Me') {
                    this.openAboutMeWindow();
                } else if (label === 'Progetti') {
                    this.openProgettiWindow();
                } else if (label === 'CV') {
                    this.openCVWindow();
                } else if (label === 'Contatti') {
                    this.openContactsWindow();
                } else if (label === 'Skills') {
                    this.openSkillsWindow();
                }
            });
        });

        // Menu actions
        const menuActions = document.querySelectorAll('.menu-action');
        menuActions.forEach(action => {
            action.addEventListener('click', () => {
                const actionName = action.dataset.action;
                console.log('⚡ Azione menu:', actionName);
                
                if (actionName === 'Spegni il Computer') {
                    this.startShutdownSequence();
                } else if (actionName === 'Link Esterni') {
                    this.openExternalLinksWindow();
                }
            });
        });
    }

    /**
     * Apri finestra Link Esterni
     */
    openExternalLinksWindow() {
        console.log('🪟 Apertura finestra Link Esterni...');
        
        try {
            const content = createExternalLinksContent(this.theme);
            console.log('✅ Contenuto generato');
            
            const windowId = this.windowManager.createWindow({
                title: 'Link Esterni',
                content: content,
                width: 500,
                height: 480,
                onClose: () => {
                    console.log('🪟 Finestra Link Esterni chiusa');
                }
            });
            
            console.log('✅ Finestra creata con ID:', windowId);

            // Chiudi menu
            if (this.menuOpen) {
                this.toggleStartMenu();
            }
        } catch (error) {
            console.error('❌ Errore apertura finestra:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    /**
     * Apri finestra About Me
     */
    openAboutMeWindow() {
        console.log('🪟 Apertura finestra About Me...');
        
        try {
            const content = createAboutMeContent(this.theme);
            
            const windowId = this.windowManager.createWindow({
                title: 'About Me',
                content: content,
                width: 700,
                height: 600,
                onClose: () => {
                    console.log('🪟 Finestra About Me chiusa');
                }
            });
            
            console.log('✅ Finestra About Me creata con ID:', windowId);

            // Inizializza typing effect dopo un breve delay
            setTimeout(() => {
                initTypingEffect();
            }, 300);

        } catch (error) {
            console.error('❌ Errore apertura finestra About Me:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    /**
     * Apri finestra Contatti
     */
    openContactsWindow() {
        console.log('🪟 Apertura finestra Contatti...');
        
        try {
            const content = createContactsContent(this.theme);
            
            const windowId = this.windowManager.createWindow({
                title: 'Contatti',
                content: content,
                width: 650,
                height: 700,
                onClose: () => {
                    console.log('🪟 Finestra Contatti chiusa');
                }
            });
            
            console.log('✅ Finestra Contatti creata con ID:', windowId);

            // Inizializza typing effect dopo un breve delay
            setTimeout(() => {
                initContactsTypingEffect();
            }, 300);

        } catch (error) {
            console.error('❌ Errore apertura finestra Contatti:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    /**
     * Apri finestra Skills
     */
    openSkillsWindow() {
        console.log('🪟 Apertura finestra Skills...');
        
        try {
            const content = createSkillsContent(this.theme);
            
            const windowId = this.windowManager.createWindow({
                title: 'Skills',
                content: content,
                width: 700,
                height: 650,
                onClose: () => {
                    console.log('🪟 Finestra Skills chiusa');
                }
            });
            
            console.log('✅ Finestra Skills creata con ID:', windowId);

            // Inizializza typing effect dopo un breve delay
            setTimeout(() => {
                initSkillsTypingEffect();
            }, 300);

        } catch (error) {
            console.error('❌ Errore apertura finestra Skills:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    openCVWindow() {
        console.log('🪟 Apertura finestra CV...');
        
        try {
            const content = createCVContent(this.theme);
            
            const windowId = this.windowManager.createWindow({
                title: 'Curriculum Vitae',
                content: content,
                width: 800,
                height: 700,
                onClose: () => {
                    console.log('🪟 Finestra CV chiusa');
                }
            });
            
            console.log('✅ Finestra CV creata con ID:', windowId);

            // Inizializza typing effect dopo un breve delay
            setTimeout(() => {
                initCVTypingEffect();
            }, 300);

        } catch (error) {
            console.error('❌ Errore apertura finestra CV:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    /**
     * Apri finestra Progetti
     */
    openProgettiWindow() {
        console.log('🪟 Apertura finestra Progetti...');
        
        try {
            const isDark = this.theme === 'dark';
            
            const content = `
                <div style="
                    padding: 30px;
                    height: 100%;
                    overflow-y: auto;
                    background: ${isDark ? '#1e293b' : '#f8fafc'};
                ">
                    <!-- Sezione Miei Progetti -->
                    <div style="
                        background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
                        border-radius: 16px;
                        padding: 30px;
                        margin-bottom: 30px;
                        border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
                    ">
                        <h2 style="
                            color: ${isDark ? 'white' : '#1e293b'};
                            margin: 0 0 20px 0;
                            font-size: 24px;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        ">
                            <i data-lucide="folder-code" style="width: 28px; height: 28px; color: #60a5fa;"></i>
                            I Miei Progetti
                        </h2>
                        
                        <div style="
                            text-align: center;
                            padding: 40px 20px;
                            background: ${isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(96, 165, 250, 0.05)'};
                            border-radius: 12px;
                            border: 2px dashed ${isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(96, 165, 250, 0.2)'};
                            margin-bottom: 25px;
                        ">
                            <i data-lucide="rocket" style="width: 48px; height: 48px; color: #60a5fa; margin-bottom: 15px;"></i>
                            <p style="
                                color: ${isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
                                font-size: 18px;
                                margin: 0;
                                font-weight: 500;
                            ">Published projects coming soon...</p>
                        </div>
                        
                        <!-- Link GitHub -->
                        <a href="https://github.com/HafSimba" target="_blank" rel="noopener noreferrer" style="
                            display: flex;
                            align-items: center;
                            gap: 15px;
                            padding: 20px;
                            background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
                            border-radius: 12px;
                            text-decoration: none;
                            border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
                            transition: all 0.3s ease;
                        " onmouseover="this.style.background='${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}'; this.style.transform='translateX(5px)'" 
                           onmouseout="this.style.background='${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}'; this.style.transform='translateX(0)'">
                            <div style="
                                width: 56px;
                                height: 56px;
                                min-width: 56px;
                                background: linear-gradient(135deg, #333 0%, #000 100%);
                                border-radius: 12px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <i data-lucide="github" style="width: 32px; height: 32px; color: white;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="
                                    color: ${isDark ? 'white' : '#1e293b'};
                                    font-size: 16px;
                                    font-weight: 600;
                                    margin-bottom: 4px;
                                ">GitHub Repository</div>
                                <div style="
                                    color: ${isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
                                    font-size: 13px;
                                ">github.com/HafSimba</div>
                            </div>
                            <i data-lucide="external-link" style="width: 20px; height: 20px; color: ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'};"></i>
                        </a>
                    </div>
                    
                    <!-- Sezione Progetti a cui ho partecipato -->
                    <div style="
                        background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
                        border-radius: 16px;
                        padding: 30px;
                        border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
                    ">
                        <h2 style="
                            color: ${isDark ? 'white' : '#1e293b'};
                            margin: 0 0 20px 0;
                            font-size: 24px;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        ">
                            <i data-lucide="users" style="width: 28px; height: 28px; color: #34d399;"></i>
                            Progetti a cui ho partecipato
                        </h2>
                        
                        <!-- Progetto FGB BaitService -->
                        <a href="https://fgb.baitservice.it" target="_blank" rel="noopener noreferrer" style="
                            display: flex;
                            align-items: center;
                            gap: 15px;
                            padding: 20px;
                            background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
                            border-radius: 12px;
                            text-decoration: none;
                            border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
                            transition: all 0.3s ease;
                        " onmouseover="this.style.background='${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}'; this.style.transform='translateX(5px)'" 
                           onmouseout="this.style.background='${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}'; this.style.transform='translateX(0)'">
                            <div style="
                                width: 56px;
                                height: 56px;
                                min-width: 56px;
                                background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
                                border-radius: 12px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <i data-lucide="globe" style="width: 32px; height: 32px; color: white;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="
                                    color: ${isDark ? 'white' : '#1e293b'};
                                    font-size: 16px;
                                    font-weight: 600;
                                    margin-bottom: 4px;
                                ">FGB - BaitService</div>
                                <div style="
                                    color: ${isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
                                    font-size: 13px;
                                ">fgb.baitservice.it</div>
                            </div>
                            <i data-lucide="external-link" style="width: 20px; height: 20px; color: ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'};"></i>
                        </a>
                    </div>
                </div>
            `;
            
            const windowId = this.windowManager.createWindow({
                title: 'Progetti',
                content: content,
                width: 700,
                height: 650,
                onClose: () => {
                    console.log('🪟 Finestra Progetti chiusa');
                }
            });
            
            console.log('✅ Finestra Progetti creata con ID:', windowId);

            // Inizializza icone Lucide
            setTimeout(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 100);

        } catch (error) {
            console.error('❌ Errore apertura finestra Progetti:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        if (!startMenu) return;

        this.menuOpen = !this.menuOpen;

        if (this.menuOpen) {
            startMenu.style.display = 'flex';
            setTimeout(() => {
                startMenu.style.opacity = '1';
                startMenu.style.transform = 'scale(1)';
                
                // Reinizializza icone Lucide nel menu
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 10);
        } else {
            startMenu.style.opacity = '0';
            startMenu.style.transform = 'scale(0.95)';
            setTimeout(() => {
                startMenu.style.display = 'none';
            }, 300);
        }
    }

    toggleAIChat() {
        const aiChatBox = document.getElementById('ai-chat-box');
        if (!aiChatBox) return;

        this.aiChatOpen = !this.aiChatOpen;

        if (this.aiChatOpen) {
            // Chiudi il menu se aperto
            if (this.menuOpen) {
                this.toggleStartMenu();
            }

            aiChatBox.style.display = 'flex';
            setTimeout(() => {
                aiChatBox.style.opacity = '1';
                aiChatBox.style.transform = 'scale(1)';
                
                // Reinizializza icone Lucide nel chat box
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 10);
        } else {
            aiChatBox.style.opacity = '0';
            aiChatBox.style.transform = 'scale(0.95)';
            setTimeout(() => {
                aiChatBox.style.display = 'none';
            }, 300);
        }
    }

    setTheme(theme) {
        this.theme = theme;
        this.windowManager.updateTheme(theme);
        console.log('🎨 Tema cambiato:', theme);
    }

    animateEntrance() {
        // Animazione taskbar dal basso
        const taskbar = document.getElementById('taskbar');
        if (taskbar) {
            setTimeout(() => {
                taskbar.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                taskbar.style.transform = 'translateY(0)';
            }, 100);
        }

        // Animazione icone staggered
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.transition = 'all 0.5s ease';
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1)';
            }, 300 + (index * 100));
        });
    }

    /**
     * Mostra il desktop fullscreen con animazione
     */
    show() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.container.style.display = 'flex';
        
        console.log('✨ Mostrando desktop fullscreen...');
        
        // Animazione fade-in del container
        requestAnimationFrame(() => {
            this.container.style.transition = 'opacity 1s ease-in-out';
            this.container.style.opacity = '1';
            
            // Avvia animazioni di entrata
            this.animateEntrance();
        });
    }

    /**
     * Nascondi il desktop fullscreen
     */
    hide() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        console.log('✨ Nascondendo desktop fullscreen...');
        
        // Ferma orologio
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }
        
        // Chiudi menu se aperto
        if (this.menuOpen) {
            this.toggleStartMenu();
        }

        // Chiudi tutte le finestre
        this.windowManager.closeAllWindows();
        
        this.container.style.transition = 'opacity 1s ease-in-out';
        this.container.style.opacity = '0';
        
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 1000);
    }

    /**
     * Aggiorna orologio nella taskbar
     */
    updateClock() {
        if (!this.isActive) return;
        
        // Aggiorna ogni minuto
        setInterval(() => {
            if (this.isActive) {
                this.createDesktopUI();
            }
        }, 60000);
    }

    /**
     * Inizia sequenza di spegnimento
     */
    async startShutdownSequence() {
        console.log('🔌 Avvio sequenza di spegnimento...');
        
        // Chiudi il menu
        if (this.menuOpen) {
            this.toggleStartMenu();
        }

        // Crea overlay di shutdown
        const shutdownOverlay = document.createElement('div');
        shutdownOverlay.id = 'shutdown-overlay';
        shutdownOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 20000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        `;
        
        shutdownOverlay.innerHTML = `
            <div style="
                text-align: center;
                color: white;
            ">
                <!-- Spinner circolare -->
                <div style="
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 30px;
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                
                <h2 style="
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    font-size: 24px;
                    font-weight: 400;
                    margin: 0 0 10px 0;
                ">Arresto del sistema</h2>
                
                <p style="
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                ">Attendere prego...</p>
            </div>
            
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.appendChild(shutdownOverlay);
        
        // Fade in dell'overlay
        requestAnimationFrame(() => {
            shutdownOverlay.style.opacity = '1';
        });
        
        // Aspetta 2 secondi per l'animazione di shutdown
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Nascondi il desktop
        this.container.style.opacity = '0';
        
        // Aspetta fade out
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Nascondi desktop
        this.isActive = false;
        this.container.style.display = 'none';
        
        // Chiudi tutte le finestre
        this.windowManager.closeAllWindows();
        
        // Ferma orologio
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }
        
        // Rimuovi overlay di shutdown
        shutdownOverlay.remove();
        
        // Mostra schermata di ringraziamento
        this.showThankYouScreen();
    }

    /**
     * Mostra schermata "Grazie della visita"
     */
    showThankYouScreen() {
        console.log('💙 Mostrando schermata di ringraziamento...');
        
        const thankYouScreen = document.createElement('div');
        thankYouScreen.id = 'thank-you-screen';
        thankYouScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            z-index: 15000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 1s ease-in-out;
        `;
        
        thankYouScreen.innerHTML = `
            <div style="
                text-align: center;
                max-width: 600px;
                padding: 40px;
            ">
                <div style="
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
                ">
                    <i data-lucide="heart" style="width: 60px; height: 60px; color: white;"></i>
                </div>
                
                <h1 style="
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    font-size: 48px;
                    font-weight: 700;
                    color: white;
                    margin: 0 0 20px 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">Grazie della visita</h1>
                
                <p style="
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.6;
                    margin: 0 0 40px 0;
                ">Spero che il mio portfolio ti sia piaciuto. A presto!</p>
            </div>
            
            <!-- Bottone restart in basso a destra -->
            <button id="restart-btn" style="
                position: fixed;
                bottom: 30px;
                right: 30px;
                padding: 14px 28px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 12px;
                color: white;
                font-family: 'Segoe UI', system-ui, sans-serif;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 15001;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 32px rgba(102, 126, 234, 0.4)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(102, 126, 234, 0.3)'">
                <i data-lucide="rotate-ccw" style="width: 20px; height: 20px;"></i>
                Riavvia
            </button>
            
            <style>
                @media (max-width: 480px) {
                    #restart-btn {
                        bottom: 20px !important;
                        right: 20px !important;
                        padding: 12px 20px !important;
                        font-size: 14px !important;
                    }
                }
            </style>
        `;
        
        document.body.appendChild(thankYouScreen);
        
        // Inizializza icone
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Fade in
        requestAnimationFrame(() => {
            thankYouScreen.style.opacity = '1';
        });
        
        // Handler per il bottone restart
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', () => {
            this.restartSite();
        });
    }

    /**
     * Riavvia il sito da zero
     */
    async restartSite() {
        console.log('🔄 Riavvio del sito...');
        
        const thankYouScreen = document.getElementById('thank-you-screen');
        
        // Fade out della schermata
        thankYouScreen.style.opacity = '0';
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Rimuovi schermata
        thankYouScreen.remove();
        
        // Ricarica la pagina per ricominciare da zero
        window.location.reload();
    }
}
