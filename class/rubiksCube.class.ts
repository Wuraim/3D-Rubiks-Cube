import * as THREE from 'three';
import Cubie from './cubie.class';
import State from './state.class';
import { allSliceMovement, MovementVector, SliceMovement } from '../rotation';
import { Slice } from '../model/slice';
import { getStateSlice, getAxisRotation } from '../service/rubiksToState';
import { StateFace } from '../enum/StateFace.enum';
import { isStateRotationClockwise, isStateRotationDouble, StateRotation, stateRotationWithSlice } from '../enum/StateRotation.enum';

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

    selectedCubies: Array<Cubie> = [];  
    async rotateSliceUntilOtherSide(slice: Slice, axis: THREE.Vector3) {
        this.selectedCubies = this.getAllCubeWhoAreBetween(slice);
        this.rotationAxis.copy(axis);
        this.isCubeRotating = false;
        this.isSliceRotating = true;

        const stateSliceAndWise = getStateSlice(this.selectedCubies, slice, axis)
        this.state.doMakeRotationByVector(stateSliceAndWise.stateFace, stateSliceAndWise.isClockWise);

        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!this.isSliceRotating) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 10);
        });
    }

    getAllCubeWhoAreBetween({x,y,z}: Partial<Slice>): Array<Cubie> {
        const result: Array<Cubie> = [];
        this.allCubies.forEach((cubie) => {
          const position = cubie.mesh?.position as THREE.Vector3;
      
          const isOkX = x !== undefined ? x - 0.1 < position.x && position.x < x + 0.1 : false;
          const isOkY = y !== undefined ? y - 0.1 < position.y && position.y < y + 0.1 : false;
          const isOkZ = z !== undefined ? z - 0.1 < position.z && position.z < z + 0.1 : false;
      
          if (isOkX || isOkY || isOkZ) {
            result.push(cubie);
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
                    this.selectedCubies.forEach((cubie) => {
                        cubie.mesh?.position.applyAxisAngle(this.rotationAxis, rotationPerFrame);
                        cubie.mesh?.rotateOnWorldAxis(this.rotationAxis, rotationPerFrame);
                    })
                }

                this.targetRotation -= rotationPerFrame;     
            }

            if (this.targetRotation <= 0) {
                if (this.isSliceRotating) {
                    this.selectedCubies = [];
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

    getStateFaceFromStateRotation(stateRotation: StateRotation): StateFace {
        return stateRotationWithSlice.find((sub) => sub.stateRotations.includes(stateRotation))!.stateFace;
    }

    getSliceFromCentralCubie(cubie: Cubie): Slice {
        const pos = cubie.mesh!.position;
        const x = Math.round(pos.x) === 0 ? undefined : Math.round(pos.x); 
        const y = Math.round(pos.y) === 0 ? undefined : Math.round(pos.y); 
        const z = Math.round(pos.z) === 0 ? undefined : Math.round(pos.z);

        return {x, y, z};
    }

    getSliceFromStateFace(stateFace: StateFace): Slice {
        const centralCubie: Cubie = this.allCubies.find((cubie) => cubie.core === stateFace)!;
        return this.getSliceFromCentralCubie(centralCubie);
    }

    getSliceFromStateRotation(stateRotation: StateRotation): Slice {
        const stateFace = this.getStateFaceFromStateRotation(stateRotation);
        return this.getSliceFromStateFace(stateFace);
    }

    async resolve(): Promise<void> {
        const result = await this.state.solve();
        // Il faut ensuite faire les mouvements ici
        for (const stateRotation of result) {
            const slice = this.getSliceFromStateRotation(stateRotation);
            const axis = getAxisRotation(slice, isStateRotationClockwise(stateRotation));

            await this.rotateSliceUntilOtherSide(slice, axis);
            if (isStateRotationDouble(stateRotation)) await this.rotateSliceUntilOtherSide(slice, axis);
        }
    }
}
