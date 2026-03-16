let scene, camera, renderer, tubeMesh, curve;
const container = document.getElementById('route-3d-container');

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Route beaucoup plus longue et sinueuse
    curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2, -3, -15),
        new THREE.Vector3(-4, -8, -35),
        new THREE.Vector3(5, -15, -60),
        new THREE.Vector3(-2, -25, -90),
        new THREE.Vector3(0, -40, -120),
    ]);

    // Tube ultra fin pour l'élégance
    const geometry = new THREE.TubeGeometry(curve, 200, 0.015, 8, false);
    const material = new THREE.MeshPhongMaterial({
        color: 0x0047FF,
        emissive: 0x0047FF,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0
    });

    tubeMesh = new THREE.Mesh(geometry, material);
    scene.add(tubeMesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 10);
    scene.add(light);
}

function animate() {
    requestAnimationFrame(animate);
    const scrollPos = window.scrollY;
    const maskedText = document.querySelector('.masked-text');
    const slogan = document.getElementById('main-slogan');

    if (maskedText) {
        // 1. Illumination (0 à 300 de scroll)
        let illumination = Math.min(scrollPos / 300, 1);
        maskedText.style.setProperty('--illumination-opacity', illumination);

        // 2. Zoom Tunnel (Commence après l'illumination)
        let scale = 1;
        if (scrollPos > 200) {
            // Croissance exponentielle pour "entrer" dans le O
            scale = 1 + Math.pow((scrollPos - 200) / 200, 3);
            maskedText.style.transform = `scale(${scale})`;
            
            // On cache le slogan pendant le zoom
            if (slogan) slogan.style.opacity = 1 - (scrollPos - 200) / 200;
        }

        // 3. Affichage de la route quand le O est géant
        if (scale > 15) {
            container.style.opacity = 1;
            tubeMesh.material.opacity = Math.min((scale - 15) / 10, 1);
            
            // On avance dans la route
            let progress = Math.min((scrollPos - 1200) / 4000, 0.99);
            if (progress > 0) {
                const pos = curve.getPoint(progress);
                const lookAt = curve.getPoint(progress + 0.005);
                camera.position.set(pos.x, pos.y, pos.z);
                camera.lookAt(lookAt);
            }
        } else {
            container.style.opacity = 0;
            tubeMesh.material.opacity = 0;
        }
    }
    renderer.render(scene, camera);
}

init3D();
animate();
