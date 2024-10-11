import * as THREE from 'three';

function createBorderedTexture(color) {
    const size = 256;  // Taille de la texture
    const borderSize = 16;  // Taille de la bordure
  
    // Créer un élément canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
  
    const context = canvas.getContext('2d');
  
    // Remplir le fond avec la couleur noire (pour la bordure)
    context.fillStyle = '#000000';  // Noir pour la bordure
    context.fillRect(0, 0, size, size);
  
    // Remplir le centre avec la couleur désirée
    context.fillStyle = color;
    context.fillRect(borderSize, borderSize, size - borderSize * 2, size - borderSize * 2);
  
    // Utiliser le canvas comme texture
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

export default class Cubie {
    static cubeSize = 1;

    materials = [
        new THREE.MeshBasicMaterial({ map: createBorderedTexture('#ff00ff') }),  // Magenta vif (avant)
        new THREE.MeshBasicMaterial({ map: createBorderedTexture('#ff4500') }),  // Orange vif (arrière)
        new THREE.MeshBasicMaterial({ map: createBorderedTexture('#ffffff') }),  // Blanc (haut)
        new THREE.MeshBasicMaterial({ map: createBorderedTexture('#39ff14') }),  // Vert néon (bas)
        new THREE.MeshBasicMaterial({ map: createBorderedTexture('#007fff') }),  // Bleu électrique (droite)
        new THREE.MeshBasicMaterial({ map: createBorderedTexture('#f9ff00') })   // Jaune fluo (gauche)
    ];

    constructor(x,y,z) {
        const geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        const cube = new THREE.Mesh(geometry, this.materials);
        cube.position.set(x, y, z);
        return cube;
    }
}