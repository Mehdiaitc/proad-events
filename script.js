window.addEventListener('scroll', () => {
    const S = window.scrollY;

    const wordContainer = document.querySelector('.word-container');
    const letters       = document.querySelectorAll('.letter');
    const targetO       = document.querySelector('.target-o');
    const adn           = document.querySelector('.adn-reveal-zone');
    const indicator     = document.querySelector('.scroll-indicator');
    const slogan        = document.getElementById('main-slogan');

    // Remplissage des lettres au scroll
    letters.forEach((l, i) => {
        if (S > i * 110) l.classList.add('filled');
        else l.classList.remove('filled');
    });

    // Zoom dans le O
    if (S > 400 && S < 2800) {
        const zoomProg = S - 400;
        const scale    = 1 + Math.pow(zoomProg / 250, 3.5);
        const rect     = targetO.getBoundingClientRect();
        const offsetX  = (window.innerWidth  / 2) - (rect.left + rect.width  / 2);
        const offsetY  = (window.innerHeight / 2) - (rect.top  + rect.height / 2);

        wordContainer.style.transform = `translate(${offsetX * (scale / 2.5)}px, ${offsetY * (scale / 2.5)}px) scale(${scale})`;

        if (scale > 4) {
            const fade = Math.min((scale - 4) / 6, 1);
            adn.style.opacity           = fade;
            adn.style.filter            = `blur(${20 - fade * 20}px)`;
            wordContainer.style.opacity = Math.max(0, 1 - fade * 1.5);
            if (fade > 0.8) indicator.style.opacity = 1;
        } else {
            adn.style.opacity       = 0;
            indicator.style.opacity = 0;
        }

        if (slogan) slogan.style.opacity = Math.max(0, 1 - (S - 400) / 300);
    }
});
