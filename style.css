:root {
    --blue-electric: #0047FF;
    --cream-white: #F5F5F0;
    --dark-bg: #000000;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body { 
    background-color: var(--dark-bg); 
    color: var(--cream-white); 
    font-family: 'Poppins', sans-serif; 
    overflow-x: hidden;
}

/* Header */
.site-header { 
    position: fixed; top: 0; width: 100%; 
    display: flex; justify-content: space-between; 
    padding: 30px 50px; z-index: 1000; 
    backdrop-filter: blur(10px); 
}
.logo-text { font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
.thin { font-weight: 200; opacity: 0.8; }
.main-nav a { color: white; text-decoration: none; margin-left: 30px; font-weight: 700; font-size: 0.9rem; }
.cta-nav { border: 1px solid var(--blue-electric); padding: 8px 20px; border-radius: 50px; }

/* CONTENEUR ROUTE 3D FIXED */
#route-3d-container {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100vh;
    z-index: -1; /* Derrière le texte */
}

/* Hero Section (Reste la même pour l'instant) */
.scroll-container { height: 250vh; position: relative; z-index: 10; }
.sticky-wrapper { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.masked-text { font-size: clamp(5rem, 18vw, 15rem); font-weight: 900; color: transparent; -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2); position: relative; transition: transform 0.1s linear; }
.masked-text::before { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; color: var(--cream-white); -webkit-text-stroke: 0px; opacity: var(--illumination-opacity, 0); filter: drop-shadow(0 0 15px var(--blue-electric)); transition: opacity 0.1s linear; }
.hero-subtitle { letter-spacing: 5px; color: var(--blue-electric); margin-top: 20px; font-weight: 700; text-transform: uppercase; }

/* Intro Section */
.about-intro { 
    padding: 150px 10%; 
    text-align: center; 
    background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.8), #000);
    z-index: 10; position: relative;
}
.about-intro h2 { font-size: 3rem; margin-bottom: 20px; }
.highlight { color: var(--blue-electric); }

/* SECTIONS ÉTAPES (P-R-O-A-D) */
.step-section {
    height: 100vh; /* Une étape par écran */
    display: flex;
    align-items: center;
    padding-left: 10%;
    z-index: 10; position: relative;
    /* Transparent pour voir la route derrière */
}

.step-content {
    max-width: 500px;
    background: rgba(0,0,0,0.6); /* Fond semi-transparent pour lisibilité */
    padding: 40px;
    border-radius: 15px;
    border-left: 3px solid var(--blue-electric);
}

.step-letter {
    font-size: 5rem;
    font-weight: 900;
    color: var(--blue-electric);
    line-height: 1;
    display: block;
    margin-bottom: 10px;
}

.step-content h3 { font-size: 2.5rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; }
.step-content p { color: #ccc; font-size: 1.1rem; line-height: 1.6; }
