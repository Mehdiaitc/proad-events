window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Éléments Zoom
    const wordContainer = document.querySelector('.word-container');
    const letters = document.querySelectorAll('.letter');
    const targetO = document.querySelector('.target-o');
    const adn = document.querySelector('.adn-reveal-zone');
    const indicator = document.querySelector('.scroll-indicator');
    const slogan = document.getElementById('main-slogan');
    
    // Éléments Camion
    const tagWhy = document.getElementById('tag-why');
    const tagProad = document.getElementById('tag-proad');
    const doorL = document.getElementById('door-left');
    const doorR = document.getElementById('door-right');
    const balloons = document.querySelectorAll('.balloon-letter');

    // 1. ZOOM DANS LE O (0 à 2800px)
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

    // 2. TAGGING ET CAMION (À partir de 3000px)
    const truckStart = 3000;
    if (scrollPos > truckStart) {
        let tp = scrollPos - truckStart;

        // A. Tagging progressif (0 à 1000px de scroll camion)
        const pWhy = Math.min(tp / 500, 1);
        tagWhy.style.clipPath = `inset(0 ${100 - pWhy * 100}% 0 0)`;

        if (tp > 500) {
            const pProad = Math.min((tp - 500) / 500, 1);
            tagProad.style.clipPath = `inset(0 ${100 - pProad * 100}% 0 0)`;
        }

        // B. Ouverture des portes (1200px et +)
        let angle = 0;
        if (tp > 1200) {
            angle = Math.min((tp - 1200) / 800, 115);
        }
        doorL.style.transform = `rotateY(${-angle}deg)`;
        doorR.style.transform = `rotateY(${angle}deg)`;

        // C. Envol des ballons (1500px et +)
        balloons.forEach((b, i) => {
            let bStart = (tp - 1500) - (i * 400);
            if (bStart > 0) {
                b.style.opacity = 1;
                let xMove = Math.sin(i * 3 + bStart / 150) * 100;
                let yMove = -Math.pow(bStart, 1.1);
                b.style.transform = `translateX(calc(-50% + ${xMove}px)) translateY(${yMove}px) scale(${1.2 + bStart/2000})`;
            } else {
                b.style.opacity = 0;
            }
        });
    }
});
