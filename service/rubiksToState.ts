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

export function transformSliceBaseOnMainRotation(mainRotation: THREE.Vector3, slice: Slice) {
    // Correct the mainRotation inversion and normalize
    const correctedRotationY = (-mainRotation.y % 4 + 4) % 4; // Normalize to [0, 3]
    const correctedRotationZ = (-mainRotation.z % 4 + 4) % 4; // Normalize to [0, 3]

    let { x, y, z } = slice; // Destructure slice for easier manipulation

    // Apply transformations based on the combined rotations
    for (let i = 0; i < correctedRotationY; i++) {
        // Rotate around Y-axis
        if (x !== undefined) {
            [x, z] = [z, -x]; // x -> z, z -> -x
        } else if (z !== undefined) {
            [x, z] = [-z, x]; // z -> -x, x -> z
        }
    }

    for (let i = 0; i < correctedRotationZ; i++) {
        // Rotate around Z-axis
        if (y !== undefined) {
            [x, y] = [-y, x]; // y -> -x, x -> y
        } else if (x !== undefined) {
            [x, y] = [y, -x]; // x -> y, y -> -x
        }
    }

    // Update slice with the new values
    slice.x = x;
    slice.y = y;
    slice.z = z;
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
    const isOppositeRotation: boolean = someDimensionEqual(slice, 1);
    return isOppositeRotation ? someDimensionEqual(axis, -1) : someDimensionEqual(axis, 1);
}

function sanitizeSliceOrVector(obj: Slice | THREE.Vector3): Slice | THREE.Vector3 {
    obj.x = obj.x ? Math.round(obj.x) : undefined;
    obj.y = obj.y ? Math.round(obj.y) : undefined;
    obj.z = obj.z ? Math.round(obj.z) : undefined;

    return obj;
}

export function getStateSlice(mainRotation: THREE.Vector3, slice: Slice, axis: THREE.Vector3): StateSliceAndWise {
    sanitizeSliceOrVector(slice);
    const axisClone: THREE.Vector3 = sanitizeSliceOrVector({...axis}) as THREE.Vector3;

    const isClockWise = isRotationClockwise(slice, axisClone);
    
    setIdentityVector(mainRotation);

    console.log("mainRotation", mainRotation)

    transformSliceBaseOnMainRotation(mainRotation, slice);
    const stateFace = getStateFace(slice)!;

    return {
        stateFace,
        isClockWise,
    };
}