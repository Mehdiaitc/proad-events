window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const slogan = document.getElementById('main-slogan');
    const textContainer = document.querySelector('.text-mask-container');

    if (textContainer) {
        const maskedText = textContainer.querySelector('.masked-text');

        // 1. Remplissage liquide (de 0 à 500 de scroll)
        let fillProgress = 100 - Math.min(scrollPos / 500, 1) * 100;
        maskedText.style.setProperty('--fill-progress', `${fillProgress}%`);

        // 2. Zoom Tunnel focalisé sur le O
        if (scrollPos > 400) {
            // Croissance fluide
            let scale = 1 + Math.pow((scrollPos - 400) / 250, 3.5);
            textContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
            
            // On cache le slogan
            if (slogan) slogan.style.opacity = 1 - (scrollPos - 400) / 300;
            
            // Disparition douce du mot
            if (scale > 12) {
                textContainer.style.opacity = 1 - (scale - 12) / 10;
            } else {
                textContainer.style.opacity = 1;
            }
        } else {
            textContainer.style.transform = `translate(-50%, -50%) scale(1)`;
            if (slogan) slogan.style.opacity = 1;
            textContainer.style.opacity = 1;
        }
    }
});

// Apparition des étapes sur le camion
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });

document.querySelectorAll('.step-card').forEach(card => observer.observe(card));
