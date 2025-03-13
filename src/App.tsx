import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const handleResize = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  addEventListener("resize", () => {
    const { innerWidth, innerHeight, devicePixelRatio } = window;
    const aspect = innerWidth / innerHeight;

    renderer.setSize(innerWidth, innerHeight);

    renderer.pixelRatio = devicePixelRatio;
    camera.updateProjectionMatrix();
    camera.aspect = aspect;
  });
};

const createPlane = () => {
  // create random position
  const x = Math.floor(Math.random() * 2);
  const y = Math.floor(Math.random() * 2);
  const z = Math.floor(Math.random() * 2);

  // create geomentry
  const geometry = new THREE.PlaneGeometry(1, 1);

  // create material
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(geometry, material);

  plane.position.set(x, y, z);

  return plane;
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
      1000
    );
    camera.position.z = 5; // Make sure the camera is in a position to view the box

    // create a bunch of planes
    const countOfPlanes = 100;
    const planes = Array(countOfPlanes).fill(1).map(createPlane);
    scene.add(...planes);

    // create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Attach the renderer's canvas to the DOM
    const canvasContainer = document.querySelector("#canvas-container");
    if (canvasContainer) {
      canvasContainer.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      // mesh.rotation.x += 0.01; // Rotate the mesh for some animation
      // mesh.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    handleResize(camera, renderer);

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
    <div id="canvas-container" style={{ width: "100%", height: "100vh" }} />
  );
}

export default App;
