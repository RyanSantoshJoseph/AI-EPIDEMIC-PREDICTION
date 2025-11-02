// 3D Globe Animation with Three.js
class Globe3D {
    constructor() {
        this.canvas = document.getElementById('globe-canvas');
        if (!this.canvas) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globe = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.rotationSpeed = 0.02;

        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();

        // Create camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.z = 250;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Create globe
        this.createGlobe();

        // Add lighting
        this.addLighting();

        // Add stars
        this.addStars();

        // Handle mouse movement
        this.setupMouseInteraction();

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Start animation
        this.animate();
    }

    createGlobe() {
        const globeGroup = new THREE.Group();

        // Create sphere geometry
        const geometry = new THREE.SphereGeometry(100, 64, 64);

        // Create earth material
        const earthTexture = this.createTexture();
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthTexture,
            transparent: true,
            opacity: 0.7
        });

        // Create globe mesh
        const earthMesh = new THREE.Mesh(geometry, earthMaterial);
        globeGroup.add(earthMesh);

        // Add atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(105, 64, 64);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x6fd3a7,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        globeGroup.add(atmosphere);

        // Add wireframe
        const wireframeGeometry = new THREE.SphereGeometry(100.5, 32, 32);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x4ea9ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        globeGroup.add(wireframe);

        this.globe = globeGroup;
        this.scene.add(this.globe);
    }

    createTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Create gradient background (ocean)
        const gradient = ctx.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(1, '#3b82f6');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 256);

        // Add continents as stylized shapes
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.ellipse(100, 140, 30, 20, 0, 0, Math.PI * 2); // North America
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(150, 160, 25, 15, 0, 0, Math.PI * 2); // South America
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(230, 120, 35, 25, 0, 0, Math.PI * 2); // Europe/Asia
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(320, 140, 25, 20, 0, 0, Math.PI * 2); // Asia/Pacific
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(260, 190, 20, 15, 0, 0, Math.PI * 2); // Australia
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(220, 60, 25, 18, 0, 0, Math.PI * 2); // Arctic
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
    }

    addLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        this.scene.add(directionalLight);

        // Point light for glow
        const pointLight = new THREE.PointLight(0x4ea9ff, 1, 500);
        pointLight.position.set(0, 100, 0);
        this.scene.add(pointLight);
    }

    addStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1,
            transparent: true,
            opacity: 0.6
        });

        const starsVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }

    setupMouseInteraction() {
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
            this.targetRotationY = this.mouseX * 0.5;
            this.targetRotationX = this.mouseY * 0.5;
        });

        // Reset rotation when mouse leaves
        document.addEventListener('mouseleave', () => {
            this.targetRotationX = 0;
            this.targetRotationY = 0;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.globe) {
            // Smooth rotation to target
            this.globe.rotation.y += (this.targetRotationY - this.globe.rotation.y) * 0.05;
            this.globe.rotation.x += (this.targetRotationX - this.globe.rotation.x) * 0.05;

            // Slow continuous rotation
            this.globe.rotation.y += this.rotationSpeed * 0.3;
        }

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize globe when DOM is ready
let globe3D;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        globe3D = new Globe3D();
    }, 500);
});

