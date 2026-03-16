window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const maskedText = document.querySelector('.masked-text');
    
    if (maskedText) {
        // 1. Gestion de l'illumination (Opacité du pseudo-élément ::before)
        // On devient lumineux entre 0 et 400px de scroll
        let illumination = scrollPos / 400;
        illumination = Math.min(Math.max(illumination, 0), 1);
        maskedText.style.setProperty('--illumination-opacity', illumination);
        
        // Pour que ça marche en CSS, on va directement modifier l'opacité via JS ici :
        const style = document.createElement('style');
        style.innerHTML = `.masked-text::before { opacity: ${illumination}; }`;
        document.head.appendChild(style);

        // 2. Gestion du Zoom (Tunnel)
        if (scrollPos > 400) {
            let scale = 1 + (scrollPos - 400) / 400;
            maskedText.style.transform = `scale(${scale})`;
            maskedText.style.opacity = 1 - (scrollPos - 800) / 400;
        } else {
            maskedText.style.transform = `scale(1)`;
            maskedText.style.opacity = 1;
        }
    }
});
