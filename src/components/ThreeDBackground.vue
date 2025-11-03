<template>
  <canvas ref="canvasRef" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const canvasRef = ref(null);
let scene, camera, renderer;
let starField, planets = [], asteroids = [];
let animationFrameId;
let textureLoader, objLoader;
let planetTextures = [];
let ceresTexture;
let asteroidModels = [];
let coin, coinModel;
let coinTexture;

const initThreeJS = () => {
  // Scene setup
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.00015);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 50, 200);
  camera.lookAt(0, 0, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: false
  });
  renderer.setClearColor(0x000000, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  // Ambient light for overall brightness
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // Lighting - Sun positioned right in front of coin from camera perspective
  const mainLight = new THREE.DirectionalLight(0xffffff, 5.0);
  mainLight.position.set(0, 50, 200); // At camera position
  scene.add(mainLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(100, 100, 50);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0x4080ff, 1.0);
  backLight.position.set(-100, -50, -100);
  scene.add(backLight);

  // Spotlight from 30 degrees to the right
  const spotlight = new THREE.SpotLight(0xffffff, 8.0);
  const angle = -Math.PI / 6; // 30 degrees to the right (clockwise)
  const distance = 150;
  spotlight.position.set(
    Math.sin(angle) * distance, // X position (right)
    80, // Y position (above)
    Math.cos(angle) * distance  // Z position
  );
  spotlight.target.position.set(0, 0, 0); // Point at coin
  spotlight.angle = Math.PI / 4; // 45 degree cone
  spotlight.penumbra = 0.3; // Soft edges
  spotlight.decay = 1.5;
  spotlight.distance = 300;
  scene.add(spotlight);
  scene.add(spotlight.target);

  // Loading manager setup
  const loadingManager = new THREE.LoadingManager();
  textureLoader = new THREE.TextureLoader(loadingManager);
  objLoader = new OBJLoader(loadingManager);

  // Track loading progress
  let assetsLoaded = 0;
  const totalAssets = 5 + 8 + 1 + 1; // 5 textures (4 planets + 1 asteroid) + 8 asteroid models + 1 coin model + 1 coin texture

  const onAssetLoad = () => {
    assetsLoaded++;
    console.log(`Assets loaded: ${assetsLoaded}/${totalAssets}`);
    if (assetsLoaded === totalAssets) {
      // All assets loaded, create scene objects
      console.log('All assets loaded, creating scene...');
      console.log('Planet textures:', planetTextures.filter(t => t && t.image).length);
      createStarField();
      createCoin();
      createPlanets();
      createAsteroids();
      animate();
    }
  };

  // Load all planet textures with error handling
  const textureFiles = [
    '2k_venus_surface.jpg',
    '2k_eris_fictional.jpg',
    '2k_mercury.jpg',
    '2k_makemake_fictional.jpg'
  ];

  textureFiles.forEach((filename, index) => {
    const texture = textureLoader.load(
      `/src/assets/textures/${filename}`,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        console.log(`Loaded planet texture ${index}: ${filename}`);
        onAssetLoad();
      },
      undefined,
      (error) => {
        console.error(`Failed to load planet texture ${filename}:`, error);
        onAssetLoad(); // Continue even if one fails
      }
    );
    planetTextures.push(texture);
  });

  // Load asteroid texture
  ceresTexture = textureLoader.load(
    '/src/assets/textures/2k_ceres_fictional.jpg',
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      console.log('Loaded Ceres texture');
      onAssetLoad();
    },
    undefined,
    (error) => {
      console.error('Failed to load Ceres texture:', error);
      onAssetLoad();
    }
  );

  // Load coin texture with alpha
  coinTexture = textureLoader.load(
    '/src/assets/img/MadeByTheCommunity_Alpha.png',
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      console.log('Loaded coin texture');
      onAssetLoad();
    },
    undefined,
    (error) => {
      console.error('Failed to load coin texture:', error);
      onAssetLoad();
    }
  );

  // Load sccm model
  objLoader.load(
    '/src/assets/models/sccm.obj',
    (object) => {
      coinModel = object;
      console.log('Loaded sccm model');
      onAssetLoad();
    },
    undefined,
    (error) => {
      console.error('Failed to load sccm model:', error);
      onAssetLoad();
    }
  );

  // Load all asteroid models
  for (let i = 0; i < 8; i++) {
    objLoader.load(
      `/src/assets/models/asteroid_${i}.obj`,
      (object) => {
        asteroidModels.push(object);
        onAssetLoad();
      },
      undefined,
      (error) => {
        console.error(`Error loading asteroid_${i}.obj:`, error);
        onAssetLoad(); // Continue even if one fails
      }
    );
  }
};

