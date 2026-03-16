window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Zoom Elements
    const wordContainer = document.querySelector('.word-container');
    const letters = document.querySelectorAll('.letter');
    const targetO = document.querySelector('.target-o');
    const adn = document.querySelector('.adn-reveal-zone');
    const indicator = document.querySelector('.scroll-indicator');
    
    // Camion
    const doorLeft = document.querySelector('.door-left');
    const doorRight = document.querySelector('.door-right');
    const balloons = document.querySelectorAll('.balloon-box');

    // 1. ZOOM & ADN (Jusqu'à 2000px)
    letters.forEach((l, i) => {
        if (scrollPos > i * 120) l.classList.add('filled');
        else l.classList.remove('filled');
    });

    if (scrollPos > 400 && scrollPos < 2500) {
        let zoomProg = (scrollPos - 400);
        let scale = 1 + Math.pow(zoomProg / 250, 3.5);
        
        const rect = targetO.getBoundingClientRect();
        const offsetX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
        const offsetY = (window.innerHeight / 2) - (rect.top + rect.height / 2);
        wordContainer.style.transform = `translate(${offsetX * (scale/2.5)}px, ${offsetY * (scale/2.5)}px) scale(${scale})`;
        
        if (scale > 4) {
            let fade = Math.min((scale - 4) / 5, 1);
            adn.style.opacity = fade;
            adn.style.filter = `blur(${20 - (fade * 20)}px)`;
            wordContainer.style.opacity = 1 - (fade * 1.5);
            if (fade > 0.8) indicator.style.opacity = 1;
        }
    }

    // 2. TIMING CAMION (Ajusté pour être plus lent au début)
    const truckArrival = 2800; // Arrivée devant le camion
    const doorOpening = 3500; // Les portes ne bougent qu'après 700px de scroll devant
    
    if (scrollPos > truckArrival) {
        let truckScroll = scrollPos - doorOpening;
        
        if (truckScroll > 0) {
            // Ouverture Portes
            let angle = Math.min(truckScroll / 4, 115);
            doorLeft.style.transform = `rotateY(${-angle}deg)`;
            doorRight.style.transform = `rotateY(${angle}deg)`;

            // Sortie des ballons
            balloons.forEach((b, i) => {
                let bStart = truckScroll - (i * 500) - 200;
                if (bStart > 0) {
                    b.style.opacity = 1;
                    // Physique d'échappée : Rapide au début, puis plus lent
                    let yMove = -Math.pow(bStart, 1.15);
                    b.style.transform = `translateX(-50%) translateY(${yMove}px) scale(${1 + bStart/2000})`;
                } else {
                    b.style.opacity = 0;
                }
            });
        } else {
            // Portes fermées
            doorLeft.style.transform = `rotateY(0deg)`;
            doorRight.style.transform = `rotateY(0deg)`;
            balloons.forEach(b => b.style.opacity = 0);
        }
    }
});
