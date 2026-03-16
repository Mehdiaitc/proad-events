window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Zoom Elements
    const focalContainer = document.querySelector('.word-wrapper');
    const letters = document.querySelectorAll('.letter');
    const targetO = document.querySelector('.target-o');
    const adn = document.querySelector('.adn-reveal-overlay');
    const slogan = document.getElementById('main-slogan');
    
    // Camion Elements
    const doorL = document.querySelector('.left-door');
    const doorR = document.querySelector('.right-door');
    const balloons = document.querySelectorAll('.balloon-box');

    // 1. ZOOM DANS LE O & RÉVÉLATION ADN (Jusqu'à 1500px)
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

        // Zoom focalisé vers le O (Sniper Focus)
        focalContainer.style.transform = `translate(${offsetX * (scale/2.5)}px, ${offsetY * (scale/2.5)}px) scale(${scale})`;
        
        // Révélation de l'ADN (Blur -> Net)
        adn.style.opacity = Math.min((scrollPos - 400) / 400, 1);
        adn.style.transform = `scale(${1 + (scrollPos-400)/1000})`;
        adn.style.filter = `blur(${15 - (scrollPos - 400) / 40 * 1.5}px)`; // Flou progressif
        
        if (scale > 15) focalContainer.style.opacity = 0;
        else focalContainer.style.opacity = 1;
        
        if (slogan) slogan.style.opacity = 1 - (scrollPos - 400) / 200;
    }

    // 2. SCÈNE DU CAMION ARRIÈRE (Timing synchronisé)
    const truckArrival = 2200; // Arrivée devant le camion
    if (scrollPos > truckArrival) {
        let truckProg = (scrollPos - truckArrival);
        
        // Ouverture des portes (Délai d'ouverture séquentielle pour le P)
        let angleL = Math.min(truckProg / 5, 110);
        let angleR = 0;
        if (truckProg > 150) {
            angleR = Math.min((truckProg - 150) / 4, 110); // Porte droite s'ouvre après
        }
        
        // On applique la rotation 3D aux portes articulées
        doorL.style.transform = `rotateY(${-angleL}deg)`;
        doorR.style.transform = `rotateY(${angleR}deg)`;

        // Libération des ballons hélium (Séquentiel)
        balloons.forEach((b, i) => {
            let bStart = truckProg - (i * 350) - 300; // Délai entre chaque ballon pour l'effet "bloqué"
            if (bStart > 0) {
                b.style.opacity = 1;
                // Physique de ballon compressé qui s'échappe : Rapide au début
                let translateY = -bStart * 1.15;
                b.style.transform = `translateX(-50%) translateY(${translateY}px) scale(${1 + bStart/1000})`;
            } else {
                b.style.opacity = 0;
            }
        });
    }
});
