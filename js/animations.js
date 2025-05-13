// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
});

// Load Lottie animations
const aboutAnimation = lottie.loadAnimation({
    container: document.getElementById('aboutAnimation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json' // Inspiration/Learning animation
});

const contactAnimation = lottie.loadAnimation({
    container: document.getElementById('contactAnimation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets9.lottiefiles.com/packages/lf20_u25cckyh.json' // Contact/Message animation
});
