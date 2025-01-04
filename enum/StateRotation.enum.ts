import { StateFace } from "../enum/StateFace.enum";

export enum StateRotation {
    U = "U",
    U2 = "U2",
    Ubis = "U'",
    F = "F",
    F2 = "F2",
    Fbis = "F'",
    L = "L",
    L2 = "L2",
    Lbis = "L'",
    D = "D",
    D2 = "D2",
    Dbis = "D'",
    B = "B",
    B2 = "B2",
    Bbis = "B'",
    R = "R",
    R2 = "R2",
    Rbis = "R'"
}

export function isStateRotationClockwise(stateRotation: StateRotation): boolean {
    return !stateRotation.includes("'");
}

export function isStateRotationDouble(stateRotation: StateRotation): boolean {
    return stateRotation.includes("2");
}

interface StateRotationAndFace {
    stateFace: StateFace;
    stateRotations: Array<StateRotation>;
}

export const stateRotationWithSlice: Array<StateRotationAndFace> = [
    {
        stateFace: StateFace.Up,
        stateRotations: [StateRotation.U, StateRotation.U2, StateRotation.Ubis]
    },
    {
        stateFace: StateFace.Down,
        stateRotations: [StateRotation.D, StateRotation.D2, StateRotation.Dbis]
    },
    {
        stateFace: StateFace.Front,
        stateRotations: [StateRotation.F, StateRotation.F2, StateRotation.Fbis]
    },
    {
        stateFace: StateFace.Back,
        stateRotations: [StateRotation.B, StateRotation.B2, StateRotation.Bbis]
    },
    {
        stateFace: StateFace.Left,
        stateRotations: [StateRotation.L, StateRotation.L2, StateRotation.Lbis]
    },
    {
        stateFace: StateFace.Right,
        stateRotations: [StateRotation.R, StateRotation.R2, StateRotation.Rbis]
    }
];
