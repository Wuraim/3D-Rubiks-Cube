import { Slice } from "../model/slice";
import * as THREE from 'three';
import { isApproximatively } from "./helper";

export interface StateSliceAndWise {
    slice: Slice;
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
    // debugger;
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
                // z -> -x
                slice.z = -slice.x;
                slice.x = undefined;
            } else if (slice.z) {
                // x -> z
                slice.x = slice.z;
                slice.z = undefined;
            }
            break;
        case -1:
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
                // y -> x
                slice.y = slice.x;
                slice.x = undefined;
            } else if (slice.y) {
                // x -> -y
                slice.x = slice.y;
                slice.y = undefined;
            }
            break;
        case -1:
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

function isAxisClockwise(axis: THREE.Vector3) : boolean {
    return isApproximatively(axis.x, -1) || isApproximatively(axis.y, -1) || isApproximatively(axis.z, -1);
}

function sanitizeSlice(slice: Slice): void {
    slice.x = slice.x ? Math.round(slice.x) : undefined;
    slice.y = slice.y ? Math.round(slice.y) : undefined;
    slice.z = slice.z ? Math.round(slice.z) : undefined;
}

export function getStateSlice(mainRotation: THREE.Vector3, slice: Slice, axis: THREE.Vector3): StateSliceAndWise {
    setIdentityVector(mainRotation);
    transformSliceBaseOnMainRotation(mainRotation, slice);
    sanitizeSlice(slice);

    return {
        slice,
        isClockWise: isAxisClockwise(axis),
    };
}