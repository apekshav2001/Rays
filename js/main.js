/**
 * Rays - Audio Reactive Particles
 * Main Entry Point
 * 
 * A beautiful audio-reactive particle visualization with WebGL
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// Local modules
import {
    DEFAULT_PARAMS,
    COLOR_PRESETS,
    CAMERA_DISTANCE,
    FOG_DENSITY,
    MAX_PIXEL_RATIO,
    getParticleCount,
    isMobile,
    prefersReducedMotion
} from './config.js';

import { particleVertexShader, particleFragmentShader } from './shaders.js';
import { UIController } from './ui.js';

// =============================================================================
// GLOBAL STATE
// =============================================================================

let camera, scene, renderer, composer;
let particleSystem;
let uiController;
let customTime = 0;
let isRunning = false;

const clock = new THREE.Clock();
const params = { ...DEFAULT_PARAMS };

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize the visualization
 */
async function init() {
    // Hide overlay
    const overlay = document.getElementById('overlay');
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 800);

    // Setup UI controller first
    uiController = new UIController();
    uiController.cacheElements();

    // Setup Three.js scene
    setupScene();
    setupParticles();
    setupPostProcessing();
    setupGUI();

    // Setup UI interactions
    uiController.setupAutoHide();
    uiController.setupKeyboard(params);

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('resize', onWindowResize);

    // Start animation
    isRunning = true;
    animate();
}


/**
 * Setup Three.js scene
 */
function setupScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, FOG_DENSITY);

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(0, 0, CAMERA_DISTANCE);

    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    document.body.appendChild(renderer.domElement);

    // Check WebGL capabilities
    if (!renderer.capabilities.isWebGL2) {
        console.warn('WebGL 2 not available, using WebGL 1');
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
}

/**
 * Setup particle system
 * @param {number} count - Number of particles
 */
function setupParticles(count) {
    // Cleanup old system if exists
    if (particleSystem) {
        scene.remove(particleSystem);
        particleSystem.geometry.dispose();
        particleSystem.material.dispose();
    }

    const particleCount = count || getParticleCount();
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        scales[i] = Math.random();
        randoms[i * 3] = Math.random();
        randoms[i * 3 + 1] = Math.random();
        randoms[i * 3 + 2] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

    const material = new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(params.color1) },
            uColorB: { value: new THREE.Color(params.color2) },
            uSizeMult: { value: params.baseSize }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

/**
 * Setup post-processing effects
 */
function setupPostProcessing() {
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        params.bloomStrength,
        0.4,
        0.85
    );
    bloomPass.threshold = 0.1;
    bloomPass.radius = 0.5;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Store reference for GUI
    window.bloomPass = bloomPass;
}

/**
 * Setup GUI controls
 */
function setupGUI() {
    const gui = new GUI({ title: '✦ Rays Controls' });
    gui.close();
    uiController.gui = gui;

    // Theme Presets
    const folderPresets = gui.addFolder('Theme Presets');
    folderPresets.add(params, 'preset', Object.keys(COLOR_PRESETS)).name('Theme').onChange(preset => {
        if (COLOR_PRESETS[preset]) {
            params.color1 = COLOR_PRESETS[preset].color1;
            params.color2 = COLOR_PRESETS[preset].color2;
            particleSystem.material.uniforms.uColorA.value.set(params.color1);
            particleSystem.material.uniforms.uColorB.value.set(params.color2);
            gui.controllersRecursive().forEach(c => {
                if (c.property === 'color1' || c.property === 'color2') c.updateDisplay();
            });
        }
    });

    // Colors
    const folderColors = gui.addFolder('Colors');
    folderColors.addColor(params, 'color1').name('Primary').onChange(v => {
        particleSystem.material.uniforms.uColorA.value.set(v);
        params.preset = 'Custom';
    });
    folderColors.addColor(params, 'color2').name('Secondary').onChange(v => {
        particleSystem.material.uniforms.uColorB.value.set(v);
        params.preset = 'Custom';
    });

    // Particles
    const folderParticles = gui.addFolder('Particles');
    folderParticles.add(params, 'speed', 0.0, 2.0).name('Speed');
    folderParticles.add(params, 'baseSize', 0.1, 10.0).name('Size').onChange(v => {
        particleSystem.material.uniforms.uSizeMult.value = v;
    });


    // Glow
    const folderBloom = gui.addFolder('Glow');
    folderBloom.add(params, 'bloomStrength', 0.0, 3.0).name('Bloom Intensity').onChange(v => {
        window.bloomPass.strength = v;
    });

    // Text
    const folderText = gui.addFolder('Text Settings');
    folderText.add(params, 'text').name('Custom Text').onChange(v => {
        const el = document.getElementById('custom-text');
        if (el) el.textContent = v;
    });
    folderText.add(params, 'textFont', Object.keys(FONTS)).name('Font').onChange(v => {
        const el = document.getElementById('custom-text');
        if (el) el.style.fontFamily = FONTS[v];
    });
    folderText.add(params, 'textPosition', ['top', 'center', 'bottom']).name('Position').onChange(v => {
        updateTextPosition(v);
    });
}

