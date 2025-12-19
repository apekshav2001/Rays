/**
 * Rays - Audio Module
 * Handles microphone input and audio analysis with proper cleanup
 */

// =============================================================================
// AUDIO ANALYZER CLASS
// =============================================================================

export class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.stream = null;
        this.isActive = false;

        // Audio uniform values (smoothed)
        this.uniforms = {
            low: 0,
            mid: 0,
            high: 0,
            total: 0
        };
    }

    /**
     * Initialize audio capture from microphone
     * @returns {Promise<{success: boolean, deviceName: string, error?: string}>}
     */
    async init() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const track = this.stream.getAudioTracks()[0];
            const deviceName = track.label || 'Default Audio Device';

            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            const source = this.audioContext.createMediaStreamSource(this.stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            source.connect(this.analyser);

            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.isActive = true;

            return { success: true, deviceName };
        } catch (err) {
            console.error('Audio initialization failed:', err);
            return {
                success: false,
                deviceName: 'None',
                error: err.name === 'NotAllowedError'
                    ? 'Microphone access denied'
                    : err.message
            };
        }
    }

    /**
     * Update audio analysis values (call each frame)
     * @returns {{low: number, mid: number, high: number, total: number, volume: number}}
     */
    update() {
        if (!this.analyser || !this.isActive) {
            return { ...this.uniforms, volume: 0 };
        }

        this.analyser.getByteFrequencyData(this.dataArray);

        let low = 0, mid = 0, high = 0, total = 0;
        const binCount = this.analyser.frequencyBinCount;

        for (let i = 0; i < binCount; i++) {
            const val = this.dataArray[i] / 255.0;
            total += val;
            if (i < binCount / 3) low += val;
            else if (i < 2 * binCount / 3) mid += val;
            else high += val;
        }

        const avgVolume = total / binCount;

        // Smooth the values using lerp
        const lerpFactor = 0.1;
        this.uniforms.total = this.lerp(this.uniforms.total, (total / binCount) * 4.0, lerpFactor);
        this.uniforms.low = this.lerp(this.uniforms.low, (low / (binCount / 3)) * 2.0, lerpFactor);
        this.uniforms.mid = this.lerp(this.uniforms.mid, (mid / (binCount / 3)) * 2.0, lerpFactor);
        this.uniforms.high = this.lerp(this.uniforms.high, (high / (binCount / 3)) * 2.0, lerpFactor);

        return { ...this.uniforms, volume: avgVolume };
    }

    /**
     * Linear interpolation helper
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Clean up audio resources (call on page unload)
     */
    dispose() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.analyser = null;
        this.dataArray = null;
        this.isActive = false;
    }
}

// =============================================================================
// AMBIENT MODE (fallback when no mic)
// =============================================================================

export class AmbientMode {
    constructor() {
        this.time = 0;
        this.uniforms = {
            low: 0,
            mid: 0,
            high: 0,
            total: 0
        };
    }

    /**
     * Generate fake audio data based on time
     * Creates a gentle pulsing effect
     */
    update(deltaTime = 0.016) {
        this.time += deltaTime;

        // Create smooth oscillating values
        const wave1 = (Math.sin(this.time * 0.5) + 1) * 0.15;
        const wave2 = (Math.sin(this.time * 0.3 + 1) + 1) * 0.1;
        const wave3 = (Math.sin(this.time * 0.7 + 2) + 1) * 0.08;

        this.uniforms.total = wave1 + wave2 * 0.5;
        this.uniforms.low = wave1;
        this.uniforms.mid = wave2;
        this.uniforms.high = wave3;

        return { ...this.uniforms, volume: wave1 };
    }

    dispose() {
        // Nothing to clean up
    }
}
