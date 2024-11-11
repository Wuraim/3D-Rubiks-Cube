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

export function getStateSlice(mainRotation: THREE.Vector3, slice: Slice, axis: THREE.Vector3): StateSliceAndWise {

    setIdentityVector(mainRotation);

    // Ensuite
    // Pour slice z -> 1
    // Si mainRotation, OK, si mainRotation = 1 -> , si mainRotation = 2

    return {
        slice: {},
        isClockWise: true,
    };
}