import { Slice } from "../model/slice";
import * as THREE from 'three';
import { StateFace } from "../enum/StateFace.enum";
import { Position } from "../model/position";
import Cubie from "../class/cubie.class";

export interface StateSliceAndWise {
    stateFace: StateFace;
    isClockWise: boolean;
}

export interface StateFaceCorePosition {
    pos: Position,
    stateFace: StateFace,
}

export const FaceStatePositionList: Array<StateFaceCorePosition> = [
    {
        pos: {x:1, y:0, z:0},
        stateFace: StateFace.Front,
    },
    {
        pos:{x:-1, y:0, z:0},
        stateFace: StateFace.Back,
    },
    {
        pos:{x:0, y:-1, z:0},
        stateFace: StateFace.Left,
    },
    {
        pos: {x:0, y:1, z:0},
        stateFace: StateFace.Right,
    },
    {
        pos:{x:0, y:0, z:-1},
        stateFace: StateFace.Down,
    },
    {
        pos: {x:0, y:0, z:1},
        stateFace: StateFace.Up
    }
];

export function getStateFaceCoreFromPos(x : number, y : number, z: number): StateFace | null {
    return FaceStatePositionList.find((sfcp) => sfcp.pos.x === x && sfcp.pos.y === y && sfcp.pos.z === z)?.stateFace ?? null;
}

export function getStateFaceCoreFromSlice(cubies: Array<Cubie>): StateFace | undefined | null {
    return cubies.find((cubie) => cubie.core !== null)?.core;
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

export function getStateSlice(cubies: Array<Cubie>, slice: Slice, axis: THREE.Vector3): StateSliceAndWise {
    sanitizeSliceOrVector(slice);
    const axisClone: THREE.Vector3 = sanitizeSliceOrVector({...axis}) as THREE.Vector3;
    const isClockWise = isRotationClockwise(slice, axisClone);
    const stateFace = getStateFaceCoreFromSlice(cubies)!;

    return { stateFace, isClockWise };
}