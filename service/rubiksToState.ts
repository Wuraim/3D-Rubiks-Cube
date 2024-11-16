import { Slice } from "../model/slice";
import * as THREE from 'three';

export interface StateSliceAndWise {
    slice: Slice;
    isClockWise: boolean;
}

function setIdentityVector(mainRotation: THREE.Vector3): void {
    mainRotation.y %= 4;
    if (Math.abs(mainRotation.y) > 2) {
        mainRotation.y = -(mainRotation.y % 2);
    }

    mainRotation.z %= 4;
    if (Math.abs(mainRotation.z) > 2) {
        mainRotation.z = -(mainRotation.z % 2);
    }
}

function transformSliceBaseOnMainRotation(mainRotation: THREE.Vector3, slice: Slice){
    switch(mainRotation.y) {
        case 2:
            // z -> -z
            slice.z = slice.z ? -slice.z : undefined;
            break;
        case 1:
            // z -> x
            slice.z = slice.x ? slice.x : undefined;
            break;
        case -1:
            // z -> -x
            slice.z = slice.x ? -slice.x : undefined;
            break;
        case -2:
            // z -> -z
            slice.z = slice.z ? -slice.z : undefined;
           break;
    }
    
    switch(mainRotation.z) {
        case 2:
            // y -> -y
            slice.y = slice.y ? -slice.y : undefined;
            break;
        case 1:
            // y -> -x
            slice.y = slice.x ? -slice.x : undefined;
            break;
        case -1:
            // y -> x
            slice.y = slice.x ? slice.x : undefined;
            break;
        case -2:
            // y -> -y
            slice.y = slice.y ? -slice.y : undefined;
            break;
    }
}

function isAxisClockwise(axis: THREE.Vector3): boolean {
    return axis.x === 1 || axis.y === 1 || axis.z === 1;
}

export function getStateSlice(mainRotation: THREE.Vector3, slice: Slice, axis: THREE.Vector3): StateSliceAndWise {
    setIdentityVector(mainRotation);
    transformSliceBaseOnMainRotation(mainRotation, slice);
   
    return {
        slice,
        isClockWise: isAxisClockwise(axis),
    };
}