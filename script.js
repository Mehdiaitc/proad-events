window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const slogan = document.getElementById('main-slogan');
    // On vise le conteneur, pas le texte direct, pour mieux maîtriser l'axe
    const textContainer = document.querySelector('.text-mask-container');

    if (textContainer) {
        const maskedText = textContainer.querySelector('.masked-text');

        // 1. Remplissage liquide (0 à 400px de scroll)
        let fillProgress = 100 - Math.min(scrollPos / 400, 1) * 100;
        maskedText.style.setProperty('--fill-progress', `${fillProgress}%`);

        // 2. Zoom Tunnel focalisé sur le O
        if (scrollPos > 300) {
            // Croissance exponentielle pour "entrer" dans le O
            let scale = 1 + Math.pow((scrollPos - 300) / 200, 3);
            textContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
            
            // On cache le slogan pendant le zoom
            if (slogan) slogan.style.opacity = 1 - (scrollPos - 300) / 200;

            // Disparition douce du mot quand il devient géant
            if (scale > 10) {
                textContainer.style.opacity = 1 - (scale - 10) / 10;
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
