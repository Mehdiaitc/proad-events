window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    const wordContainer = document.querySelector('.word-container');
    const letters = document.querySelectorAll('.letter');
    const targetO = document.querySelector('.target-o');
    const adnZone = document.querySelector('.adn-reveal-zone');
    const indicator = document.querySelector('.scroll-indicator');
    const slogan = document.getElementById('main-slogan');
    
    const doorLeft = document.querySelector('.door-left');
    const doorRight = document.querySelector('.door-right');
    const balloons = document.querySelectorAll('.balloon-item');

    // 1. ZOOM & RÉVÉLATION PROGRESSIVE
    letters.forEach((l, i) => {
        if (scrollPos > i * 100) l.classList.add('filled');
        else l.classList.remove('filled');
    });

    if (scrollPos > 400) {
        let zoomProg = (scrollPos - 400);
        let scale = 1 + Math.pow(zoomProg / 220, 3.8); // Zoom légèrement plus rapide
        
        const rect = targetO.getBoundingClientRect();
        const offsetX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
        const offsetY = (window.innerHeight / 2) - (rect.top + rect.height / 2);
        
        wordContainer.style.transform = `translate(${offsetX * (scale/2.5)}px, ${offsetY * (scale/2.5)}px) scale(${scale})`;
        
        // APPARITION ADN : Se déclenche quand le zoom est déjà bien lancé
        if (scale > 4) {
            let adnFade = Math.min((scale - 4) / 6, 1);
            adnZone.style.opacity = adnFade;
            adnZone.style.filter = `blur(${30 - (adnFade * 30)}px)`;
            adnZone.style.transform = `scale(${0.8 + (adnFade * 0.2)})`;
            wordContainer.style.opacity = 1 - (adnFade * 1.2);
            
            if(adnFade > 0.9) indicator.style.opacity = 1;
        } else {
            adnZone.style.opacity = 0;
            wordContainer.style.opacity = 1;
            indicator.style.opacity = 0;
        }

        if (slogan) slogan.style.opacity = 1 - (scrollPos - 400) / 300;
    }

    // 2. OUVERTURE CAMION
    const truckStart = 2200; // Un peu plus bas pour laisser le temps à l'ADN
    if (scrollPos > truckStart) {
        let truckProg = (scrollPos - truckStart);
        let angle = Math.min(truckProg / 6, 120);
        doorLeft.style.transform = `rotateY(${-angle}deg)`;
        doorRight.style.transform = `rotateY(${angle}deg)`;

        balloons.forEach((b, i) => {
            let bStart = truckProg - (i * 450) - 400;
            if (bStart > 0) {
                b.style.opacity = 1;
                let y = -bStart * 1.4;
                b.style.transform = `translateX(-50%) translateY(${y}px) scale(${1 + bStart/1200})`;
            } else {
                b.style.opacity = 0;
            }
        });
    }
});
