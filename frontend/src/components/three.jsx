import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function RubiksCube() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(4.2, 4.2, 5.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const rubiksGroup = new THREE.Group();
    scene.add(rubiksGroup);

    const cubieSize = 0.62;
    const gap = 0.045;
    const spacing = cubieSize + gap;

    const blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.6,
      metalness: 0.1,
    });
    const edgeColor = 0xffffff;

    const cubies = [];
    const geometries = []; // track for disposal

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);
          geometries.push(geometry);
          const cubie = new THREE.Mesh(geometry, blackMaterial);
          cubie.position.set(x * spacing, y * spacing, z * spacing);

          const edgesGeo = new THREE.EdgesGeometry(geometry);
          const edgesMat = new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 });
          const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
          cubie.add(edgeLines);

          cubie.userData.gx = x;
          cubie.userData.gy = y;
          cubie.userData.gz = z;

          rubiksGroup.add(cubie);
          cubies.push(cubie);
        }
      }
    }

    // ---- Layer-turn animation system ----
    const pivot = new THREE.Group();
    rubiksGroup.add(pivot);

    let animating = false;
    let animAxis = 'x';
    let animDir = 1;
    let animProgress = 0;
    const animSpeed = 1.2;
    const axes = ['x', 'y', 'z'];

    let currentMove = null;
    let solveTimeout;

    function pickMove() {
      const axis = axes[Math.floor(Math.random() * 3)];
      const layer = Math.floor(Math.random() * 3) - 1;
      const dir = Math.random() < 0.5 ? 1 : -1;
      return { axis, layer, dir };
    }

    function startMove() {
      currentMove = pickMove();
      animAxis = currentMove.axis;
      animDir = currentMove.dir;
      animProgress = 0;

      pivot.rotation.set(0, 0, 0);
      pivot.position.set(0, 0, 0);
      rubiksGroup.updateMatrixWorld(true);

      currentMove.cubiesInLayer = cubies.filter((c) => {
        const key =
          currentMove.axis === 'x'
            ? c.userData.gx
            : currentMove.axis === 'y'
            ? c.userData.gy
            : c.userData.gz;
        return key === currentMove.layer;
      });

      currentMove.cubiesInLayer.forEach((c) => {
        pivot.attach(c);
      });

      animating = true;
    }

    function finishMove() {
      const angle = animDir * (Math.PI / 2);
      pivot.rotation.set(0, 0, 0);
      if (animAxis === 'x') pivot.rotation.x = angle;
      if (animAxis === 'y') pivot.rotation.y = angle;
      if (animAxis === 'z') pivot.rotation.z = angle;
      pivot.updateMatrixWorld(true);

      currentMove.cubiesInLayer.forEach((c) => {
        rubiksGroup.attach(c);

        c.position.x = Math.round(c.position.x / spacing) * spacing;
        c.position.y = Math.round(c.position.y / spacing) * spacing;
        c.position.z = Math.round(c.position.z / spacing) * spacing;

        const snap90 = (r) => Math.round(r / (Math.PI / 2)) * (Math.PI / 2);
        c.rotation.set(snap90(c.rotation.x), snap90(c.rotation.y), snap90(c.rotation.z));

        c.userData.gx = Math.round(c.position.x / spacing);
        c.userData.gy = Math.round(c.position.y / spacing);
        c.userData.gz = Math.round(c.position.z / spacing);
      });

      pivot.rotation.set(0, 0, 0);
      animating = false;
      currentMove = null;

      solveTimeout = setTimeout(startMove, 180);
    }

    solveTimeout = setTimeout(startMove, 500);

    const clock = new THREE.Clock();
    let frameId;

    function animate() {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      rubiksGroup.rotation.y += 0.0025;
      rubiksGroup.rotation.x = Math.sin(Date.now() * 0.00015) * 0.25;

      if (animating) {
        const step = animSpeed * delta * 3;
        animProgress += step;
        const t = Math.min(animProgress / (Math.PI / 2), 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const angle = eased * (Math.PI / 2) * animDir;

        pivot.rotation.set(0, 0, 0);
        if (animAxis === 'x') pivot.rotation.x = angle;
        if (animAxis === 'y') pivot.rotation.y = angle;
        if (animAxis === 'z') pivot.rotation.z = angle;

        if (t >= 1) {
          finishMove();
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    // ---- Cleanup on unmount ----
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(solveTimeout);
      cancelAnimationFrame(frameId);

      geometries.forEach((g) => g.dispose());
      blackMaterial.dispose();
      cubies.forEach((c) => {
        c.children.forEach((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '200%',
        height: '200%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    />
  );
}
