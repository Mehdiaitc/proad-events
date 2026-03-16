window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Zoom Elements
    const wordContainer = document.querySelector('.word-container');
    const letters = document.querySelectorAll('.letter');
    const targetO = document.querySelector('.target-o');
    const adn = document.querySelector('.adn-reveal-zone');
    const indicator = document.querySelector('.scroll-indicator');
    const slogan = document.getElementById('main-slogan');
    
    // Camion Elements
    const doorLeft = document.querySelector('.door-left');
    const doorRight = document.querySelector('.door-right');
    const balloons = document.querySelectorAll('.balloon-letter');

    // 1. ZOOM ET ADN
    letters.forEach((l, i) => {
        if (scrollPos > i * 110) l.classList.add('filled');
        else l.classList.remove('filled');
    });

    if (scrollPos > 400 && scrollPos < 2800) {
        let zoomProg = (scrollPos - 400);
        let scale = 1 + Math.pow(zoomProg / 250, 3.5);
        
        const rect = targetO.getBoundingClientRect();
        const offsetX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
        const offsetY = (window.innerHeight / 2) - (rect.top + rect.height / 2);
        wordContainer.style.transform = `translate(${offsetX * (scale/2.5)}px, ${offsetY * (scale/2.5)}px) scale(${scale})`;
        
        if (scale > 4) {
            let fade = Math.min((scale - 4) / 6, 1);
            adn.style.opacity = fade;
            adn.style.filter = `blur(${20 - (fade * 20)}px)`;
            wordContainer.style.opacity = 1 - (fade * 1.5);
            if (fade > 0.8) indicator.style.opacity = 1;
        } else {
            adn.style.opacity = 0;
            indicator.style.opacity = 0;
        }
        if (slogan) slogan.style.opacity = 1 - (scrollPos - 400) / 300;
    }

    // 2. SCÈNE DU CAMION
    const truckStart = 2800;
    if (scrollPos > truckStart) {
        let truckProg = (scrollPos - truckStart);
        
        // Les portes restent fermées un peu au début pour lire "WHY PROAD?"
        let angle = 0;
        if (truckProg > 600) {
            angle = Math.min((truckProg - 600) / 5, 115);
        }
        
        doorLeft.style.transform = `rotateY(${-angle}deg)`;
        doorRight.style.transform = `rotateY(${angle}deg)`;

        // Envol des lettres Ballons
        balloons.forEach((b, i) => {
            // Elles commencent à s'échapper dès que les portes s'ouvrent
            let bStart = (truckProg - 600) - (i * 500);
            if (bStart > 0) {
                b.style.opacity = 1;
                let yMove = -Math.pow(bStart, 1.15);
                // Dispersion horizontale aléatoire
                let xMove = Math.sin(i * 2 + bStart / 200) * 80;
                b.style.transform = `translateX(calc(-50% + ${xMove}px)) translateY(${yMove}px) scale(${1 + bStart/1500})`;
            } else {
                b.style.opacity = 0;
            }
        });
    }
});
