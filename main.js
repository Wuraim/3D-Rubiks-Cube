import * as THREE from 'three';
import RubiksCube from './class/rubiksCube.class.js';
import { allRubiksMovement, allSliceMovement } from './rotation.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
const rendererFrame = document.querySelector('#rendererFrame');

renderer.setSize(window.innerWidth, window.innerHeight);

const rubiks = new RubiksCube();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(999, 999);


renderer.setAnimationLoop(rubiks.getAnimation(renderer, scene, camera, pointer, raycaster));
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

let isMouseDown = false;
function getPointedCubie() {
  let result = null;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(rubiks.getFrontSlice());
  // console.log(intersects)
  if (intersects[0]) {
    result = intersects[0].object;
  }
  return result;
}

let allPointedCube = []

function areInlineOnAxisField(axisField) {
  let result = null;
  
  if(allPointedCube.length >= 2) {
    for(let i = 0; i < allPointedCube.length - 1; i++) {
      result = allPointedCube[i].position[axisField] === allPointedCube[i+1].position[axisField];

      if (result === false) {
        break;
      }
    }
  }
  
  return result;
}

function areInline(){
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
    const sense = allPointedCube[0].position.y;
    result = {  
      slice: {z: allPointedCube[0].position.z},
      vector: {x: 0, y: 0, z: -sense},
    };
  }

  return result;
}

async function addPointedCube(cube) {
  if (cube && !allPointedCube.includes(cube)) {
    allPointedCube.push(cube);

    if(allPointedCube.length === 3) {
      debugger;
    }

    if(allPointedCube.length > 1) {
      const inlined = areInline();

      if (!inlined) {
        allPointedCube.splice(0, allPointedCube.length - 1);
      } else if (allPointedCube.length === 3 && inlined) {
        console.log('INLINED')
        const move = getWantedRotation();
        rotationVector.set(move.vector.x, move.vector.y, move.vector.z);
        await rubiks.rotateSliceUntilOtherSide(move.slice, rotationVector);

        allPointedCube = [];
      }
    }
    
  }
}

async function onPointerMove(event) {
  if (!isMouseDown) return;  // Ne fonctionne que lorsque le bouton gauche est maintenu

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

  const pointedCubie = getPointedCubie();

  await addPointedCube(pointedCubie)
}

function onMouseDown(event) {
  if (event.button === 0) {  // Vérifie si le bouton gauche de la souris est enfoncé
    isMouseDown = true;
  }
}

function onMouseUp(event) {
  if (event.button === 0) {  // Vérifie si le bouton gauche de la souris est relâché
    isMouseDown = false;
  }
}

window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onPointerMove);