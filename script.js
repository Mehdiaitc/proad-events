window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const maskedText = document.querySelector('.masked-text');
    
    // Animation de zoom sur le texte au scroll
    if (maskedText) {
        let scale = 1 + scrollPos / 800;
        maskedText.style.transform = `scale(${scale})`;
        
        // Optionnel : fait disparaître doucement le texte s'il devient trop gros
        if (scale > 3) {
            maskedText.style.opacity = 1 - (scale - 3);
        } else {
            maskedText.style.opacity = 1;
        }
    }
});
