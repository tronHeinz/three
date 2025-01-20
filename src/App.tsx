import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const handleResize = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
};

const createStar = (color: number = 0xffffff, size: number = 0.1) => {
  // create geometry
  const geometry = new THREE.SphereGeometry(size, 8, 8);

  // create material
  const material = new THREE.MeshBasicMaterial({ color });

  // create mesh
  return new THREE.Mesh(geometry, material);
};

const createStars = (count: number = 100, distance: number = 200) => {
  const group = new THREE.Group();

  for (let i = 0; i < count; i += 1) {
    const star = createStar();

    const [x, y, z] = Array.from({ length: 3 }, () => {
      const randomNumber = Math.random() - 0.5; // random number between -0.5 and 0.5
      return randomNumber * distance;
    });

    star.position.set(x, y, z);
    group.add(star);
  }
  return group;
};

function App() {
  useEffect(() => {
    // create scene
    const scene = new THREE.Scene();

    // create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 5; // Make sure the camera is in a position to view the box

    const stars = createStars(10000, 200);
    scene.add(stars);

    // create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Attach the renderer's canvas to the DOM
    const canvasContainer = document.querySelector('#canvas-container');
    if (canvasContainer) {
      canvasContainer.appendChild(renderer.domElement);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      // stars.rotation.x += 0.01; // Rotate the star for some animation
      // stars.rotation.y += 0.01;

      // animate camera
      camera.position.z -= 0.1;

      if (camera.position.z < -50) {
        camera.position.z = 100;
      }

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      handleResize(camera, renderer);
    });

    // create controls
    const controlls = new OrbitControls(camera, renderer.domElement);
    controlls.enableDamping = true;
    controlls.dampingFactor = 0.25;

    // Clean up on unmount
    return () => {
      renderer.dispose();
      // Optionally, remove the canvas
      if (canvasContainer) {
        canvasContainer.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array for useEffect to run once

  return (
    <div id="canvas-container" style={{ width: '100%', height: '100vh' }} />
  );
}

export default App;
