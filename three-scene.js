/**
 * ThreeScene.js - Plus X 15th Anniversary WebGL Engine
 * Single unified 3D OBJ model with:
 * - Proper Box3 collective center alignment
 * - Accurate theme detection on init (platinum white on dark theme, sculpted charcoal on light)
 * - 3-Point Studio Lighting (Key, Fill, Rim & Ambient)
 * - Real-time scroll momentum lerp physics & mouse parallax
 */

class PlusX3DScene {
  constructor(container) {
    this.container = container || document.body;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Single unified 3D Model Group (Pivot)
    this.modelGroup = null;
    this.loadedObject = null;

    // Studio Lights
    this.ambientLight = null;
    this.keyLight = null;
    this.fillLight = null;
    this.rimLight = null;
    this.fog = null;

    this.scrollTop = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.isMobile = window.innerWidth < 1025;
    this.isPlaying = true;

    // Detect initial theme from document body
    const bodyTheme = document.body.getAttribute('data-theme') || 'dark';
    this.currentTheme = bodyTheme;

    this.modelRot = { currentX: 0, currentY: 0, currentZ: 0, targetX: 0, targetY: 0, targetZ: 0, autoY: 0 };

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Depth Fog based on initial theme
    const isDark = this.currentTheme === 'dark';
    const initialFogColor = isDark ? 0x000000 : 0xffffff;
    this.fog = new THREE.Fog(initialFogColor, 60, 110);
    this.scene.fog = this.fog;

    // 3. Perspective Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 30);
    this.camera.lookAt(0, 0, 0);

    // 4. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = isDark ? 1.25 : 1.15;
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100vw';
    this.renderer.domElement.style.height = '100vh';
    this.renderer.domElement.style.pointerEvents = 'none';
    this.renderer.domElement.style.zIndex = '1';
    this.container.appendChild(this.renderer.domElement);

    // 5. Studio Multi-Point Lighting System
    this.setupLighting(isDark);

    // 6. Create Pivot Group for 3D Model
    this.modelGroup = new THREE.Group();
    this.modelGroup.position.set(0, 0, 0);
    this.scene.add(this.modelGroup);

    // 7. Load Custom OBJ Model
    this.loadObjModel(isDark);

    // 8. Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });

    // 9. Start Render Loop
    this.render();
  }

  setupLighting(isDark) {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.55 : 0.7);
    this.scene.add(this.ambientLight);