// =============================================================================
// ANIMATION LOOP
// =============================================================================

/**
 * Main animation loop
 */
function animate(timestamp = 0) {
    if (!isRunning) return;
    requestAnimationFrame(animate);

    // FPS throttling
    if (params.lowFpsMode && !uiController.shouldRenderFrame(timestamp)) {
        return;
    }

    const delta = clock.getDelta();

    // Update time
    customTime += delta * params.speed;
    if (particleSystem) {
        particleSystem.material.uniforms.uTime.value = customTime;
    }

    composer.render();
}

/**
 * Handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function cleanup() {
    isRunning = false;
    if (uiController) uiController.dispose();
    if (renderer) renderer.dispose();
}

const FONTS = {
    'Great Vibes': "'Great Vibes', cursive",
    'Pinyon Script': "'Pinyon Script', cursive",
    'Alex Brush': "'Alex Brush', cursive",
    'Tangerine': "'Tangerine', cursive",
    'Dancing Script': "'Dancing Script', cursive"
};

function updateTextPosition(position) {
    const overlay = document.getElementById('text-overlay');
    if (!overlay) return;
    overlay.classList.remove('pos-top', 'pos-center', 'pos-bottom');
    overlay.classList.add('pos-' + (position || 'center'));
}

/**
 * Lively Wallpaper Property Listener
 */
window.livelyPropertyListener = (name, value) => {
    const textElement = document.getElementById('custom-text');
    switch (name) {
        case 'theme':
            const themes = Object.keys(COLOR_PRESETS);
            const selectedTheme = themes[value];
            if (selectedTheme && COLOR_PRESETS[selectedTheme]) {
                params.color1 = COLOR_PRESETS[selectedTheme].color1;
                params.color2 = COLOR_PRESETS[selectedTheme].color2;
                if (particleSystem) {
                    particleSystem.material.uniforms.uColorA.value.set(params.color1);
                    particleSystem.material.uniforms.uColorB.value.set(params.color2);
                }
            }
            break;
        case 'particles':
            setupParticles(value);
            break;
        case 'fps':
            const fpsMap = [15, 30, 60];
            uiController.targetFps = fpsMap[value] || 60;
            break;
        case 'speed':
            params.speed = value;
            break;
        case 'bloom':
            if (window.bloomPass) window.bloomPass.enabled = value;
            break;
        case 'bloomStrength':
            params.bloomStrength = value;
            if (window.bloomPass) window.bloomPass.strength = value;
            break;
        case 'size':
            params.baseSize = value;
            if (particleSystem) {
                particleSystem.material.uniforms.uSizeMult.value = value;
            }
            break;
        case 'static':
            isRunning = !value;
            break;
        case 'text':
            if (textElement) textElement.textContent = value;
            break;
        case 'textFont':
            const fontList = ['Great Vibes', 'Pinyon Script', 'Alex Brush', 'Tangerine', 'Dancing Script'];
            const fontName = typeof value === 'number' ? fontList[value] : value;
            if (textElement && FONTS[fontName]) textElement.style.fontFamily = FONTS[fontName];
            break;
        case 'textSize':
            const sizeList = ['4vw', '6vw', '8vw', '10vw', '12vw', '15vw'];
            const sizeVal = typeof value === 'number' ? sizeList[value] : value;
            if (textElement) textElement.style.fontSize = sizeVal;
            break;
        case 'textPosition':
            const positionList = ['top', 'center', 'bottom'];
            const posVal = typeof value === 'number' ? positionList[value] : value;
            updateTextPosition(posVal);
            break;
        case 'textGlow':
            if (textElement) {
                textElement.style.animation = value ? 'textGlow 4s ease-in-out infinite alternate' : 'none';
            }
            break;
    }

    // Update GUI if visible
    if (uiController && uiController.gui) {
        uiController.updateGUIDisplay();
    }
};

// =============================================================================
// STARTUP
// =============================================================================

// Set initial overlay text
document.getElementById('overlay-title').innerText = 'Rays';
document.getElementById('overlay-subtitle').innerText = 'Click anywhere to begin';

// Add click listener
document.getElementById('overlay').addEventListener('click', init);

// Add touch support for mobile
document.getElementById('overlay').addEventListener('touchstart', init, { once: true });
