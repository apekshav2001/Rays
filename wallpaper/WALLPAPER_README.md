# Rays Wallpaper - Desktop Live Wallpaper

An optimized version of Rays designed specifically for use as a desktop live wallpaper.

## 🚀 Quick Start

### Option 1: Lively Wallpaper (Recommended)

1. **Install Lively Wallpaper** (free, open-source):
   - Download from [lively.rocksdanister.com](https://www.rocksdanister.com/lively/) or Microsoft Store

2. **Add Rays Wallpaper**:
   - Open Lively Wallpaper
   - Click the `+` button → "Select File"
   - Navigate to this `wallpaper` folder
   - Select `rays-wallpaper.html`
   - Click "Open" → Done!

3. **Customize**:
   - Right-click on the wallpaper thumbnail
   - Click "Customize"
   - Adjust theme, particles, FPS, bloom, etc.

### Option 2: Wallpaper Engine (Steam)

1. Open Wallpaper Engine
2. Click "Open Wallpaper" → Browse
3. Select `rays-wallpaper.html`
4. Customize via URL parameters (see below)

### Option 3: Direct Browser (Preview)

Simply open `rays-wallpaper.html` in any browser to preview.

---

## ⚙️ Configuration

### URL Parameters

Customize the wallpaper by adding URL parameters:

```
rays-wallpaper.html?theme=fire&fps=15&particles=3000&bloom=off
```

| Parameter | Default | Range/Options | Description |
|-----------|---------|---------------|-------------|
| `theme` | `ocean` | ocean, sunset, forest, cosmic, fire, aurora, midnight, cherry | Color preset |
| `color1` | (theme) | hex code (no #) | Primary color, e.g. `ff6b35` |
| `color2` | (theme) | hex code (no #) | Secondary color, e.g. `9b59b6` |
| `particles` | `5000` | 1000-15000 | Number of particles |
| `fps` | `30` | 15, 30, 60 | Frame rate limit |
| `speed` | `0.15` | 0.05-1.0 | Animation speed |
| `size` | `2.5` | 0.5-8.0 | Particle size |
| `bloom` | `on` | on, off | Bloom/glow effect |
| `bloomStrength` | `1.0` | 0.0-2.5 | Bloom intensity |

### Example Configurations

**Ultra Low Power (laptop on battery):**
```
?fps=15&particles=2000&bloom=off
```

**High Quality (desktop):**
```
?fps=60&particles=10000&bloom=on&bloomStrength=1.5
```

**Custom Colors:**
```
?color1=ff0000&color2=0000ff
```

---

## 🎨 Color Themes

| Theme | Primary | Secondary | Vibe |
|-------|---------|-----------|------|
| Ocean | Blue | Cyan | Calm, oceanic |
| Sunset | Orange | Purple | Warm, evening |
| Forest | Green | Teal | Natural, fresh |
| Cosmic | Purple | Pink | Space, dreamy |
| Fire | Red | Gold | Energetic, warm |
| Aurora | Cyan | Violet | Northern lights |
| Midnight | Dark Blue | Violet | Dark, mysterious |
| Cherry | Pink | Peach | Soft, romantic |

---

## 📊 Performance

### Comparison with Original Rays

| Metric | Original | Wallpaper Version |
|--------|----------|-------------------|
| Particles | 15,000 | 5,000 (default) |
| FPS | 60 | 30 (default) |
| Audio Processing | Yes | No |
| UI/GUI | Full | None |
| Bloom | Always | Optional |
| GPU Usage | ~30% | ~8-15% |

### Recommended Settings by Hardware

| Hardware | Particles | FPS | Bloom |
|----------|-----------|-----|-------|
| Laptop (Battery) | 2000 | 15 | Off |
| Laptop (Plugged) | 5000 | 30 | On |
| Desktop (Mid) | 5000 | 30 | On |
| Desktop (High) | 10000 | 60 | On |

---

## 🔧 Troubleshooting

### Wallpaper Not Loading
- Ensure JavaScript is enabled
- Try a different browser (Chrome/Edge recommended)
- Check if Three.js CDN is accessible

### High CPU/GPU Usage
- Lower `particles` count
- Set `fps=15`
- Disable bloom: `bloom=off`

### Colors Not Changing in Lively
- Restart the wallpaper after changing settings
- Some changes require a page refresh

---

## 📝 Files

```
wallpaper/
├── rays-wallpaper.html      # Main wallpaper file
├── LivelyInfo.json          # Lively metadata
├── LivelyProperties.json    # Lively customization UI
└── WALLPAPER_README.md      # This file
```

---

## 📜 License

MIT License - Use freely!
