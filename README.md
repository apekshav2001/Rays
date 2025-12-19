# Rays - Audio Reactive Particles

A beautiful WebGL particle visualization that reacts to audio input.

## Quick Start

### Option 1: Using Live Server (Recommended)

If you have Visual Studio Code:
1. Install the "Live Server" extension
2. Right-click on `index.html` → "Open with Live Server"

### Option 2: Using Python (built-in)

```bash
# Python 3
cd Rays
python -m http.server 8080

# Then open: http://localhost:8080
```

### Option 3: Using Node.js

```bash
# Install serve globally (one-time)
npm install -g serve

# Run server
cd Rays
serve .

# Then open: http://localhost:3000
```

### Option 4: Double-Click (Legacy Mode)

Open `index-standalone.html` for a single-file version that works with `file://`

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F` | Toggle fullscreen |
| `H` | Toggle settings panel |
| `P` | Toggle 30fps battery mode |

## Color Presets

- Ocean, Sunset, Forest, Cosmic, Fire, Aurora

## Project Structure

```
Rays/
├── index.html          (main entry - needs server)
├── index-standalone.html (single-file for file://)
├── css/
│   └── styles.css
├── js/
│   ├── main.js         (entry point)
│   ├── config.js       (constants & presets)
│   ├── shaders.js      (GLSL code)
│   ├── audio.js        (audio analyzer)
│   └── ui.js           (UI controller)
└── README.md
```

## Requirements

- Modern browser with WebGL support
- Microphone access (optional - falls back to ambient mode)
