import * as THREE from 'three';
import RubiksCube from './class/rubiksCube.class.js';
import './service/terminal.js';

import { allRubiksMovement } from './rotation.js';
import { clearLog } from './service/terminal.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
let rendererFrame = document.querySelector('#rendererFrame')!;

renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

let rubiks = new RubiksCube();
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2(999, 999);

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

let isMouseDown = false;
function getPointedCubie(): THREE.Object3D<THREE.Object3DEventMap> | null {
  let result = null;
  raycaster.setFromCamera(pointer, camera);
  const frontCubeMesh: THREE.Object3D[] = rubiks.getFrontSlice().map((cubie) => cubie.mesh!);
  const intersects = raycaster.intersectObjects(frontCubeMesh);
  if (intersects[0]) {
    result = intersects[0].object;
  }
  return result;
}

let allPointedCube: Array<THREE.Object3D<THREE.Object3DEventMap>> = []

function isApproximatively(a : number, b : number) {
  return a > b - 0.1 && a < b + 0.1;
}

function areInlineOnAxisField(axisField: 'x' | 'y' | 'z'): boolean {
  let result = true;
  
  if(allPointedCube.length >= 2) {
    for(let i = 0; i < allPointedCube.length - 1; i++) {

      const areOnTheSameAxis = isApproximatively(allPointedCube[i].position[axisField], allPointedCube[i+1].position[axisField]);
      const areInOrderY = isApproximatively(Math.abs(allPointedCube[i].position.y - allPointedCube[i+1].position.y), 1);
      const areInOrderZ = isApproximatively(Math.abs(allPointedCube[i].position.z - allPointedCube[i+1].position.z), 1);

      result = areOnTheSameAxis && (areInOrderY || areInOrderZ);

      if (result === false) {
        break;
      }
    }
  }
  
  return result;
}

function areInline(): boolean {
  return areInlineOnAxisField('y') || areInlineOnAxisField('z');
}

function getWantedRotation() {
  let result = null;

  if(areInlineOnAxisField('y')) {
    const sense = allPointedCube[0].position.z;
    result = {  
      slice: {y: allPointedCube[0].position.y},
      vector: {x: 0, y: sense, z: 0},
    };
  } else if (areInlineOnAxisField('z')) {
    const sense = allPointedCube[2].position.y;
    result = {  
      slice: {z: allPointedCube[0].position.z},
      vector: {x: 0, y: 0, z: sense},
    };
  }

  return result;
}

async function addPointedCube(cube: THREE.Object3D<THREE.Object3DEventMap>): Promise<void> {
  if (!allPointedCube.includes(cube)) {
    allPointedCube.push(cube);

    if(allPointedCube.length > 1) {
      const inlined = areInline();

      if (!inlined) {
        allPointedCube.splice(0, allPointedCube.length - 1);
      } else if (allPointedCube.length === 3 && inlined) {
        
        const move = getWantedRotation();
        if(move) {
          rotationVector.set(move.vector.x, move.vector.y, move.vector.z);
          await rubiks.rotateSliceUntilOtherSide(move.slice, rotationVector);
        }
      }
    }

    if (allPointedCube.length === 3) {
      allPointedCube = [];
    }
  }
}

function normalizePointer(event: MouseEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
  };
}

async function onPointerMove(event: MouseEvent) {
  if (!isMouseDown) return;  // Ne fonctionne que lorsque le bouton gauche est maintenu

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

  const normalized = normalizePointer(event, renderer.domElement);
  pointer.x = normalized.x;
  pointer.y = normalized.y;

  const pointedCubie = getPointedCubie();
  if (pointedCubie) {
    await addPointedCube(pointedCubie)
  }
}

function onMouseDown(event: MouseEvent) {
  if (event.button === 0) {  // Vérifie si le bouton gauche de la souris est enfoncé
    isMouseDown = true;
  }
}

function onMouseUp(event: MouseEvent) {
  if (event.button === 0) {  // Vérifie si le bouton gauche de la souris est relâché
    isMouseDown = false;
  }
}

window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onPointerMove);

const shuffleButton = document.querySelector('#shuffle')!;
const restartButton = document.querySelector('#restart')!;
const resolvedButton = document.querySelector('#resolved')!;

async function onClickShuffle(){
  await rubiks.shuffleTimes(30);
}

async function onClickRestart(){
  rendererFrame.removeChild(renderer.domElement);

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  rubiks = new RubiksCube();
  renderer.setAnimationLoop(rubiks.getAnimation(renderer, scene, camera));
  rendererFrame.appendChild(renderer.domElement);

  scene.add(rubiks.group);
  scene.add( axesHelper );

  clearLog();
}

async function onClickResolved() {
  await rubiks.resolve();
}

shuffleButton.addEventListener('click', onClickShuffle);
restartButton.addEventListener('click', onClickRestart);
resolvedButton.addEventListener('click', onClickResolved);