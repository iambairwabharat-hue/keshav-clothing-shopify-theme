# Plus X 15th Anniversary — 1:1 Interactive Web Experience

A pixel-perfect, high-performance 1:1 replica of the **Plus X 15th Anniversary** website ([15th.plus-ex.com](https://15th.plus-ex.com/)).

---

## ✨ Features

- **3D WebGL Kinetic Sculpture**: Powered by **Three.js** with custom OBJ model (`3d/imgi_1_default.obj`), 3-point studio lighting, depth fog, and scroll-bound momentum rotation.
- **Lenis Smooth Scrolling**: Weighted inertia and friction damping synchronized directly with **GSAP ScrollTrigger**.
- **Continuous Elliptical Curve Oscillating Streams**: 24 distinct brand and interaction cards swaying horizontally across elliptical arcs on scroll.
- **Clip-Path Image Curtain Masks**: Bottom-up curtain unmasking (`clip-path: inset(100% 0 0 0)` to `inset(0 0 0 0)`) with scaling dynamics.
- **Kinetic Split-Line Typography & Parallax**: Left/right scrubbed text sliding across headlines, chapter openers, and dual manifestos.
- **Interactive Project Archive & Awards**: 56+ projects with category filters and floating cursor thumbnail preview; 97+ animated awards counter.
- **Light / Dark Theme Switching**: Dynamic environmental transitions across CSS variables, WebGL materials, and studio lights.

---

## 🚀 Getting Started

### Run Locally (Zero Dependencies)

```bash
# Start the local server
node server.js
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📁 Directory Structure

```
├── 3d/                 # 3D OBJ model assets
├── assets/             # High-resolution brand, UX, and portfolio images
│   ├── bx/             # Brand Experience showcase assets
│   ├── ux/             # User Experience showcase assets
│   ├── sharex/         # ShareX and Generative AI visual cards
│   └── portfolio/      # 100+ project thumbnails for archive & awards
├── index.html          # Main HTML structure & chapter sections
├── style.css           # 12-column dynamic CSS Grid & design system
├── app.js              # Lenis smooth scroll, GSAP animations & interactions
├── three-scene.js      # Three.js 3D WebGL engine & lighting setup
├── OBJLoader.js        # Three.js OBJ model loader
└── server.js           # Lightweight local HTTP server
```

---

## 🛠️ Tech Stack

- **HTML5 & CSS3** (Custom 12-column dynamic grid system)
- **JavaScript (ES6+)**
- **Three.js (r128)** + `OBJLoader`
- **GSAP (3.12.5)** + `ScrollTrigger`
- **Lenis (1.1.9)** (Smooth Scroll Engine)

---

## 📄 License

MIT License. Educational recreation inspired by Plus X Creative Inc.
