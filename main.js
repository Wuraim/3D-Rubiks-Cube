import * as THREE from 'three';
import RubiksCube from './class/rubiksCube.class.js';
import { allRubiksMovement, allSliceMovement } from './rotation.js';

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
const rotationVector = new THREE.Vector3();
window.addEventListener('keydown', async (event) => {
  if (!(rubiks.isCubeRotating || rubiks.isSliceRotating)) {
    await allRubiksMovement.forEach(async (move) => {
      if(event.key === move.key) {
        rotationVector.set(move.vector.x, move.vector.y, move.vector.z);
        await rubiks.rotateUntilOtherSide(rotationVector);
      }
    })

    await allSliceMovement.forEach(async (move) => {
      if(event.key === move.key) {
        rotationVector.set(move.vector.x, move.vector.y, move.vector.z);
        await rubiks.rotateSliceUntilOtherSide(move.slice, rotationVector);
      }
    })

    if (event.key === 'Enter') {
      await rubiks.shuffleTimes(30);
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
