/**
 * Rays - Shader Module
 * GLSL shader code for particles and fractals
 */

// =============================================================================
// PARTICLE SHADERS
// =============================================================================

export const particleVertexShader = `
    uniform float uTime;
    uniform float uAudioTotal;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uSizeMult;
    uniform float uAudioStrength;

    attribute float aScale;
    attribute vec3 aRandom;
    
    varying vec3 vColor;

    void main() {
        vec3 pos = position;
        float spreadX = 40.0; 
        float spreadY = 25.0;
        float spreadZ = 20.0;

        vec3 initialPos;
        initialPos.x = (aRandom.x - 0.5) * spreadX;
        initialPos.y = (aRandom.y - 0.5) * spreadY;
        initialPos.z = (aRandom.z - 0.5) * spreadZ - 2.0; 

        float angle = uTime * 0.5 + aRandom.x * 2.0;
        float c = cos(angle);
        float s = sin(angle);

        pos.x = initialPos.x * c - initialPos.z * s;
        pos.z = initialPos.x * s + initialPos.z * c;
        pos.y = initialPos.y + sin(uTime + aRandom.z * 10.0) * 0.5;

        pos += normalize(pos) * uAudioTotal * 2.0 * aRandom.y * uAudioStrength;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        float audioSize = (uAudioTotal * 3.0) * uAudioStrength;
        gl_PointSize = (uSizeMult * aScale + audioSize) * (30.0 / -mvPosition.z);
        
        float mixVal = (uAudioTotal * uAudioStrength * 0.5) + aRandom.x;
        vColor = mix(uColorA, uColorB, clamp(mixVal, 0.0, 1.0));
    }
`;

export const particleFragmentShader = `
    varying vec3 vColor;
    
    void main() {
        vec2 uv = gl_PointCoord.xy - 0.5;
        float r = length(uv);
        if(r > 0.5) discard;
        float glow = 1.0 - (r * 2.0);
        glow = pow(glow, 2.0);
        gl_FragColor = vec4(vColor, glow);
    }
`;

// =============================================================================
// FRACTAL SHADERS (for future Mandelbulb feature)
// =============================================================================

export const fractalVertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const fractalFragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uAudioTotal;
    uniform float uAudioLow;
    
    varying vec2 vUv;
    varying vec3 vPosition;

    float map(vec3 p) {
        vec3 w = p;
        float m = dot(w,w);
        float dzlen = 1.0;
        float r = 0.0;
        float dr = 1.0;
        float power = 8.0 + (uAudioLow * 4.0); 

        for(int i=0; i<8; i++) {
            r = length(w);
            if(r > 2.0) break;
            float theta = acos(w.z/r);
            float phi = atan(w.y, w.x);
            dr = pow(r, power-1.0)*power*dr + 1.0;
            float zr = pow(r, power);
            theta = theta * power + uTime * 0.1;
            phi = phi * power;
            w = zr * vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
            w += p;
        }
        return 0.5 * log(r) * r / dr;
    }

    vec3 getNormal(vec3 p) {
        float d = map(p);
        vec2 e = vec2(0.001, 0.0);
        return normalize(vec3(
            map(p+e.xyy) - map(p-e.xyy),
            map(p+e.yxy) - map(p-e.yxy),
            map(p+e.yyx) - map(p-e.yyx)
        ));
    }

    void main() {
        vec3 ro = cameraPosition; 
        vec3 rd = normalize(vPosition - cameraPosition);

        float t = 0.0;
        float d = 0.0;
        int steps = 0;
        
        for(int i=0; i<64; i++) {
            vec3 p = ro + rd * t;
            d = map(p);
            if(d < 0.002 || t > 10.0) break;
            t += d;
            steps = i;
        }

        vec3 color = vec3(0.0);
        if(t < 10.0) {
            vec3 p = ro + rd * t;
            vec3 normal = getNormal(p);
            vec3 baseColor = vec3(0.1, 0.6, 0.9);
            baseColor = mix(baseColor, vec3(1.0, 0.2, 0.4), uAudioLow); 
            float light = max(dot(normal, vec3(0.5, 0.8, 0.5)), 0.0);
            float rim = pow(1.0 - max(dot(normal, -rd), 0.0), 3.0);
            color = baseColor * (light * 0.5 + 0.2) + rim * 2.0;
            color *= (1.0 - float(steps)/64.0);
        } else {
            discard;
        }
        gl_FragColor = vec4(color, 1.0);
    }
`;
