/**
 * WindowManager - Sistema di gestione finestre desktop draggable
 */
export class WindowManager {
    constructor(theme = 'dark', onWindowStateChange = null) {
        this.theme = theme;
        this.windows = [];
        this.zIndexCounter = 10100; // Maggiore del desktop container (10000)
        this.activeWindow = null;
        this.onWindowStateChange = onWindowStateChange; // Callback per notificare cambiamenti
    }

    /**
     * Crea una nuova finestra
     */
    createWindow(options = {}) {
        const {
            title = 'Finestra',
            content = '',
            width = 500,
            height = 400,
            x = window.innerWidth / 2 - width / 2,
            y = window.innerHeight / 2 - height / 2,
            onClose = null
        } = options;

        const windowId = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const windowElement = document.createElement('div');
        windowElement.id = windowId;
        windowElement.className = 'desktop-window';
        windowElement.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${width}px;
            height: ${height}px;
            background: ${this.theme === 'dark' ? 'rgba(20, 20, 40, 0.95)' : 'rgba(240, 240, 245, 0.95)'};
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid ${this.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            z-index: ${this.zIndexCounter++};
            opacity: 0;
            transform: scale(0.95);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;

        // Header (draggable)
        const header = document.createElement('div');
        header.className = 'window-header';
        header.style.cssText = `
            padding: 15px 20px;
            border-bottom: 1px solid ${this.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
            user-select: none;
        `;

        const titleEl = document.createElement('h3');
        titleEl.style.cssText = `
            color: ${this.theme === 'dark' ? 'white' : '#1e293b'};
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        `;
        titleEl.textContent = title;

        // Window controls
        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            gap: 8px;
        `;

        // Minimize button
        const minimizeBtn = this.createControlButton('minus', () => {
            this.minimizeWindow(windowId);
        });

        // Maximize button
        const maximizeBtn = this.createControlButton('maximize-2', () => {
            this.maximizeWindow(windowId);
        });

        // Close button
        const closeBtn = this.createControlButton('x', () => {
            this.closeWindow(windowId);
            if (onClose) onClose();
        });

        controls.appendChild(minimizeBtn);
        controls.appendChild(maximizeBtn);
        controls.appendChild(closeBtn);

        header.appendChild(titleEl);
        header.appendChild(controls);

        // Content
        const contentEl = document.createElement('div');
        contentEl.className = 'window-content';
        contentEl.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            color: ${this.theme === 'dark' ? 'white' : '#1e293b'};
        `;
        contentEl.innerHTML = content;

        windowElement.appendChild(header);
        windowElement.appendChild(contentEl);

        document.body.appendChild(windowElement);

        // Inizializza icone Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Animazione entrata
        requestAnimationFrame(() => {
            windowElement.style.opacity = '1';
            windowElement.style.transform = 'scale(1)';
        });

        // Rendi draggable
        this.makeDraggable(windowElement, header);

        // Porta in primo piano al click
        windowElement.addEventListener('mousedown', () => {
            this.bringToFront(windowId);
        });

        // Salva riferimento
        this.windows.push({
            id: windowId,
            element: windowElement,
            title: title,
            icon: this.getIconFromTitle(title),
            originalSize: { width, height, x, y },
            isMaximized: false,
            isMinimized: false,
            onClose: onClose
        });

        this.bringToFront(windowId);
        this.notifyStateChange();

        return windowId;
    }

    /**
     * Ottieni icona basata sul titolo finestra
     */
    getIconFromTitle(title) {
        const iconMap = {
            'Link Esterni': 'external-link',
            'Progetti': 'folder',
            'CV': 'file-text',
            'Portfolio': 'palette',
            'Contatti': 'mail',
            'About Me': 'user',
            'Skills': 'code',
            'Statistiche': 'bar-chart-3'
        };
        return iconMap[title] || 'window';
    }

    /**
     * Notifica cambio stato finestre
     */
    notifyStateChange() {
        if (this.onWindowStateChange) {
            this.onWindowStateChange(this.windows);
        }
    }

    /**
     * Crea pulsante controllo finestra
     */
    createControlButton(iconName, onClick) {
        const button = document.createElement('button');
        button.style.cssText = `
            width: 32px;
            height: 32px;
            background: ${this.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;

        button.innerHTML = `<i data-lucide="${iconName}" style="width: 16px; height: 16px; color: ${this.theme === 'dark' ? 'white' : '#1e293b'};"></i>`;

        button.addEventListener('mouseover', () => {
            button.style.background = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        });

        button.addEventListener('mouseout', () => {
            button.style.background = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        });

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick();
        });

        return button;
    }

    /**
     * Rendi finestra draggable
     */
    makeDraggable(windowElement, handle) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        
        // Salva riferimento a this (WindowManager)
        const self = this;

        handle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Touch support (passive per performance)
        handle.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);

        function dragStart(e) {
            const windowData = self.windows?.find(w => w.element === windowElement);
            
            // Non draggare se è maximized
            if (windowData && windowData.isMaximized) return;

            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - windowElement.offsetLeft;
                initialY = e.touches[0].clientY - windowElement.offsetTop;
            } else {
                initialX = e.clientX - windowElement.offsetLeft;
                initialY = e.clientY - windowElement.offsetTop;
            }

            if (e.target === handle || handle.contains(e.target)) {
                isDragging = true;
                handle.style.cursor = 'grabbing';
            }
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            // Limiti dello schermo
            const maxX = window.innerWidth - windowElement.offsetWidth;
            const maxY = window.innerHeight - windowElement.offsetHeight;

            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));

            windowElement.style.left = currentX + 'px';
            windowElement.style.top = currentY + 'px';
            windowElement.style.transition = 'none';
        }

        function dragEnd() {
            if (!isDragging) return;
            
            isDragging = false;
            handle.style.cursor = 'move';
            windowElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }
    }

    /**
     * Porta finestra in primo piano
     */
    bringToFront(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (!window) return;

        window.element.style.zIndex = this.zIndexCounter++;
        this.activeWindow = windowId;
    }

    /**
     * Minimizza finestra
     */
    minimizeWindow(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (!window) return;

        window.isMinimized = true;
        window.element.style.opacity = '0';
        window.element.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            window.element.style.display = 'none';
            this.notifyStateChange();
        }, 300);
    }

    /**
     * Ripristina finestra minimizzata
     */
    restoreWindow(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (!window) return;

        window.isMinimized = false;
        window.element.style.display = 'flex';
        
        setTimeout(() => {
            window.element.style.opacity = '1';
            window.element.style.transform = 'scale(1)';
            this.bringToFront(windowId);
            this.notifyStateChange();
        }, 10);
    }

    /**
     * Massimizza/Ripristina finestra
     */
    maximizeWindow(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (!window) return;

        if (window.isMaximized) {
            // Ripristina
            window.element.style.left = window.originalSize.x + 'px';
            window.element.style.top = window.originalSize.y + 'px';
            window.element.style.width = window.originalSize.width + 'px';
            window.element.style.height = window.originalSize.height + 'px';
            window.isMaximized = false;
        } else {
            // Massimizza
            window.element.style.left = '0px';
            window.element.style.top = '0px';
            window.element.style.width = '100vw';
            window.element.style.height = 'calc(100vh - 60px)'; // Lascia spazio per taskbar
            window.isMaximized = true;
        }
    }

    /**
     * Chiudi finestra
     */
    closeWindow(windowId) {
        const windowIndex = this.windows.findIndex(w => w.id === windowId);
        if (windowIndex === -1) return;

        const window = this.windows[windowIndex];
        
        // Chiama callback onClose se esiste
        if (window.onClose) {
            window.onClose();
        }
        
        window.element.style.opacity = '0';
        window.element.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            window.element.remove();
            this.windows.splice(windowIndex, 1);
            this.notifyStateChange();
        }, 300);
    }

    /**
     * Aggiorna tema di tutte le finestre
     */
    updateTheme(theme) {
        this.theme = theme;
        
        this.windows.forEach(window => {
            const isDark = theme === 'dark';
            const bg = isDark ? 'rgba(20, 20, 40, 0.95)' : 'rgba(240, 240, 245, 0.95)';
            const border = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const textColor = isDark ? 'white' : '#1e293b';
            
            window.element.style.background = bg;
            window.element.style.borderColor = border;
            
            // Aggiorna header
            const header = window.element.querySelector('.window-header');
            if (header) {
                header.style.borderBottomColor = border;
                const title = header.querySelector('h3');
                if (title) title.style.color = textColor;
            }
            
            // Aggiorna content
            const content = window.element.querySelector('.window-content');
            if (content) content.style.color = textColor;
            
            // Aggiorna pulsanti
            const buttons = window.element.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.style.background = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                const icon = btn.querySelector('i');
                if (icon) icon.style.color = textColor;
            });
        });
    }

    /**
     * Chiudi tutte le finestre
     */
    closeAllWindows() {
        [...this.windows].forEach(window => {
            this.closeWindow(window.id);
        });
    }
}
