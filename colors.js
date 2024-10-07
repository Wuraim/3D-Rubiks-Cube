import * as THREE from 'three';
import { createBorderedTexture } from './cubeFactory';

export const colors = {
    front: 0xff0000,   // Rouge
    back: 0xffa500,    // Orange
    top: 0xffffff,     // Blanc
    bottom: 0xffff00,  // Jaune
    right: 0x0000ff,   // Bleu
    left: 0x00ff00     // Vert
}

export const materials = [
    new THREE.MeshBasicMaterial({ map: createBorderedTexture('#ff0000') }),  // Rouge (avant)
    new THREE.MeshBasicMaterial({ map: createBorderedTexture('#ff8c00') }),  // Orange (arrière)
    new THREE.MeshBasicMaterial({ map: createBorderedTexture('#ffffff') }),  // Blanc (haut)
    new THREE.MeshBasicMaterial({ map: createBorderedTexture('#ffff00') }),  // Jaune (bas)
    new THREE.MeshBasicMaterial({ map: createBorderedTexture('#0000ff') }),  // Bleu (droite)
    new THREE.MeshBasicMaterial({ map: createBorderedTexture('#00ff00') })   // Vert (gauche)
];