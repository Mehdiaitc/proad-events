window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const maskedText = document.querySelector('.masked-text');
    const slogan = document.getElementById('main-slogan');

    if (maskedText) {
        // 1. Remplissage liquide (de 0 à 500px de scroll)
        let fillProgress = 100 - Math.min(scrollPos / 500, 1) * 100;
        maskedText.style.setProperty('--fill-progress', `${fillProgress}%`);

        // 2. Zoom focalisé (Commence après 400px de scroll)
        if (scrollPos > 400) {
            // Croissance fluide
            let scale = 1 + Math.pow((scrollPos - 400) / 300, 3.5);
            maskedText.style.transform = `scale(${scale})`;
            
            // Disparition du slogan et du texte pendant l'entrée dans le tunnel
            if (slogan) slogan.style.opacity = 1 - (scrollPos - 400) / 300;
            
            if (scale > 15) {
                maskedText.style.opacity = 1 - (scale - 15) / 10;
            } else {
                maskedText.style.opacity = 1;
            }
        } else {
            maskedText.style.transform = `scale(1)`;
            if (slogan) slogan.style.opacity = 1;
            maskedText.style.opacity = 1;
        }
    }
});

// Apparition des étapes
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.3 });

document.querySelectorAll('.step-card').forEach(card => observer.observe(card));
