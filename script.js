window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const maskedText = document.querySelector('.masked-text');
    const slogan = document.getElementById('main-slogan');

    if (maskedText) {
        // 1. Remplissage liquide
        let fillProgress = 100 - Math.min(scrollPos / 400, 1) * 100;
        maskedText.style.setProperty('--fill-progress', `${fillProgress}%`);

        // 2. Zoom focalisé sur le O
        if (scrollPos > 300) {
            let scale = 1 + Math.pow((scrollPos - 300) / 200, 3);
            maskedText.style.transform = `scale(${scale})`;
            maskedText.style.opacity = 1 - (scale - 10) / 10;
            if (slogan) slogan.style.opacity = 1 - (scrollPos - 300) / 200;
        } else {
            maskedText.style.transform = `scale(1)`;
            maskedText.style.opacity = 1;
            if (slogan) slogan.style.opacity = 1;
        }
    }
});

// Animation des étapes au scroll (Apparition sur le flanc du camion)
const observerOptions = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.step-card').forEach(card => {
    observer.observe(card);
});
