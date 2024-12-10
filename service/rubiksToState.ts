import { Slice } from "../model/slice";
import * as THREE from 'three';
import { isApproximatively } from "./helper";
import { StateFace } from "../enum/StateFace.enum";
import State from "../class/state.class";

export interface StateSliceAndWise {
    stateFace: StateFace;
    isClockWise: boolean;
}

export function setIdentityVector(mainRotation: THREE.Vector3): void {
    mainRotation.y %= 4;
    if (Math.abs(mainRotation.y) > 2) {
        mainRotation.y = -(mainRotation.y % 2);
    }

    mainRotation.z %= 4;
    if (Math.abs(mainRotation.z) > 2) {
        mainRotation.z = -(mainRotation.z % 2);
    }
}

export function transformSliceBaseOnMainRotation(mainRotation: THREE.Vector3, slice: Slice){
    debugger;
    switch(mainRotation.y) {
        case 2:
            if (slice.x) { 
                // x -> -x
                slice.x = -slice.x;
            } else if (slice.z) { 
                // z -> -z
                slice.z = -slice.z; 
            }
            break;
        case 1:
            if (slice.x) {
                // z -> x
                slice.z = slice.x;
                slice.x = undefined;
            } else if (slice.z) {
                // x -> -z
                slice.x = -slice.z;
                slice.z = undefined;
            }
            break;
        case -1:
            if (slice.x) {
                // z -> -x
                slice.z = -slice.x;
                slice.x = undefined;
            } else if (slice.z) {
                // x -> z
                slice.x = slice.z;
                slice.z = undefined;
            }
            break;
        case -2:
            if (slice.x) { 
                // x -> -x
                slice.x = -slice.x;
            } else if (slice.z) { 
                // z -> -z
                slice.z = -slice.z; 
            }
           break;
    }
    
    switch(mainRotation.z) {
        case 2:
            if (slice.x) {
                // x -> -x
                slice.x = -slice.x;
            } else if (slice.y) {
                // y -> -y
                slice.y = -slice.y;
            }
            break;
        case 1:
            if (slice.x) {
                // y -> -x
                slice.y = - slice.x;
                slice.x = undefined;
            } else if (slice.y) {
                // x -> y
                slice.x = -slice.y;
                slice.y = undefined;
            }
            break;
        case -1:
            if (slice.x) {
                // y -> x
                slice.y = slice.x;
                slice.x = undefined;
            } else if (slice.y) {
                // x -> -y
                slice.x = slice.y;
                slice.y = undefined;
            }
            break;
        case -2:
            if (slice.x) {
                // x -> -x
                slice.x = -slice.x;
            } else if (slice.y) {
                // y -> -y
                slice.y = -slice.y;
            }
            break;
    }
}

export function getStateFace(slice: Slice): StateFace | null {
    let stateFace = null;

    if (slice.x === 1) {
        stateFace = StateFace.Front;
    } else if (slice.x === -1) {
        stateFace = StateFace.Back;
    } else if (slice.y === 1) {
        stateFace = StateFace.Right;
    } else if (slice.y === -1) {
        stateFace = StateFace.Left;
    } else if (slice.z === 1) {
        stateFace = StateFace.Up;
    } else if (slice.z === -1) {
        stateFace = StateFace.Down;
    }

    return stateFace;
}

function someDimensionEqual(obj: Slice | THREE.Vector3, val: number): boolean {
    return obj.x === val || obj.y === val || obj.z === val;
}

function isRotationClockwise(slice: Slice, axis: THREE.Vector3) : boolean {
    const isOppositeRotation: boolean = someDimensionEqual(slice, -1);
    return isOppositeRotation ? someDimensionEqual(axis, -1) : someDimensionEqual(axis, 1);
}

function sanitizeSlice(slice: Slice): void {
    slice.x = slice.x ? Math.round(slice.x) : undefined;
    slice.y = slice.y ? Math.round(slice.y) : undefined;
    slice.z = slice.z ? Math.round(slice.z) : undefined;
}

export function getStateSlice(mainRotation: THREE.Vector3, slice: Slice, axis: THREE.Vector3): StateSliceAndWise {
    sanitizeSlice(slice);
    const isClockWise = isRotationClockwise(slice, axis);
    
    setIdentityVector(mainRotation);

    transformSliceBaseOnMainRotation(mainRotation, slice);
    const stateFace = getStateFace(slice)!;

    return {
        stateFace,
        isClockWise,
    };
}