import * as THREE from 'three';
import Cubie from './cubie.class';
import { allSliceMovement } from '../rotation.js';

export default class RubiksCube {

    // TODO: Ne plus définir de manière constante les frame par rotation
    static rotationAngle = Math.PI / 2;
    static framePerRotation = 30;
    static rotationPerFrame = this.rotationAngle / this.framePerRotation;
    
    targetRotation = 0;
    rotationAxis = new THREE.Vector3();
    isCubeRotating = false;
    isSliceRotating = false;

    group = null;
    allCubies = [];
    
    constructor() {
        const rubiks = new THREE.Group();
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const cubie = new Cubie(x,y,z);
                    this.allCubies.push(cubie);
                    rubiks.add(cubie.mesh);
                }
            }
        }

        this.group = rubiks;
    }

    async rotateUntilOtherSide(axis) {
        this.rotationAxis.copy(axis);
        this.isCubeRotating = true;
        this.isSliceRotating = false;

        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!this.isCubeRotating) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });
    }

    listCubies = [];  
    async rotateSliceUntilOtherSide(slice, axis) {
        this.listCubies = this.getAllCubeWhoAreBetween(slice);
        this.rotationAxis.copy(axis);
        this.isCubeRotating = false;
        this.isSliceRotating = true;

        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!this.isSliceRotating) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });
    }

    getAllCubeWhoAreBetween({x,y,z}) {
        const result = [];
        this.group.children.forEach((cube) => {
          const position = cube.position;
      
          const isOkX = x !== undefined ? x - 0.1 < position.x && position.x < x + 0.1 : false;
          const isOkY = y !== undefined ? y - 0.1 < position.y && position.y < y + 0.1 : false;
          const isOkZ = z !== undefined ? z - 0.1 < position.z && position.z < z + 0.1 : false;
      
          if (isOkX || isOkY || isOkZ) {
            result.push(cube);
          }
        })
      
        return result;
    }

    // TODO: Lancer cette fonction à chaque changement de position et garder le résultat dans une variable
    getFrontSlice(){
        return this.getAllCubeWhoAreBetween({x:1})
    }

    targetRotation = RubiksCube.rotationAngle;
    t0 = 0;
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

            this.t0 = time;

            renderer.render(scene, camera);
        }
    }

    getRandomMove() {
        const randomNumber = Math.floor(Math.random() * allSliceMovement.length);
        return allSliceMovement[randomNumber];
    }

    vectorSameAbsValue(vectorA, vectorB) {
        return Math.abs(vectorA.x) === Math.abs(vectorB.x) && 
        Math.abs(vectorA.y) === Math.abs(vectorB.y) &&
        Math.abs(vectorA.z) === Math.abs(vectorB.z);
    }

    rotationVector = new THREE.Vector3();

    isNotSameAxisRotation(move, allRandomMove){
        this.vectorSameAbsValue(move.vector, allRandomMove[allRandomMove.length - 1].vector)
    }

    async shuffleTimes(times){
        const allRandomMove = [];

        for (let i = 0; i < times; i++) {
            let move = null;

            if (allRandomMove.length === 0) {
                move = this.getRandomMove();
            } else {
                do {
                    move = this.getRandomMove();
                } while (this.isNotSameAxisRotation(move, allRandomMove))
            }

            allRandomMove.push(move);
            this.rotationVector.set(move.vector.x, move.vector.y, move.vector.z);
            await this.rotateSliceUntilOtherSide(move.slice, this.rotationVector);
        }
    }
}
