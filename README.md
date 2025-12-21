# Rays - Particle Wallpaper

![Rays Wallpaper Preview](./preview/preview.png)

A stunning WebGL particle visualization optimized for Lively Wallpaper.

## Lively Wallpaper Setup

To use this as a live wallpaper on your desktop:

1.  **Download & Install** [Lively Wallpaper](https://rocksdanister.github.io/lively/) if you haven't already.
2.  **Open Lively Wallpaper**.
3.  **Add Wallpaper**: Click the "+" (Add) icon in the top left.
4.  **Select File**: Click "Browse" and navigate to the `Rays` folder.
5.  **Target File**: Select `wallpaper/rays-wallpaper.html`. (Alternatively, you can drag and drop the folder into Lively).
6.  **Customize**: Once active, right-click the wallpaper in Lively → "Customise Wallpaper" to adjust:
    - **Custom Text**: Add your own message (e.g., "Hello World", "Stay Focused").
    - **Particle Size & Count**: Control the density and scale of the nebula.
    - **Color Themes**: Includes the new "Universe" theme (pure white) and others like Ocean, Cosmic, and Sunset.
    - **Bloom/Glow Intensity**: Adjust the ethereal glow effect.
    - **Animation Speed & Motion**: Control how fast and how much the particles move.

---

## Other Usage Options

### Local Development / Browser

- **Option 1 (Recommended)**: Right-click `index.html` → "Open with Live Server" (VS Code extension).
- **Option 2 (Python)**: `python -m http.server 8080` in the project root.
- **Option 3 (Standalone)**: Open `standalone.html` directly in any browser for a zero-setup experience.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F` | Toggle fullscreen |
| `H` | Toggle settings panel |
| `P` | Toggle 30fps battery mode |

## Project Structure

```
Rays/
├── index.html          (Main browser entry)
├── standalone.html      (Single-file browser version)
├── wallpaper/
│   ├── rays-wallpaper.html (Entry point for Lively)
│   └── LivelyProperties.json (Settings configuration)
├── js/
│   ├── main.js         (Engine logic)
│   ├── config.js       (Constants & presets)
│   ├── shaders.js      (GLSL code)
│   └── ui.js           (User interface)
├── css/
│   └── styles.css
└── README.md
```

## Requirements

- Windows 10/11 (for Lively Wallpaper)
- Modern browser with WebGL support
- GPU with decent performance for high particle counts