    // Key Light (Main top-right highlight)
    this.keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.2 : 1.6);
    this.keyLight.position.set(25, 35, 40);
    this.scene.add(this.keyLight);

    // Fill Light (Soft bottom-left fill)
    this.fillLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.0 : 0.75);
    this.fillLight.position.set(-25, -20, 25);
    this.scene.add(this.fillLight);

    // Rim Light (Contour backlight from behind)
    this.rimLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.8 : 1.3);
    this.rimLight.position.set(0, 25, -35);
    this.scene.add(this.rimLight);
  }

  loadObjModel(isDark) {
    const initialMatColor = isDark ? 0xf0f0f0 : 0x141414;
    const initialRoughness = isDark ? 0.25 : 0.38;
    const initialMetalness = isDark ? 0.3 : 0.15;

    if (typeof THREE.OBJLoader === 'undefined') {
      console.warn('THREE.OBJLoader not available, creating fallback geometry');
      this.createFallbackModel(initialMatColor, initialRoughness, initialMetalness);
      return;
    }

    const loader = new THREE.OBJLoader();
    loader.load(
      './3d/imgi_1_default.obj',
      (object) => {
        const mat = new THREE.MeshStandardMaterial({
          color: initialMatColor,
          roughness: initialRoughness,
          metalness: initialMetalness,
          side: THREE.DoubleSide
        });

        // Compute vertex normals for smooth specular reflections
        object.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
            child.material = mat;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Collective bounding box of the entire combined object
        const box = new THREE.Box3().setFromObject(object);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Center the whole object as one single cohesive unit
        object.position.x = -center.x;
        object.position.y = -center.y;
        object.position.z = -center.z;

        // Proportional scale: target diameter ~ 6.8 units
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = this.isMobile ? 5.2 : 6.8;
        const scale = targetSize / maxDim;
        this.modelGroup.scale.set(scale, scale, scale);

        this.loadedObject = object;
        this.modelGroup.add(object);

        console.log('✅ 3D OBJ model loaded successfully behind hero!');
      },
      (xhr) => {},
      (error) => {
        console.error('Error loading OBJ:', error);
        this.createFallbackModel(initialMatColor, initialRoughness, initialMetalness);
      }
    );
  }

  createFallbackModel(col, rough, met) {
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: col || 0xf0f0f0,
      roughness: rough || 0.25,
      metalness: met || 0.3
    });

    const length = 8;
    const thickness = 1.8;

    const g = new THREE.Group();
    const p1 = new THREE.Mesh(boxGeo, material);
    p1.scale.set(length, thickness, thickness);
    g.add(p1);

    const p2 = new THREE.Mesh(boxGeo, material);
    p2.scale.set(thickness, length, thickness);
    g.add(p2);

    const p3 = new THREE.Mesh(boxGeo, material);
    p3.scale.set(thickness, thickness, length);
    g.add(p3);

    this.modelGroup.add(g);
  }

  onScroll() {
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  onResize() {
    this.isMobile = window.innerWidth < 1025;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.loadedObject) {
      const box = new THREE.Box3().setFromObject(this.loadedObject);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = this.isMobile ? 5.2 : 6.8;
      const scale = targetSize / maxDim;
      this.modelGroup.scale.set(scale, scale, scale);
    }
  }

  update() {
    // Mouse easing
    this.mouseX += 0.05 * (this.targetMouseX - this.mouseX);
    this.mouseY += 0.05 * (this.targetMouseY - this.mouseY);

    // Scroll-based target angles
    if (this.isMobile) {
      this.modelRot.targetX = 0.0012 * this.scrollTop;
      this.modelRot.targetY = 0.0008 * this.scrollTop;
      this.modelRot.targetZ = 0.0010 * this.scrollTop;
    } else {
      this.modelRot.targetX = 0.0008 * this.scrollTop;
      this.modelRot.targetY = 0.0005 * this.scrollTop;
      this.modelRot.targetZ = 0.0006 * this.scrollTop;
    }

    // Auto idle rotation
    this.modelRot.autoY += 0.003;

    // Smooth Lerp step
    this.modelRot.currentX += 0.1 * (this.modelRot.targetX - this.modelRot.currentX);
    this.modelRot.currentY += 0.1 * (this.modelRot.targetY - this.modelRot.currentY);
    this.modelRot.currentZ += 0.1 * (this.modelRot.targetZ - this.modelRot.currentZ);

    if (this.modelGroup) {
      this.modelGroup.rotation.x = this.modelRot.currentX + this.mouseY * 0.25;
      this.modelGroup.rotation.y = this.modelRot.currentY + this.modelRot.autoY + this.mouseX * 0.3;
      this.modelGroup.rotation.z = this.modelRot.currentZ;
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    const isDark = theme === 'dark';
    const targetColor = isDark ? new THREE.Color(0xf0f0f0) : new THREE.Color(0x141414);
    const fogColor = isDark ? new THREE.Color(0x000000) : new THREE.Color(0xffffff);

    // Fog tween
    gsap.to(this.fog.color, { r: fogColor.r, g: fogColor.g, b: fogColor.b, duration: 0.8, ease: 'power2.out' });

    // Material color tween across all meshes
    if (this.modelGroup) {
      this.modelGroup.traverse(child => {
        if (child.isMesh && child.material) {
          gsap.to(child.material.color, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 0.8,
            ease: 'power2.out'
          });
          child.material.roughness = isDark ? 0.25 : 0.38;
          child.material.metalness = isDark ? 0.3 : 0.15;
        }
      });
    }

    // Lights
    if (isDark) {
      gsap.to(this.keyLight, { intensity: 2.2, duration: 0.8 });
      gsap.to(this.fillLight, { intensity: 1.0, duration: 0.8 });
      gsap.to(this.rimLight, { intensity: 1.8, duration: 0.8 });
      gsap.to(this.ambientLight, { intensity: 0.55, duration: 0.8 });
    } else {
      gsap.to(this.keyLight, { intensity: 1.6, duration: 0.8 });
      gsap.to(this.fillLight, { intensity: 0.75, duration: 0.8 });
      gsap.to(this.rimLight, { intensity: 1.3, duration: 0.8 });
      gsap.to(this.ambientLight, { intensity: 0.7, duration: 0.8 });
    }
  }

  render() {
    if (!this.isPlaying) return;
    requestAnimationFrame(this.render.bind(this));
    this.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.PlusX3DScene = PlusX3DScene;
