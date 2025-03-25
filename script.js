// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Original GSAP animations for the SVG
const tl = gsap.timeline({
    defaults: {
        duration: 2,
        yoyo: true,
        ease: 'power2.inOut'
    }
})
.fromTo('.left, .right', {
    svgOrigin: '640 500',
    skewY: (i) => [-30, 15][i],
    scaleX: (i) => [0.6, 0.85][i],
    x: 200
}, {
    skewY: (i) => [-15, 30][i],
    scaleX: (i) => [0.85, 0.6][i],
    x: -200
})
.play(0.5);

// Updated synchronized text animation
const tl2 = gsap.timeline();
const allTexts = gsap.utils.toArray('.left text, .right text');

gsap.set(allTexts, {
    xPercent: -100,
    x: 700
});

tl2.to(allTexts, {
    duration: 1,
    xPercent: 0,
    x: 575,
    ease: 'sine.inOut',
    stagger: 0 // This ensures all texts move together
});

window.onpointermove = (e) => {
    tl.pause();
    tl2.pause();
    gsap.to([tl, tl2], {
        duration: 2,
        ease: 'power4',
        progress: e.x / innerWidth
    });
};

// Initialize section animations
document.addEventListener('DOMContentLoaded', () => {
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1
        });
    });

    gsap.utils.toArray('.section-content').forEach(content => {
        gsap.from(content, {
            scrollTrigger: {
                trigger: content,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.3
        });
    });
});

/* Remove the card-related JavaScript code:
- Remove the panels querySelector
- Remove the click event listeners for panels
*/

// Enhanced cursor effect
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Check if mouse is over home section or nav buttons
    const isOnHome = e.target.closest('#home');
    const isOnButton = e.target.closest('.nav-btn');
    
    if (isOnHome || isOnButton) {
        cursor.style.opacity = '1';
    } else {
        cursor.style.opacity = '0';
    }
});

// Add hollow cursor effect for navigation buttons
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        cursor.classList.add('hollow');
    });
    
    btn.addEventListener('mouseleave', () => {
        cursor.classList.remove('hollow');
    });
});