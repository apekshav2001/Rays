/**
 * Rays - Configuration Module
 * All constants, presets, and magic numbers with documentation
 */

// =============================================================================
// CORE SETTINGS
// =============================================================================

/** Number of particles to render (reduce for mobile) */
export const PARTICLE_COUNT = 15000;

/** Reduced particle count for mobile devices */
export const PARTICLE_COUNT_MOBILE = 5000;

/** Default camera Z position */
export const CAMERA_DISTANCE = 6;

/** Exponential fog density for depth effect */
export const FOG_DENSITY = 0.02;

/** Maximum pixel ratio (prevents GPU overload on high-DPI) */
export const MAX_PIXEL_RATIO = 2;

// =============================================================================
// UI SETTINGS
// =============================================================================

/** Milliseconds before UI auto-hides */
export const UI_HIDE_DELAY = 3000;

/** Throttle delay for mouse move events (ms) */
export const MOUSE_THROTTLE = 100;

/** Target FPS for normal mode */
export const FPS_NORMAL = 60;

/** Target FPS for battery-saving mode */
export const FPS_BATTERY = 30;

// =============================================================================
// DEFAULT PARAMETERS
// =============================================================================

export const DEFAULT_PARAMS = {
    color1: '#3380ff',      // Primary color (blue)
    color2: '#ffcc66',      // Secondary color (gold)
    baseSize: 3.0,          // Base particle size
    speed: 0.2,             // Animation speed multiplier
    bloomStrength: 1.2,     // Bloom/glow intensity
    preset: 'Custom',       // Current color preset name
    lowFpsMode: false,      // Battery saving mode
    text: 'Rays',           // Default text
    textFont: 'Great Vibes', // Default font
    textPosition: 'center'  // Default position
};

// =============================================================================
// COLOR PRESETS
// =============================================================================

export const COLOR_PRESETS = {
    'Ocean': { color1: '#0066cc', color2: '#00ffcc' },
    'Sunset': { color1: '#ff6b35', color2: '#9b59b6' },
    'Forest': { color1: '#27ae60', color2: '#16a085' },
    'Cosmic': { color1: '#9b59b6', color2: '#e91e63' },
    'Fire': { color1: '#ff4500', color2: '#ffd700' },
    'Aurora': { color1: '#00d4ff', color2: '#7b2ff7' },
    'Midnight': { color1: '#1a1a2e', color2: '#16213e' },
    'Cherry': { color1: '#e91e63', color2: '#ffb7c5' },
    'Universe': { color1: '#ffffff', color2: '#ffffff' },
    'Custom': null
};

// =============================================================================
// DEVICE DETECTION
// =============================================================================

/** Check if running on mobile device */
export const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

/** Check if user prefers reduced motion */
export const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Get optimal particle count based on device */
export const getParticleCount = () => isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;
