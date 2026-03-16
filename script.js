// VARIABLES GLOBALES POUR THREE.JS
let scene, camera, renderer, tubeMesh, curve;
const container = document.getElementById('route-3d-container');

// 1. INITIALISATION DE LA SCÈNE 3D
function init3D() {
    scene = new THREE.Scene();

    // Caméra perspective (comme l'œil humain)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5; // Position initiale

    // Renderer (le moteur de rendu)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true pour fond transparent
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Lumières (pour le relief)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 2. CRÉATION DE LA COURBE DE LA ROUTE (P-R-O-A-D)
    // On définit des points dans l'espace (x, y, z)
    curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, 0),      // P - Point de départ
        new THREE.Vector3(2, 3, -2),     // Virage 1
        new THREE.Vector3(-1, 0, -5),    // R - Ligne droite
        new THREE.Vector3(-3, -2, -3),   // Virage 2 (Complexité/Acheteur)
        new THREE.Vector3(1, -4, -1),    // O - Organize (Tournant stratégique)
        new THREE.Vector3(3, -6, 0),     // Virage 3
        new THREE.Vector3(0, -8, 2),     // A - Activate (Terrain)
        new THREE.Vector3(-2, -10, 0),   // D - Deliver
    ]);

    // 3. CRÉATION DU TUBE (LA ROUTE)
    // Geometrie : un tube le long de la courbe
    const geometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
    
    // Matériau : Néon Bleu Roi Électrique Lumineux
    const material = new THREE.MeshPhongMaterial({
        color: 0x0047FF, // Bleu Roi
        emissive: 0x0047FF, // Il émet de la lumière
        emissiveIntensity: 1.5,
        shininess: 100,
        wireframe: false // false pour un tube plein
    });

    tubeMesh = new THREE.Mesh(geometry, material);
    scene.add(tubeMesh);

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 4. ANIMATION AU SCROLL
function updateCameraOnScroll() {
    const scrollPos = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    
    // Calcul de la progression du scroll (0 à 1)
    let fraction = scrollPos / totalHeight;
    fraction = Math.min(Math.max(fraction, 0), 0.99); // Évite de dépasser la courbe

    // On récupère la position et la direction sur la courbe à cette fraction
    if(curve) {
        const pos = curve.getPoint(fraction);
        const lookAt = curve.getPoint(fraction + 0.01); // Un peu plus loin pour regarder devant

        // On place la caméra l'égérement au-dessus de la route
        camera.position.set(pos.x, pos.y + 0.3, pos.z);
        camera.lookAt(lookAt);
    }
}

// 5. BOUCLE DE RENDU (Pour l'animation)
function animate() {
    requestAnimationFrame(animate);
    updateCameraOnScroll(); // Met à jour la caméra à chaque frame
    renderer.render(scene, camera);
}

// LANCEMENT
window.addEventListener('load', () => {
    init3D();
    animate();
});
