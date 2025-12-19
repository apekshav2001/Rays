/**
 * Rays - UI Module
 * Handles GUI, keyboard shortcuts, auto-hide, and notifications
 */

import { UI_HIDE_DELAY, MOUSE_THROTTLE, FPS_NORMAL, FPS_BATTERY, COLOR_PRESETS } from './config.js';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Throttle function calls
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Minimum ms between calls
 */
export function throttle(fn, delay) {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn(...args);
        }
    };
}

// =============================================================================
// UI CONTROLLER CLASS
// =============================================================================

export class UIController {
    constructor() {
        // Cached DOM elements
        this.elements = {
            volumeBar: null,
            hintElement: null,
            micStatus: null,
            micName: null
        };

        this.uiTimeout = null;
        this.guiVisible = false;
        this.gui = null;
        this.targetFps = FPS_NORMAL;
        this.lastFrameTime = 0;

        // Callbacks
        this.onFpsChange = null;
        this.onColorChange = null;
    }

    /**
     * Cache DOM elements (call once at init)
     */
    cacheElements() {
        this.elements.volumeBar = document.getElementById('volume-bar');
        this.elements.hintElement = document.getElementById('windows-hint');
        this.elements.micStatus = document.getElementById('mic-status');
        this.elements.micName = document.getElementById('mic-name');
    }

    /**
     * Show UI elements
     */
    showUI() {
        document.body.classList.add('show-ui', 'show-cursor');
        clearTimeout(this.uiTimeout);
        this.uiTimeout = setTimeout(() => this.hideUI(), UI_HIDE_DELAY);
    }

    /**
     * Hide UI elements
     */
    hideUI() {
        if (!this.guiVisible) {
            document.body.classList.remove('show-ui', 'show-cursor');
        }
    }

    /**
     * Setup mouse/touch event listeners for auto-hide
     */
    setupAutoHide() {
        const throttledShow = throttle(() => this.showUI(), MOUSE_THROTTLE);
        document.addEventListener('mousemove', throttledShow);
        document.addEventListener('mousedown', () => this.showUI());
        document.addEventListener('touchstart', () => this.showUI());

        // Initial show
        this.showUI();
    }

    /**
     * Setup keyboard shortcuts
     * @param {Object} params - Reference to params object
     */
    setupKeyboard(params) {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();

            // F = Fullscreen
            if (key === 'f') {
                this.toggleFullscreen();
            }

            // H = Toggle GUI
            if (key === 'h') {
                this.toggleGUI();
            }

            // P = Toggle FPS mode
            if (key === 'p') {
                params.lowFpsMode = !params.lowFpsMode;
                this.targetFps = params.lowFpsMode ? FPS_BATTERY : FPS_NORMAL;
                if (this.onFpsChange) this.onFpsChange(params.lowFpsMode);
                this.updateGUIDisplay();
            }
        });
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn('Fullscreen not available:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Toggle GUI visibility
     */
    toggleGUI() {
        this.guiVisible = !this.guiVisible;
        document.body.classList.toggle('gui-visible', this.guiVisible);
        if (this.gui) {
            if (this.guiVisible) {
                this.gui.open();
                this.showUI();
            } else {
                this.gui.close();
            }
        }
    }

    /**
     * Update GUI display values
     */
    updateGUIDisplay() {
        if (this.gui) {
            this.gui.controllersRecursive().forEach(c => c.updateDisplay());
        }
    }

    /**
     * Update volume bar display
     * @param {number} volume - Volume level 0-1
     */
    updateVolumeBar(volume) {
        if (this.elements.volumeBar) {
            this.elements.volumeBar.style.width = Math.min(100, volume * 400) + '%';
        }
    }

    /**
     * Update microphone status display
     * @param {string} status - Status text
     * @param {boolean} isActive - Whether mic is active
     */
    updateMicStatus(status, isActive) {
        if (this.elements.micStatus) {
            this.elements.micStatus.innerText = status;
            this.elements.micStatus.style.color = isActive ? '#0f0' : '#f00';
        }
    }

    /**
     * Update device name display
     * @param {string} name - Device name
     */
    updateDeviceName(name) {
        if (this.elements.micName) {
            this.elements.micName.innerText = name;
        }
    }

    /**
     * Show/hide Windows hint
     * @param {boolean} show - Whether to show hint
     */
    showHint(show) {
        if (this.elements.hintElement) {
            this.elements.hintElement.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Show notification message
     * @param {string} message - Message to show
     * @param {string} type - 'info', 'warning', 'error'
     */
    showNotification(message, type = 'info') {
        const colors = {
            info: '#3380ff',
            warning: '#ffaa00',
            error: '#ff5555'
        };

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: ${colors[type]};
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'SF Mono', monospace;
            font-size: 14px;
            z-index: 100;
            backdrop-filter: blur(10px);
            border: 1px solid ${colors[type]}33;
            animation: fadeInOut 3s forwards;
        `;
        notification.innerText = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    /**
     * Check if frame should be rendered (for FPS throttling)
     * @param {number} timestamp - Current timestamp
     * @returns {boolean} - Whether to render this frame
     */
    shouldRenderFrame(timestamp) {
        const frameInterval = 1000 / this.targetFps;
        if (timestamp - this.lastFrameTime < frameInterval) {
            return false;
        }
        this.lastFrameTime = timestamp;
        return true;
    }

    /**
     * Clean up resources
     */
    dispose() {
        clearTimeout(this.uiTimeout);
        if (this.gui) {
            this.gui.destroy();
        }
    }
}
