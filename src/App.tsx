import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const createCube = (
  geometry: THREE.BoxGeometry,
  material: THREE.MeshBasicMaterial
) => {
  const edges = new THREE.EdgesGeometry(geometry);
  const box = new THREE.LineSegments(edges, material);

  const spaceWidth = 50;

  const [x, y, z] = Array.from(
    { length: 3 },
    () => (Math.random() - 0.5) * spaceWidth
  );

  box.position.set(x, y, z);

  box.userData = {
    update: (time) => {
      box.rotation.x = (Math.PI * time) / 4;
      box.rotation.y = (Math.PI * time) / 6;
    },
  };

  return box;
};

const createCubes = (
  count: number,
  geometry: THREE.BoxGeometry,
  material: THREE.MeshBasicMaterial
) => {
  const group = new THREE.Group();

  for (let i = 0; i < count; i += 1) {
    group.add(createCube(geometry, material));
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
      1000
    );
    camera.position.z = 5; // Make sure the camera is in a position to view the box

    const hemiLight = new THREE.HemisphereLight(0xfffff, 0x444444);
    scene.add(hemiLight);

    // create geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // create material
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    const boxes = createCubes(500, geometry, material);

    scene.add(boxes);

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

    // create clock
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      // boxes.rotation.x += 0.01; // Rotate the mesh for some animation
      // boxes.rotation.y += 0.01;

      const time = clock.getElapsedTime();

      boxes.children.forEach((child) => {
        child.userData.update(time);
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

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
