window.addEventListener('load', () => {
    
    // --- 1. Overlay & Audio ---
    const startOverlay = document.getElementById('start-overlay');
    const audio = document.getElementById('ambient-music');

    startOverlay.addEventListener('click', () => {
        startOverlay.style.opacity = '0';
        startOverlay.style.pointerEvents = 'none';
        setTimeout(() => startOverlay.style.display = 'none', 1000);
        if (audio) {
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio waiting for interaction", e));
        }
    });

    // --- 2. Three.js Setup ---
    const canvas = document.querySelector('#bg-canvas');
    const scene = new THREE.Scene();
    
    // Match the dark palette background
    scene.background = new THREE.Color('#060304');
    // Fog to fade particles into the distance
    scene.fog = new THREE.FogExp2(0x060304, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 3. Heart Texture Helper ---
    function createHeartTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFFFFF"; 
        ctx.beginPath();
        const x = 16, y = 16, size = 10;
        ctx.moveTo(x, y + size / 2);
        ctx.bezierCurveTo(x, y, x - size, y - size, x - size, y - size / 2);
        ctx.bezierCurveTo(x - size, y + size / 2, x, y + size, x, y + size);
        ctx.bezierCurveTo(x, y + size, x + size, y + size / 2, x + size, y - size / 2);
        ctx.bezierCurveTo(x + size, y - size, x, y, x, y + size / 2);
        ctx.fill();
        return new THREE.CanvasTexture(canvas);
    }

    // --- 4. Particle System with Morphing Logic ---
    const CONFIG = {
        count: 2000,           // Number of particles
        color: 0xE37EAF,       // Palette Pink
        heartScale: 0.15,      // Size of the final heart
        spread: 15             // How wide the initial cloud is
    };

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(CONFIG.count * 3);     // Current Positions (render)
    const randomPos = new Float32Array(CONFIG.count * 3);     // State A: Chaos
    const heartPos  = new Float32Array(CONFIG.count * 3);     // State B: Heart Shape

    for(let i = 0; i < CONFIG.count; i++) {
        const i3 = i * 3;

        // --- State A: Random Cloud (The initial scroll) ---
        randomPos[i3]     = (Math.random() - 0.5) * CONFIG.spread; // X
        randomPos[i3 + 1] = (Math.random() - 0.5) * CONFIG.spread * 2; // Y (taller)
        randomPos[i3 + 2] = (Math.random() - 0.5) * 10; // Z depth

        // --- State B: Heart Shape Formula ---
        // We use parametric equations for a heart
        const t = Math.random() * Math.PI * 2; 
        
        // Basic Heart Formula
        let hx = 16 * Math.pow(Math.sin(t), 3);
        let hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        
        // Add some thickness (volume) to the heart so it's 3D
        let hz = (Math.random() - 0.5) * 2; 

        // Apply Scaling and Offset
        heartPos[i3]     = hx * CONFIG.heartScale;
        heartPos[i3 + 1] = hy * CONFIG.heartScale + 1; // +1 to lift it slightly up
        heartPos[i3 + 2] = hz;

        // Start at random positions
        positions[i3]     = randomPos[i3];
        positions[i3 + 1] = randomPos[i3 + 1];
        positions[i3 + 2] = randomPos[i3 + 2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.12,
        map: createHeartTexture(),
        color: CONFIG.color,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- 5. Scroll Logic ( The Morph Trigger ) ---
    let scrollProgress = 0;

    // We calculate how far down the user has scrolled relative to the document height
    function onScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        // 0.0 = Top, 1.0 = Bottom
        scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    }
    window.addEventListener('scroll', onScroll);

    // --- 6. Animation Loop ---
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        
        // Get access to the particle positions
        const currentPositions = particles.geometry.attributes.position.array;

        // Determine the "Morph Factor"
        // We want the heart to form mostly at the end (last 30% of scroll)
        // Adjust these numbers to tune when the heart forms
        let morphFactor = (scrollProgress - 0.6) * 3.5; 
        morphFactor = Math.min(Math.max(morphFactor, 0), 1); // Clamp between 0 and 1

        // Ease the morph factor for smoothness
        // This makes the transition feel "magnetic"
        const smoothMorph = morphFactor * morphFactor * (3 - 2 * morphFactor);

        for(let i = 0; i < CONFIG.count; i++) {
            const i3 = i * 3;

            // Interpolate (Lerp) between Random(A) and Heart(B)
            const targetX = randomPos[i3] * (1 - smoothMorph) + heartPos[i3] * smoothMorph;
            const targetY = randomPos[i3 + 1] * (1 - smoothMorph) + heartPos[i3 + 1] * smoothMorph;
            const targetZ = randomPos[i3 + 2] * (1 - smoothMorph) + heartPos[i3 + 2] * smoothMorph;

            // Add Life: Floating motion
            // We reduce the floating chaos as it forms the heart so the shape is clear
            const floatIntensity = (1 - smoothMorph) * 0.05 + (smoothMorph * 0.01);
            
            const uniqueOffset = i * 0.1; // Randomize wave per particle
            
            // Move current position towards target position (Smooth Follow)
            // This 0.1 factor creates the "trailing" smooth delay effect
            currentPositions[i3]     += (targetX - currentPositions[i3]) * 0.1;
            currentPositions[i3 + 1] += (targetY - currentPositions[i3 + 1]) * 0.1;
            currentPositions[i3 + 2] += (targetZ - currentPositions[i3 + 2]) * 0.1;

            // Add the gentle wave/float on top
            currentPositions[i3 + 1] += Math.sin(elapsedTime * 2 + uniqueOffset) * floatIntensity;
            currentPositions[i3]     += Math.cos(elapsedTime * 1.5 + uniqueOffset) * (floatIntensity * 0.5);
        }

        particles.geometry.attributes.position.needsUpdate = true;
        
        // Gentle overall rotation
        particles.rotation.y = elapsedTime * 0.1;

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    }

    tick();

    // --- 7. Resize & Text Reveal Support ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Simple Intersection Observer for Text Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if(entry.target.id === 'final-promise') {
                    animateFinalText(entry.target);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.promise-item').forEach(el => observer.observe(el));
    const finalSection = document.querySelector('#final-promise');
    if(finalSection) observer.observe(finalSection);

    function animateFinalText(element) {
        if(element.getAttribute('data-animated')) return;
        element.setAttribute('data-animated', 'true');
        const text = element.innerText;
        element.innerHTML = '';
        element.style.opacity = 1;
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.className = 'letter';
            span.style.transitionDelay = `${index * 40}ms`;
            element.appendChild(span);
            setTimeout(() => span.classList.add('active'), 50);
        });
    }
});