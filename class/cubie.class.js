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
    mesh = null;

    allColor = [
        '#ff0000',  // Rouge
        '#ff8c00',  // Orange 
        '#ffffff',  // Blanc
        '#39ff14',  // Vert
        '#0000cd',  // Bleu
        '#ffff00',  // Jaune
    ];
    
    

    materials = this.allColor.map((color) => {
        return new THREE.MeshBasicMaterial({  map: createBorderedTexture(color) })
    })

    emptyMaterials = this.allColor.map((color) => {
        return new THREE.MeshBasicMaterial({ 
            color: color,  // Cyan
            transparent: true, 
            opacity: 0.3,  // Niveau de transparence (0.0 = totalement transparent, 1.0 = opaque)
            side: THREE.DoubleSide // Pour que les faces internes soient visibles aussi
        })
    })

    constructor(x,y,z) {
        const geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        this.mesh = new THREE.Mesh(geometry, this.materials);
        this.mesh.position.set(x, y, z);
    }

    displayAsDefault() {
        this.mesh.material = this.materials;
    }

    displayAsSelected(){
        this.mesh.material = this.emptyMaterials;
    }
}