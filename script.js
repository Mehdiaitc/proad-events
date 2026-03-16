window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Zoom Elements
    const wordContainer = document.querySelector('.word-container');
    const letters = document.querySelectorAll('.letter');
    const targetO = document.querySelector('.target-o');
    const adn = document.querySelector('.adn-reveal-zone');
    const indicator = document.querySelector('.scroll-indicator');
    
    // Camion Elements
    const doorLeft = document.querySelector('.door-left');
    const doorRight = document.querySelector('.door-right');
    const balloons = document.querySelectorAll('.balloon-box');

    // 1. ZOOM DANS LE O & RÉVÉLATION ADN
    letters.forEach((l, i) => {
        if (scrollPos > i * 100) l.classList.add('filled');
        else l.classList.remove('filled');
    });

    if (scrollPos > 400) {
        let zoomProg = (scrollPos - 400);
        let scale = 1 + Math.pow(zoomProg / 220, 3.5);
        
        const rect = targetO.getBoundingClientRect();
        const offsetX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
        const offsetY = (window.innerHeight / 2) - (rect.top + rect.height / 2);
        wordContainer.style.transform = `translate(${offsetX * (scale/2.5)}px, ${offsetY * (scale/2.5)}px) scale(${scale})`;
        
        // Révélation ADN (Apparaît flou puis net pendant le zoom)
        if (scale > 4) {
            let fade = Math.min((scale - 4) / 6, 1);
            adn.style.opacity = fade;
            adn.style.filter = `blur(${20 - (fade * 20)}px)`;
            adn.style.transform = `scale(${0.9 + (fade * 0.1)})`;
            wordContainer.style.opacity = 1 - (fade * 1.5); // Fait disparaître PROAD
            
            if (fade > 0.8) indicator.style.opacity = 1;
        } else {
            adn.style.opacity = 0;
            wordContainer.style.opacity = 1;
            indicator.style.opacity = 0;
        }
    }

    // 2. SCÈNE DU CAMION ARRIÈRE (Commence vers 1600px de scroll)
    const truckStart = 1600;
    if (scrollPos > truckStart) {
        let truckProg = (scrollPos - truckStart);
        
        // Ouverture des portes (Angle de 0 à 110 degrés)
        let angle = Math.min(truckProg / 6, 110);
        if(doorLeft) doorLeft.style.transform = `rotateY(${-angle}deg)`;
        if(doorRight) doorRight.style.transform = `rotateY(${angle}deg)`;

        // Envol des ballons (Séquentiel)
        balloons.forEach((b, i) => {
            let bStart = truckProg - (i * 450) - 400; // Délai entre chaque ballon
            if (bStart > 0) {
                b.style.opacity = 1;
                // Le ballon monte et grossit légèrement
                let yMove = -bStart * 1.5;
                b.style.transform = `translateX(-50%) translateY(${yMove}px) scale(${1 + bStart/1500})`;
            } else {
                b.style.opacity = 0;
            }
        });
    }
});
