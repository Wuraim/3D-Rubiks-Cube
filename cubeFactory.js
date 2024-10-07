import * as THREE from 'three';

// Fonction pour créer une texture avec une bordure noire
export function createBorderedTexture(color) {
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