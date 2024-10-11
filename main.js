import * as THREE from 'three';
import RubiksCube from './class/rubiksCube.class.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
const rendererFrame = document.querySelector('#rendererFrame');

renderer.setSize(window.innerWidth, window.innerHeight);

const rubiks = new RubiksCube();

renderer.setAnimationLoop(rubiks.getAnimation(renderer, scene, camera));
rendererFrame.appendChild(renderer.domElement);


scene.add(rubiks.group);

const axesHelper = new THREE.AxesHelper( 2 );
scene.add( axesHelper );

// Ajouter un écouteur d'événements pour capturer les touches du clavier
window.addEventListener('keydown', (event) => {
  if (!rubiks.isRotating) {
    switch (event.key) {
      case 'ArrowRight':
        rubiks.rotateUntilOtherSide(new THREE.Vector3(0, 0, 1));
        break;
      case 'ArrowLeft':
        rubiks.rotateUntilOtherSide(new THREE.Vector3(0, 0, -1));
        break;
      case 'ArrowUp':
        rubiks.rotateUntilOtherSide(new THREE.Vector3(0, -1, 0));
        break;
      case 'ArrowDown':
        rubiks.rotateUntilOtherSide(new THREE.Vector3(0, 1, 0));
        break;
      case 'A':
        rubiks.rotateSliceUntilOtherSide({z:1}, new THREE.Vector3(0, 0, 1));
        break;
      case 'E':
        rubiks.rotateSliceUntilOtherSide({z:1}, new THREE.Vector3(0, 0, -1));
        break;
      case 'Q':
        rubiks.rotateSliceUntilOtherSide({z:0}, new THREE.Vector3(0, 0, 1));
        break;
      case 'D':
        rubiks.rotateSliceUntilOtherSide({z:0}, new THREE.Vector3(0, 0, -1));
        break;
      case 'W':
        rubiks.rotateSliceUntilOtherSide({z:-1}, new THREE.Vector3(0, 0, 1));
        break;
      case 'C':
        rubiks.rotateSliceUntilOtherSide({z:-1}, new THREE.Vector3(0, 0, -1));
        break;
    }
  }
});

// Position de la caméra
camera.position.set(6, 2, 2);
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(0, 0, 0);

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
