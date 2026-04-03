// --- 1. Animation GSAP Intro "Waouh" ---
const tl = gsap.timeline();

// Trait de lumière au centre
tl.to('.intro-bg', { width: '100%', duration: 1.2, ease: "power4.inOut" })
// Le texte se remplit d'or
  .to('.intro-logo::before', { width: '100%', duration: 1.5, ease: "power2.inOut", cssRule: { width: "100%" } })
// Flash blanc
  .to('.intro-flash', { opacity: 1, duration: 0.1 })
// Disparition de l'intro
  .to('.intro-container', { display: 'none', opacity: 0, duration: 0.5 })
// Le fond redevient normal
  .to('.intro-flash', { opacity: 0, duration: 1 })
// Apparition cinématique du site
  .to('.header', { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.5")
  .to('.hero-title', { y: 0, duration: 1.2, stagger: 0.2, ease: "power4.out" }, "-=1")
  .to('.hero-subtitle', { opacity: 1, y: -20, duration: 1 }, "-=0.8")
  .to('.btn-container', { opacity: 1, y: -20, duration: 1 }, "-=0.6");


// --- 2. Curseur Élite (Smooth Follow) ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Le point suit instantanément
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

// Animation fluide du cercle extérieur
function animateCursor() {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;
    outlineX += distX * 0.15; // Facteur de fluidité
    outlineY += distY * 0.15;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Interactions du curseur sur les éléments cliquables
document.querySelectorAll('a, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-active'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-active'));
});


// --- 3. Effet Magnétique (Boutons et Cartes) ---
const magneticEls = document.querySelectorAll('.magnetic');

magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const position = el.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        const strength = el.getAttribute('data-strength') || 20;
        
        gsap.to(el, {
            x: x / position.width * strength,
            y: y / position.height * strength,
            duration: 0.5,
            ease: "power2.out"
        });

        // Effet de lumière interne (Glow) sur les cartes
        const glow = el.querySelector('.card-glow');
        if(glow) {
            glow.style.left = `${e.clientX - position.left - 75}px`;
            glow.style.top = `${e.clientY - position.top - 75}px`;
        }
    });

    el.addEventListener('mouseleave', () => {
        // Retour à la position initiale comme un ressort
        gsap.to(el, {
            x: 0, y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
    });
});


// --- 4. Arrière-plan Interactif (Canvas Réseau Doré) ---
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let w, h, particles;

function initCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = [];
    for(let i=0; i<80; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            size: Math.random() * 2
        });
    }
}

function drawCanvas() {
    ctx.clearRect(0, 0, w, h);
    
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > w) p.vx *= -1;
        if(p.y < 0 || p.y > h) p.vy *= -1;
        
        // Interaction avec la souris
        let dx = mouseX - p.x;
        let dy = mouseY - p.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 150) {
            p.x -= dx * 0.02;
            p.y -= dy * 0.02;
        }

        ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(drawCanvas);
}

window.addEventListener('resize', initCanvas);
initCanvas();
drawCanvas();