const createCoin = () => {
  if (!coinModel || !coinTexture) {
    console.error('Coin model or texture not loaded');
    return;
  }

  // Clone the model
  coin = coinModel.clone();

  // Single material with alpha transparency - bright metallic
  const coinMaterial = new THREE.MeshStandardMaterial({
    alphaMap: coinTexture,
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide, // Render both sides
    depthWrite: true,
    color: 0xf5f5f5,
    metalness: 0.8,
    roughness: 0.15,
    emissive: 0x888888,
    emissiveIntensity: 0.15
  });

  // Apply material and fix UV mapping
  coin.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry;
      const positionAttr = geometry.getAttribute('position');
      const uvAttr = geometry.getAttribute('uv');

      if (positionAttr && uvAttr) {
        const positions = positionAttr.array;
        const uvs = uvAttr.array;

        // Remap UVs for circular projection on cylinder caps
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];

          // For top and bottom faces (y = ±0.075), use circular UV mapping
          if (Math.abs(Math.abs(y) - 0.075) < 0.01) {
            const u = (x / 1.0 + 1.0) / 2.0;
            const v = (z / 1.0 + 1.0) / 2.0;
            uvs[i / 3 * 2] = u;
            uvs[i / 3 * 2 + 1] = v;
          }
        }

        uvAttr.needsUpdate = true;
      }

      child.geometry.computeVertexNormals();
      child.material = coinMaterial;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Scale up - coin_thick has radius 1, thickness 0.15
  const scale = 1.2;
  coin.scale.set(scale, scale, scale);

  // Position
  coin.position.set(0, 0, 0);

  // Rotate to vertical and 180 degrees (90 + 90 clockwise)
  coin.rotation.z = Math.PI / 2;
  coin.rotation.y = Math.PI; // 180 degrees total (90 + 90 clockwise)

  scene.add(coin);
  console.log('Textured coin with alpha cutouts added to scene');
};

const createStarField = () => {
  const starCount = 18000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;

    // Distribute stars in a large sphere far from the scene
    const radius = 800 + Math.random() * 500;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Star color variation (white to blue-white)
    const colorVariation = 0.85 + Math.random() * 0.15;
    colors[i3] = colorVariation;
    colors[i3 + 1] = colorVariation;
    colors[i3 + 2] = 1.0;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.5,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  starField = new THREE.Points(geometry, material);
  scene.add(starField);
};

const createPlanets = () => {
  // Filter out any null/undefined textures and shuffle
  const validTextures = planetTextures.filter(tex => tex && tex.image);

  if (validTextures.length < 3) {
    console.error('Not enough valid planet textures loaded!', validTextures.length);
  }

  const shuffledTextures = [...validTextures].sort(() => Math.random() - 0.5);
  console.log('Creating planets with textures:', shuffledTextures.length);

  // Planet 1 - Large gas giant
  const planet1Geometry = new THREE.SphereGeometry(80, 64, 64);
  const planet1Material = new THREE.MeshStandardMaterial({
    map: shuffledTextures[0] || null,
    emissive: 0x1a3a5a,
    emissiveIntensity: 0.3,
    roughness: 0.6,
    metalness: 0.2
  });
  const planet1 = new THREE.Mesh(planet1Geometry, planet1Material);
  const planet1Angle = Math.atan2(-400, -300);
  const planet1Radius = Math.sqrt(300 * 300 + 400 * 400);
  planet1.position.set(-300, -100, -400);
  planet1.userData = {
    rotationSpeed: 0.002,
    orbitSpeed: 0.0001,
    orbitAngle: planet1Angle,
    orbitRadius: planet1Radius,
    orbitHeight: -100
  };
  scene.add(planet1);
  planets.push(planet1);

  // Planet 2 - Medium planet
  const planet2Geometry = new THREE.SphereGeometry(50, 48, 48);
  const planet2Material = new THREE.MeshStandardMaterial({
    map: shuffledTextures[1] || null,
    emissive: 0x2a2a1a,
    emissiveIntensity: 0.2,
    roughness: 0.7,
    metalness: 0.1
  });
  const planet2 = new THREE.Mesh(planet2Geometry, planet2Material);
  const planet2Angle = Math.atan2(-300, 250);
  const planet2Radius = Math.sqrt(250 * 250 + 300 * 300);
  planet2.position.set(250, 80, -300);
  planet2.userData = {
    rotationSpeed: 0.003,
    orbitSpeed: 0.00015,
    orbitAngle: planet2Angle,
    orbitRadius: planet2Radius,
    orbitHeight: 80
  };
  scene.add(planet2);
  planets.push(planet2);

  // Planet 3 - Distant planet
  const planet3Geometry = new THREE.SphereGeometry(40, 48, 48);
  const planet3Material = new THREE.MeshStandardMaterial({
    map: shuffledTextures[2] || null,
    emissive: 0x2a3a4a,
    emissiveIntensity: 0.25,
    roughness: 0.65,
    metalness: 0.15
  });
  const planet3 = new THREE.Mesh(planet3Geometry, planet3Material);
  const planet3Angle = Math.atan2(-600, 100);
  const planet3Radius = Math.sqrt(100 * 100 + 600 * 600);
  planet3.position.set(100, -150, -600);
  planet3.userData = {
    rotationSpeed: 0.0025,
    orbitSpeed: 0.00008,
    orbitAngle: planet3Angle,
    orbitRadius: planet3Radius,
    orbitHeight: -150
  };
  scene.add(planet3);
  planets.push(planet3);
};

