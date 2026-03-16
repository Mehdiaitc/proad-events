window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    const focalContainer = document.querySelector('.word-wrapper');
    const letters = document.querySelectorAll('.letter');
    const targetO = document.querySelector('.target-o');
    const adn = document.querySelector('.adn-reveal-overlay');
    const slogan = document.getElementById('main-slogan');
    
    const doorL = document.querySelector('.left-door');
    const doorR = document.querySelector('.right-door');
    const balloons = document.querySelectorAll('.balloon-letter');

    // 1. ZOOM DANS LE O & RÉVÉLATION ADN
    letters.forEach((l, i) => {
        if (scrollPos > i * 100) l.classList.add('filled');
        else l.classList.remove('filled');
    });

    if (scrollPos > 400 && scrollPos < 2500) {
        let zoomProg = (scrollPos - 400);
        let scale = 1 + Math.pow(zoomProg / 250, 3.5);
        
        const rect = targetO.getBoundingClientRect();
        const offsetX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
        const offsetY = (window.innerHeight / 2) - (rect.top + rect.height / 2);

        focalContainer.style.transform = `translate(${offsetX * (scale/2.5)}px, ${offsetY * (scale/2.5)}px) scale(${scale})`;
        
        // Apparition du texte ADN
        if (scale > 5) {
            let fade = Math.min((scale - 5) / 5, 1);
            adn.style.opacity = fade;
            adn.style.transform = `scale(${0.9 + (fade * 0.1)})`;
            focalContainer.style.opacity = 1 - (fade * 1.5);
        } else {
            adn.style.opacity = 0;
            focalContainer.style.opacity = 1;
        }
        
        if (slogan) slogan.style.opacity = 1 - (scrollPos - 400) / 200;
    }

    // 2. TIMING CAMION (Correction ouverture tardive)
    const truckStart = 2500; // Point d'arrivée devant le camion
    if (scrollPos > truckStart) {
        let truckProg = (scrollPos - truckStart);
        
        // Ouverture des portes (Angle de 0 à 110 degrés)
        let angle = Math.min(truckProg / 6, 110);
        if(doorL) doorL.style.transform = `rotateY(${-angle}deg)`;
        if(doorR) doorR.style.transform = `rotateY(${angle}deg)`;

        // Envol et dispersion des lettres Ballons
        balloons.forEach((b, i) => {
            let bStart = truckProg - (i * 400) - 300; 
            if (bStart > 0) {
                b.style.opacity = 1;
                // Dispersion aléatoire gauche/droite
                let xMove = Math.sin(i + bStart/100) * 100;
                let yMove = -bStart * 1.5;
                // Rotation pour l'effet flottant
                let rotate = Math.sin(bStart/50) * 10;
                
                b.style.transform = `translate(calc(-50% + ${xMove}px), ${yMove}px) rotate(${rotate}deg)`;
            } else {
                b.style.opacity = 0;
            }
        });
    }
});
