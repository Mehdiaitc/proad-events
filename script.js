window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const wordContainer = document.querySelector('.word-container');
    const letters = document.querySelectorAll('.letter');
    const targetO = document.querySelector('.target-o');
    const slogan = document.getElementById('main-slogan');

    if (wordContainer && targetO) {
        // 1. Remplissage liquide des lettres
        letters.forEach((l, index) => {
            if (scrollPos > (index * 120)) {
                l.classList.add('filled');
            } else {
                l.classList.remove('filled');
            }
        });

        // 2. ZOOM CHIRURGICAL SUR LE O
        if (scrollPos > 600) {
            let scale = 1 + Math.pow((scrollPos - 600) / 250, 3.8);
            
            const rect = targetO.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = centerX - (rect.left + rect.width / 2);
            const offsetY = centerY - (rect.top + rect.height / 2);

            wordContainer.style.transform = `translate(${offsetX * (scale/2.5)}px, ${offsetY * (scale/2.5)}px) scale(${scale})`;
            wordContainer.style.opacity = 1 - (scale - 15) / 10;
            if(slogan) slogan.style.opacity = 1 - (scrollPos - 600) / 300;
        } else {
            wordContainer.style.transform = `scale(1)`;
            wordContainer.style.opacity = 1;
            if(slogan) slogan.style.opacity = 1;
        }
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.4 });

document.querySelectorAll('.step-card').forEach(card => observer.observe(card));