const createAsteroids = () => {
  const asteroidCount = 150;

  // Create material for asteroids
  const asteroidMaterial = new THREE.MeshStandardMaterial({
    map: ceresTexture,
    roughness: 0.95,
    metalness: 0.08
  });

  for (let i = 0; i < asteroidCount; i++) {
    // Pick a random asteroid model
    const modelIndex = Math.floor(Math.random() * asteroidModels.length);
    const originalModel = asteroidModels[modelIndex];

    if (!originalModel) continue;

    // Clone the model
    const asteroidClone = originalModel.clone();

    // Apply material to all meshes in the model
    asteroidClone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = asteroidMaterial.clone();
        child.material.roughness = 0.9 + Math.random() * 0.1;
        child.material.metalness = 0.05 + Math.random() * 0.1;
      }
    });

    // Position asteroids in a belt
    const angle = Math.random() * Math.PI * 2;
    const radius = 200 + Math.random() * 150;
    const height = (Math.random() - 0.5) * 50;

    asteroidClone.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius - 200
    );

    // Random size with variation
    const baseScale = 2 + Math.random() * 6;
    const scaleVariation = 0.8 + Math.random() * 0.4;
    asteroidClone.scale.set(
      baseScale * scaleVariation,
      baseScale * scaleVariation,
      baseScale * scaleVariation
    );

    // Random rotation
    asteroidClone.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    asteroidClone.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      orbitSpeed: 0.0002 + Math.random() * 0.0003,
      orbitAngle: angle,
      orbitRadius: radius,
      orbitHeight: height,
      orbitOffset: -200
    };

    scene.add(asteroidClone);
    asteroids.push(asteroidClone);
  }
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  // Camera remains stationary - no rotation
  // camera stays at position (0, 50, 200) looking at (0, 0, 0)

  // Stars remain static - no rotation

  // Rotate coin around its own Y axis
  if (coin) {
    coin.rotation.y += 0.005; // Rotate around Y axis (vertical)
  }

  // Orbit and rotate planets around the coin
  planets.forEach(planet => {
    // Update orbital angle
    planet.userData.orbitAngle += planet.userData.orbitSpeed;

    // Calculate new position based on orbit
    planet.position.x = Math.cos(planet.userData.orbitAngle) * planet.userData.orbitRadius;
    planet.position.y = planet.userData.orbitHeight;
    planet.position.z = Math.sin(planet.userData.orbitAngle) * planet.userData.orbitRadius;

    // Rotate planet on its own axis
    planet.rotation.y += planet.userData.rotationSpeed;
});

  // Orbit and rotate asteroids around the coin
  asteroids.forEach(asteroid => {
    // Update orbital angle
    asteroid.userData.orbitAngle += asteroid.userData.orbitSpeed;

    // Calculate new position based on orbit
    asteroid.position.x = Math.cos(asteroid.userData.orbitAngle) * asteroid.userData.orbitRadius;
    asteroid.position.y = asteroid.userData.orbitHeight;
    asteroid.position.z = Math.sin(asteroid.userData.orbitAngle) * asteroid.userData.orbitRadius + asteroid.userData.orbitOffset;

    // Rotate asteroid on its own axes
    asteroid.rotation.x += asteroid.userData.rotationSpeed.x;
    asteroid.rotation.y += asteroid.userData.rotationSpeed.y;
    asteroid.rotation.z += asteroid.userData.rotationSpeed.z;
  });

  renderer.render(scene, camera);
};

const handleResize = () => {
  if (!camera || !renderer) return;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  window.removeEventListener('resize', handleResize);

  if (starField) {
    starField.geometry.dispose();
    starField.material.dispose();
  }

  planets.forEach(planet => {
    planet.geometry.dispose();
    planet.material.dispose();
    if (planet.material.map) planet.material.map.dispose();
  });

  asteroids.forEach(asteroid => {
    asteroid.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      }
    });
  });

  // Dispose asteroid models
  asteroidModels.forEach(model => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      }
    });
  });

  // Dispose coin
  if (coin) {
    if (coin.geometry) coin.geometry.dispose();
    if (coin.material) coin.material.dispose();
  }

  // Dispose all planet textures
  planetTextures.forEach(texture => {
    if (texture) texture.dispose();
  });

  if (ceresTexture) ceresTexture.dispose();
  if (coinTexture) coinTexture.dispose();

  // Dispose coin
  if (coin) {
    coin.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      }
    });
  }

  if (coinModel) {
    coinModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      }
    });
  }

  if (renderer) {
    renderer.dispose();
  }

  scene = null;
  camera = null;
  renderer = null;
  starField = null;
  planets = [];
  asteroids = [];
  asteroidModels = [];
  planetTextures = [];
  coin = null;
  coinModel = null;
  coinTexture = null;
};

onMounted(() => {
  if (!canvasRef.value) return;
  initThreeJS();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
canvas {
  display: block;
}
</style>