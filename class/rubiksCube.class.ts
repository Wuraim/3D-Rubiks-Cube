import * as THREE from 'three';
import Cubie from './cubie.class';
import State from './state.class';
import { allSliceMovement, MovementVector, SliceMovement } from '../rotation';
import { Slice } from '../model/slice';
import { getStateSlice } from '../service/rubiksToState';

export default class RubiksCube {

    static rotationAngle = Math.PI / 2;
    static rotationTimeSec = 0.3;
    
    rotationAxis: THREE.Vector3 = new THREE.Vector3();
    isCubeRotating = false;
    isSliceRotating = false;

    state: State = new State();
    group: THREE.Group<THREE.Object3DEventMap>;
    allCubies: Array<Cubie> = [];

    constructor() {
        const rubiks = new THREE.Group();
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const cubie = new Cubie(x,y,z);
                    this.allCubies.push(cubie);
                    rubiks.add(cubie.mesh as THREE.Mesh);
                }
            }
        }

        this.group = rubiks;
    }

    mainRotationVector = new THREE.Vector3(0,0,0);
    async rotateUntilOtherSide(axis: THREE.Vector3) {
        this.mainRotationVector.add(axis);
        this.rotationAxis.copy(axis);
        this.isCubeRotating = true;
        this.isSliceRotating = false;

        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!this.isCubeRotating) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 10);
        });
    }

    listCubies: Array<THREE.Object3D<THREE.Object3DEventMap>> = [];  
    async rotateSliceUntilOtherSide(slice: Slice, axis: THREE.Vector3) {
        this.listCubies = this.getAllCubeWhoAreBetween(slice);
        this.rotationAxis.copy(axis);
        this.isCubeRotating = false;
        this.isSliceRotating = true;
        
        // Here, I need to swith form slice with world coordinate to local coordinate
        // Solution 1 :
        // - Traquer chaque rotation compléte
        // - A chaque rotation, conserver la rotation actuellement compléte sur l'axe x, et celle sur l'axe y
        const stateSliceAndWise = getStateSlice(this.mainRotationVector, slice, axis)
        console.log('slice', stateSliceAndWise.slice, 'wise', stateSliceAndWise.isClockWise)
        this.state.doMakeRotationByVector(stateSliceAndWise.slice, stateSliceAndWise.isClockWise);

        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!this.isSliceRotating) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 10);
        });
    }

    getAllCubeWhoAreBetween({x,y,z}: Partial<Slice>): Array<THREE.Object3D<THREE.Object3DEventMap>> {
        const result: Array<THREE.Object3D<THREE.Object3DEventMap>> = [];
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
    clock = new THREE.Clock();
    getAnimation(renderer: THREE.Renderer, scene: THREE.Scene, camera: THREE.Camera){
        return () => {
            let rotationPerFrame = 0;
            let delta = 0;
            
            if (this.isCubeRotating || this.isSliceRotating) {    
                if (this.clock.running === false) {
                    this.clock.start();
                }
                
                delta = this.clock.getDelta();
                rotationPerFrame = RubiksCube.rotationAngle * (delta / RubiksCube.rotationTimeSec);

                if (rotationPerFrame > this.targetRotation) {
                    rotationPerFrame = this.targetRotation;
                }

                if (this.isCubeRotating) {
                    this.group.children.forEach((cube) => {
                        cube.position.applyAxisAngle(this.rotationAxis, rotationPerFrame);
                        cube.rotateOnWorldAxis(this.rotationAxis, rotationPerFrame);
                    })
                } else if (this.isSliceRotating) {
                    this.listCubies.forEach((cube) => {
                        cube.position.applyAxisAngle(this.rotationAxis, rotationPerFrame);
                        cube.rotateOnWorldAxis(this.rotationAxis, rotationPerFrame);
                    })
                }

                this.targetRotation -= rotationPerFrame;     
            }

            if (this.targetRotation <= 0) {
                if (this.isSliceRotating) {
                    this.listCubies = [];
                }

                this.isCubeRotating = false;
                this.isSliceRotating = false;
                this.targetRotation = RubiksCube.rotationAngle;
                this.clock.stop();
            }

            renderer.render(scene, camera);
        }
    }

    getRandomMove(forbiddenMovement?: SliceMovement) {
        let pool = allSliceMovement;

        if (forbiddenMovement) {
            pool = allSliceMovement.filter(
                (sliceMovement) => !this.isSameAxisRotation(sliceMovement, forbiddenMovement)
            );
        }

        const randomNumber = Math.floor(Math.random() * pool.length);
        return pool[randomNumber];
    }

    vectorSameAbsValue(vectorA: MovementVector, vectorB: MovementVector) {
        return Math.abs(vectorA.x) === Math.abs(vectorB.x) && 
        Math.abs(vectorA.y) === Math.abs(vectorB.y) &&
        Math.abs(vectorA.z) === Math.abs(vectorB.z);
    }

    rotationVector = new THREE.Vector3();

    isSameAxisRotation(move: SliceMovement, move2: SliceMovement): boolean {
        console.log('this.vectorSameAbsValue(move.vector, move2.vector)', move, move2, this.vectorSameAbsValue(move.vector, move2.vector))
        return this.vectorSameAbsValue(move.vector, move2.vector)
    }

    async shuffleTimes(times: number){
        const allRandomMove: Array<SliceMovement> = [];

        for (let i = 0; i < times; i++) {
            let move = null;

            if (allRandomMove.length === 0) {
                move = this.getRandomMove();
            } else {
                move = this.getRandomMove(allSliceMovement[allSliceMovement.length - 1])
            }

            allRandomMove.push(move);
            this.rotationVector.set(move.vector.x, move.vector.y, move.vector.z);
            await this.rotateSliceUntilOtherSide(move.slice, this.rotationVector);
        }
    }
}
