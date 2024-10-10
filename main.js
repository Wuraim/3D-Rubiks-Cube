import * as THREE from 'three';
import { materials } from './colors.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
const rendererFrame = document.querySelector('#rendererFrame');

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
rendererFrame.appendChild(renderer.domElement);

// Variables pour stocker les cubes
const cubeSize = 1;

// Créer le Rubik's Cube
const rubiksCube = new THREE.Group();
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cube = new THREE.Mesh(geometry, materials);
      cube.position.set(x, y, z);
      rubiksCube.add(cube);
    }
  }
}
scene.add(rubiksCube);

const axesHelper = new THREE.AxesHelper( 2 );
scene.add( axesHelper );

// Variables pour contrôler la vitesse de rotation du cube
const rotationAngle = Math.PI / 2; // 45 degrés
const framePerRotation = 30;
const rotationPerFrame = rotationAngle / framePerRotation; // 30 frames pour une rotation complète
let targetRotation = 0; // Angle de rotation restant
let restingRotation = 0;

let rotationAxis = new THREE.Vector3(); // Axe de rotation stocké

let groupToRotate;
let isRotating = false; // État de la rotation
let isCubeRotating = false;
let isSliceRotating = false;

function rotateUntilOtherSide(axis) {
  groupToRotate = rubiksCube;
  targetRotation += rotationAngle; // Définit la rotation cible
  isRotating = true; // Démarre la rotation
  isCubeRotating = true;
  isSliceRotating = false;
  rotationAxis.copy(axis); // Stocker l'axe de rotation
}

let listCubies;
let tempGroup;
function rotateSliceUntilOtherSide(slice, axis) {
  listCubies = getAllCubeWhoAreBetween(slice);

  rotationAxis.copy(axis); // Stocker l'axe de rotation
  targetRotation += rotationAngle; // Définit la rotation cible

  isSliceRotating = true;
  isRotating = true; // Démarre la rotation
}

// Ajouter un écouteur d'événements pour capturer les touches du clavier
window.addEventListener('keydown', (event) => {
  if (!isRotating) {
    switch (event.key) {
      case 'ArrowRight':
        rotateUntilOtherSide(new THREE.Vector3(0, 0, 1));
        break;
      case 'ArrowLeft':
        rotateUntilOtherSide(new THREE.Vector3(0, 0, -1));
        break;
      case 'ArrowUp':
        rotateUntilOtherSide(new THREE.Vector3(0, -1, 0));
        break;
      case 'ArrowDown':
        rotateUntilOtherSide(new THREE.Vector3(0, 1, 0));
        break;
      case 'A':
        rotateSliceUntilOtherSide({z:1}, new THREE.Vector3(0, 0, 1));
        break;
      case 'E':
        rotateSliceUntilOtherSide({z:1}, new THREE.Vector3(0, 0, -1));
        break;
      case 'Q':
        rotateSliceUntilOtherSide({z:0}, new THREE.Vector3(0, 0, 1));
        break;
      case 'D':
        rotateSliceUntilOtherSide({z:0}, new THREE.Vector3(0, 0, -1));
        break;
      case 'W':
        rotateSliceUntilOtherSide({z:-1}, new THREE.Vector3(0, 0, 1));
        break;
      case 'C':
        rotateSliceUntilOtherSide({z:-1}, new THREE.Vector3(0, 0, -1));
        break;
    }
  }
});

// Position de la caméra
camera.position.set(6, 2, 2);
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(0, 0, 0);

function animate(time) {
  if (isRotating) {

    if (isCubeRotating) {
      rubiksCube.rotateOnWorldAxis(rotationAxis, rotationPerFrame);
      targetRotation -= rotationPerFrame; 
    } else if (isSliceRotating) {
      listCubies.forEach((cube) => {
        cube.position.applyAxisAngle(rotationAxis, rotationPerFrame);
        cube.rotateOnWorldAxis(rotationAxis, rotationPerFrame);
      })
      targetRotation -= rotationPerFrame;     
    }

    
    if (targetRotation < 0) {

      if (isSliceRotating) {
        listCubies = [];
      }

      isRotating = false;
      isCubeRotating = false;
      isSliceRotating = false;
      targetRotation = 0;
    }
    
  }

  renderer.render(scene, camera);
}


const logVector = new THREE.Vector3();

let temporaryGroup;
function getAllCubeWhoAreBetween({x,y,z}) {
  
  const result = [];
  rubiksCube.children.forEach((cube) => {
    const position = cube.position;

    const isOkX = x !== undefined ? x - 0.1 < position.x && position.x < x + 0.1 : false;
    const isOkY = y !== undefined ? y - 0.1 < position.y && position.y < y + 0.1 : false;
    const isOkZ = z !== undefined ? z - 0.1 < position.z && position.z < z + 0.1 : false;

    if(isOkX || isOkY || isOkZ) {
      result.push(cube);
    }
  })

  return result;
}

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
