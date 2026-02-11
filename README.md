<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=E37EAF&height=220&section=header&text=The%20Promise&fontSize=80&fontColor=ffffff&fontAlign=50&animation=fadeIn&fontAlignY=35" alt="The Promise Header" width="100%"/>

  <br/>

  #  The Promise | A Cinematic Experience
  
  **A 3D Interactive Web Experience for Promise Day**
  
  <br/>

  [![Live Demo](https://img.shields.io/badge/DEMO-LIVE_PREVIEW-E37EAF?style=for-the-badge&logo=vercel&logoColor=white)](https://your-demo-link-here.com)
  [![License](https://img.shields.io/badge/LICENSE-MIT-060304?style=for-the-badge)](LICENSE)
  [![Made with Love](https://img.shields.io/badge/MADE_WITH-%E2%9D%A4%EF%B8%8F-E37EAF?style=for-the-badge)](https://github.com/1sarthak7)

  <p align="center">
    "Today, I make a promise. To stay. To grow. To choose you."
  </p>

</div>

---

##  Overview

**The Promise** is not just a website; it's a digital short film. It moves away from generic, flashy designs to offer a **premium, Apple-style cinematic experience**. 

Built with **Three.js**, it features a particle system that starts as chaotic "stardust" and purely through the mathematics of your scroll, morphs into a perfect **3D Heart** as you make your final promise.

![Cinematic Preview](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm90Zm91bmQ/giphy.gif) 
*(Replace this link with a screenshot or GIF of your actual site for the best effect!)*

##  Aesthetic & Palette

The design philosophy is **"Midnight Romance"** — deep, dark tones with soft, glowing accents.

| Color | Hex | Visual Role |
| :--- | :--- | :--- |
| **Midnight Rose** | `#060304` | Deep cinematic background |
| **Blush Glow** | `#E37EAF` | Particles, Accents, Key Text |
| **Pure White** | `#FFFFFF` | Primary Typography |

---

##  Key Features

### 🌪️ The "Morph" Engine
The core of the experience is a custom math-based particle system.
- **State A:** 1200+ particles float in random chaos (The Universe).
- **State B:** As you scroll, they mathematically align into a 3D Heart (The Promise).
- **Logic:** Uses `Linear Interpolation (Lerp)` linked to scroll percentage.

###  Mobile Optimization
- **Dynamic Viewport Units (`dvh`)**: Prevents "jumpy" backgrounds on mobile browsers.
- **Adaptive Camera**: The 3D camera physically moves back (`z-index` shift) on narrower screens to ensure the heart is never cut off.
- **Battery Friendly**: Reduces particle count dynamically on mobile devices to maintain 60FPS.

###  Immersive Audio
- Features a **"Tap to Experience"** overlay that bypasses browser autoplay policies.
- Fades out smoothly to reveal the 3D world.

---

##  Technology Stack

<div align="center">

| Technology | Usage |
| :--- | :--- |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" width="40"/> **HTML5** | Semantic Structure |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="40"/> **CSS3** | Animations, Flexbox, Glassmorphism |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="40"/> **JavaScript** | Logic, Scroll Triggers (ES6) |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg" width="40"/> **Three.js** | 3D WebGL Rendering |

</div>

---

##  Installation & Usage

Since this is a static site, no build tools (npm/yarn) are required!

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/yourusername/the-promise.git](https://github.com/yourusername/the-promise.git)
    ```

2.  **Open the Folder**
    Navigate to the folder where you cloned it.

3.  **Run Locally**
    * **Option A (VS Code):** Install "Live Server" extension -> Right Click `index.html` -> "Open with Live Server".
    * **Option B (Python):** ```bash
        python -m http.server
        ```
    * **Option C (Direct):** Since we used the Global build of Three.js, you can often just double-click `index.html` (though a local server is recommended for audio loading).

---

##  File Structure

```text
/
├── index.html       # The stage (DOM structure)
├── style.css        # The costume (Styling & Animations)
├── script.js        # The actor (3D Logic & Interactivity)
└── assets/          # (Optional) Audio files if downloaded

```

## Contributing
Feel free to fork this project and create your own version for your special someone.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingLove)

Commit your Changes (git commit -m 'Add some sparkle')

Push to the Branch (git push origin feature/AmazingLove)

Open a Pull Request

<div align="center">

## Made with 💖 by Sarthak

<a href="https://github.com/yourusername"> <img src="https://www.google.com/search?q=https://img.shields.io/github/followers/yourusername%3Flabel%3DFollow%26style%3Dsocial" alt="GitHub Followers"/> </a>

</div>
