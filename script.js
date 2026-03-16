window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Zoom Elements
    const focalContainer = document.querySelector('.word-wrapper');
    const letters = document.querySelectorAll('.letter');
    const targetO = document.querySelector('.target-o');
    const adn = document.querySelector('.adn-overlay');
    const slogan = document.getElementById('main-slogan');
    
    // Camion Elements
    const doorL = document.querySelector('.left-door');
    const doorR = document.querySelector('.right-door');
    const balloons = document.querySelectorAll('.balloon-box');

    // 1. ZOOM & ADN (Jusqu'à 1500px)
    letters.forEach((l, i) => {
        if (scrollPos > i * 100) l.classList.add('filled');
        else l.classList.remove('filled');
    });

    if (scrollPos > 400 && scrollPos < 1800) {
        let zoomProg = (scrollPos - 400);
        let scale = 1 + Math.pow(zoomProg / 200, 3.5);
        
        const rect = targetO.getBoundingClientRect();
        const offsetX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
        const offsetY = (window.innerHeight / 2) - (rect.top + rect.height / 2);

        // Zoom décalé vers la lettre O
        focalContainer.style.transform = `translate(${offsetX * (scale/2.5)}px, ${offsetY * (scale/2.5)}px) scale(${scale})`;
        
        // Révélation de l'ADN (Opacité et scale)
        adn.style.opacity = Math.min((scrollPos - 400) / 400, 1);
        adn.style.transform = `scale(${1 + (scrollPos-400)/1000})`;
        
        // Disparition douce du mot PROAD quand il est géant
        if (scale > 15) focalContainer.style.opacity = 0;
        else focalContainer.style.opacity = 1;
        
        if (slogan) slogan.style.opacity = 1 - (scrollPos - 400) / 200;
    }

    // 2. SCÈNE CAMION (Correction du Timing - Plus réactif)
    const truckStart = 2000; // Arrivée brusque devant le camion juste après l'ADN
    if (scrollPos > truckStart) {
        let truckProg = (scrollPos - truckStart);
        
        // Ouverture Portes (Rapide, Angle de 0 à 110 degrés)
        let angle = Math.min(truckProg / 5, 110);
        doorL.style.transform = `rotateY(${-angle}deg)`;
        doorR.style.transform = `rotateY(${angle}deg)`;

        // Envol des ballons (Séquentiel mais rapide)
        balloons.forEach((b, i) => {
            let bStart = truckProg - (i * 450) - 300; // Délai entre chaque ballon pour l'effet "bloqué"
            if (bStart > 0) {
                b.style.opacity = 1;
                // Physique d'échappée : Rapide au début, puis plus lent (Hélium)
                let translateY = -bStart * 1.3;
                b.style.transform = `translateX(-50%) translateY(${translateY}px) scale(${1 + bStart/1000})`;
            } else {
                b.style.opacity = 0;
            }
        });
    }
});
