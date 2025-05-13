class GreetingSystem {
    constructor() {
        this.visitorName = null;
        this.greetings = {
            morning: [
                "Good morning", 
                "Rise and shine",
                "Welcome to a new day of inspiration"
            ],
            afternoon: [
                "Good afternoon",
                "Hope your day is going well",
                "Time for your daily dose of inspiration"
            ],
            evening: [
                "Good evening",
                "Welcome back for some evening inspiration",
                "End your day with positivity"
            ]
        };
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.showWelcomeModal();

            const saveBtn = document.getElementById('saveNameBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    const nameInput = document.getElementById('visitorName');
                    if (nameInput && nameInput.value.trim()) {
                        this.visitorName = nameInput.value.trim();

                        const modalEl = document.getElementById('welcomeModal');
                        if (modalEl) {
                            bootstrap.Modal.getInstance(modalEl).hide();
                        }

                        this.showGreeting();
                    }
                });
            }
        });
    }

    showWelcomeModal() {
        const modalElement = document.getElementById('welcomeModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    getTimeBasedGreeting() {
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        const greetings = this.greetings[timeOfDay];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    showGreeting() {
        const greeting = this.getTimeBasedGreeting();
        const greetingText = `${greeting}, ${this.visitorName}! 🌟`;

        const greetingElement = document.getElementById('greetingText');
        if (greetingElement) {
            greetingElement.textContent = greetingText;
        }

        const toastEl = document.getElementById('greetingToast');
        if (toastEl) {
            toastEl.classList.add('greeting-animate');

            const toast = new bootstrap.Toast(toastEl);
            toast.show();

            toastEl.addEventListener('hidden.bs.toast', () => {
                toastEl.classList.remove('greeting-animate');
            });
        }
    }
}

// Initialize the greeting system
new GreetingSystem();



// Reading Progress
class ReadingProgress {
    constructor() {
        this.progressBar = document.getElementById('readingProgress');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            this.progressBar.style.width = scrolled + "%";
        });
    }
}

// Theme Switcher
class ThemeSwitcher {    constructor() {
        this.themes = {
            light: {
                '--primary-color': '#ff6b35',
                '--secondary-color': '#2a2a2a',
                '--background': '#ffffff',
                '--text-color': '#2a2a2a',
                '--card-bg': '#ffffff',
                '--navbar-bg': 'rgba(255, 255, 255, 0.95)'
            },
            zen: {
                '--primary-color': '#4a90e2',
                '--secondary-color': '#2c3e50',
                '--background': '#f5f6fa',
                '--text-color': '#2c3e50',
                '--card-bg': '#ffffff',
                '--navbar-bg': 'rgba(245, 246, 250, 0.95)'
            }
        };
        this.init();
    }

    init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('selectedTheme') || 'light';
        this.setTheme(savedTheme);
        
        // Update active button for saved theme
        document.querySelectorAll('.theme-btn').forEach(btn => {
            if (btn.dataset.theme === savedTheme) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.setTheme(theme);
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    setTheme(theme) {
        const root = document.documentElement;
        const body = document.body;

        // Apply CSS variables
        Object.entries(this.themes[theme]).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Update body class and localStorage
        body.className = body.className.replace(/theme-\w+/, '');
        body.classList.add(`theme-${theme}`);
        localStorage.setItem('selectedTheme', theme);
    }
}

// Quote Timer
class QuoteTimer {
    constructor() {
        this.timerElement = document.getElementById('nextQuoteTimer');
        this.init();
    }

    init() {
        this.updateTimer();
        setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const timeLeft = tomorrow - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        this.timerElement.textContent = `Next Quote of the Day in: ${hours}h ${minutes}m ${seconds}s`;
    }
}

// ShareSystem class will be here...

// Share Functionality
class ShareSystem {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                const quote = document.getElementById('quoteText').textContent;
                const author = document.getElementById('quoteAuthor').textContent;
                this.shareQuote(platform, quote, author);
            });
        });
    }

    shareQuote(platform, quote, author) {
        const text = `"${quote}" - ${author}`;
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(text).then(() => {
                alert('Quote copied to clipboard!');
            });
        } else {
            window.open(urls[platform], '_blank');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems    const greetingSystem = new GreetingSystem();    
    const readingProgress = new ReadingProgress();
    const inspireParticles = new InteractiveParticles('inspireParticles');
    const themeSwitcher = new ThemeSwitcher();
    const quoteTimer = new QuoteTimer();
    const shareSystem = new ShareSystem();
    // Initialize smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Navbar color change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            alert(`Thank you ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
            
            // Reset form
            contactForm.reset();
        });
    }

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroSection) {
            heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });

    // Initialize particles
    if (typeof particlesJS !== 'undefined') {
        const updateParticlesColors = (theme) => {
            const particleColor = theme === 'light' ? '#2a2a2a' : theme === 'zen' ? '#4a90e2' : '#ffffff';
            const particleSystem = window.pJSDom[0]?.pJS;
            if (particleSystem) {
                particleSystem.particles.color.value = particleColor;
                particleSystem.particles.line_linked.color = particleColor;
                particleSystem.fn.particlesRefresh();
            }
        };

        // Update particles when theme changes
        document.addEventListener('themeChanged', (e) => {
            updateParticlesColors(e.detail.theme);
        });
    }

    // Initialize resize handlers
    window.addEventListener('resize', () => {
        // Update audio visualizer canvas size
        const visualizer = document.getElementById('audioVisualizer');
        if (visualizer) {
            visualizer.width = visualizer.offsetWidth;
            visualizer.height = visualizer.offsetHeight;
        }
    });
});
