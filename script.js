let scene, camera, renderer, tubeMesh, curve;
const container = document.getElementById('route-3d-container');

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // COURBE PLUS ÉLÉGANTE ET FINE
    curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2, -2, -10),
        new THREE.Vector3(-3, -5, -20),
        new THREE.Vector3(4, -8, -30),
        new THREE.Vector3(-1, -12, -40),
        new THREE.Vector3(0, -20, -60),
    ]);

    // ÉPAISSEUR TRÈS FINE (0.02 au lieu de 0.1)
    const geometry = new THREE.TubeGeometry(curve, 150, 0.02, 12, false);
    const material = new THREE.MeshPhongMaterial({
        color: 0x0047FF,
        emissive: 0x0047FF,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0 // Caché au départ
    });

    tubeMesh = new THREE.Mesh(geometry, material);
    scene.add(tubeMesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);
}

function animate() {
    requestAnimationFrame(animate);
    const scrollPos = window.scrollY;
    const maskedText = document.querySelector('.masked-text');

    // 1. EFFET TUNNEL DU O
    if (maskedText) {
        // Zoom plus rapide pour créer l'effet d'entrée
        let scale = 1;
        if (scrollPos > 100) {
            scale = 1 + Math.pow((scrollPos - 100) / 250, 3);
            maskedText.style.transform = `scale(${scale})`;
            
            // Illumination progressive du texte
            let illumination = Math.min(scrollPos / 400, 1);
            maskedText.style.setProperty('--illumination-opacity', illumination);
        }

        // 2. APPARITION DE LA ROUTE (Seulement quand on entre dans le O)
        if (scale > 8) {
            tubeMesh.material.opacity = Math.min((scale - 8) / 5, 1);
            container.style.opacity = 1;
        } else {
            tubeMesh.material.opacity = 0;
            container.style.opacity = 0;
        }

        // 3. MOUVEMENT DE LA CAMÉRA DANS LA ROUTE
        if (scale > 10) {
            let progress = Math.min((scrollPos - 800) / 3000, 0.99);
            if (progress > 0) {
                const pos = curve.getPoint(progress);
                const lookAt = curve.getPoint(progress + 0.01);
                camera.position.set(pos.x, pos.y, pos.z);
                camera.lookAt(lookAt);
            }
        }
    }
    renderer.render(scene, camera);
}

init3D();
animate();
