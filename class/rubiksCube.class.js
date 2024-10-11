import * as THREE from 'three';
import Cubie from './cubie.class';

export default class RubiksCube {

    static rotationAngle = Math.PI / 2;
    static framePerRotation = 30;
    static rotationPerFrame = this.rotationAngle / this.framePerRotation;
    
    targetRotation = 0;
    rotationAxis = new THREE.Vector3();
    isCubeRotating = false;
    isSliceRotating = false;

    group = null;
    
    constructor() {
        const rubiks = new THREE.Group();
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const cube = new Cubie(x,y,z);
                    rubiks.add(cube);
                }
            }
        }

        this.group = rubiks;
    }

    rotateUntilOtherSide(axis) {
        this.rotationAxis.copy(axis);
        this.isCubeRotating = true;
        this.isSliceRotating = false;
    }

    listCubies = [];  
    rotateSliceUntilOtherSide(slice, axis) {
        this.listCubies = this.getAllCubeWhoAreBetween(slice);
        this.rotationAxis.copy(axis); // Stocker l'axe de rotation
        this.isCubeRotating = false;
        this.isSliceRotating = true;
    }

    getAllCubeWhoAreBetween({x,y,z}) {
        const result = [];
        this.group.children.forEach((cube) => {
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

    targetRotation = RubiksCube.rotationAngle;
    getAnimation(renderer, scene, camera){
        return (time) => {

            if (this.isCubeRotating) {
                this.group.children.forEach((cube) => {
                    cube.position.applyAxisAngle(this.rotationAxis, RubiksCube.rotationPerFrame);
                    cube.rotateOnWorldAxis(this.rotationAxis, RubiksCube.rotationPerFrame);
                })

                this.targetRotation -= RubiksCube.rotationPerFrame;     
            } else if (this.isSliceRotating) {
                this.listCubies.forEach((cube) => {
                    cube.position.applyAxisAngle(this.rotationAxis, RubiksCube.rotationPerFrame);
                    cube.rotateOnWorldAxis(this.rotationAxis, RubiksCube.rotationPerFrame);
                })
                this.targetRotation -= RubiksCube.rotationPerFrame;     
            }

            if (this.targetRotation < 0) {
                if (this.isSliceRotating) {
                    this.listCubies = [];
                }

                this.isCubeRotating = false;
                this.isSliceRotating = false;
                this.targetRotation = RubiksCube.rotationAngle;
            }
            
            renderer.render(scene, camera);
        }
    }
}
