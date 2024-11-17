import { s } from "vite/dist/node/types.d-aGj9QkWt";
import State from "../class/state.class";
import { describe, it, expect } from "vitest";

function cloneState(state: State): State {
    return JSON.parse(JSON.stringify(state));
}

const state = new State();

describe('test des rotations state', () => {
    it('Une rotation anti-horaire Z devrait amener les cubes de la face gauche sur la face de front', () => {
        let oldState = cloneState(state);
        state.doMakeRotationByVector({ z: 1 }, false);
        expect(state.Front[0]).toEqual(oldState.Left[0]);
        expect(state.Front[1]).toEqual(oldState.Front[1]);
        expect(state.Front[2]).toEqual(oldState.Front[2]);

        oldState = cloneState(state);
        state.doMakeRotationByVector({ z: -1 }, false);
        expect(state.Front[0]).toEqual(oldState.Front[0]);
        expect(state.Front[1]).toEqual(oldState.Front[1]);
        expect(state.Front[2]).toEqual(oldState.Left[2]);
    });

    it('Une rotation horaire Z devrait amener les cubes de la face front sur la face gauche', () => {
        let oldState = cloneState(state);
        state.doMakeRotationByVector({ z: 1 }, true);
        expect(state.Front[0]).toEqual(oldState.Right[0]);
        expect(state.Front[1]).toEqual(oldState.Front[1]);
        expect(state.Front[2]).toEqual(oldState.Front[2]);

        oldState = cloneState(state);
        state.doMakeRotationByVector({ z: -1 }, true);
        expect(state.Front[0]).toEqual(oldState.Front[0]);
        expect(state.Front[1]).toEqual(oldState.Front[1]);
        expect(state.Front[2]).toEqual(oldState.Right[2]);
    });

    it('Une rotation anti-horaire X devrait amener les cubes de la face supérieure sur la face gauche', () => {
        let oldState = cloneState(state);
        state.doMakeRotationByVector({ x: 1 }, false);
        expect(state.Left[0][2]).toEqual(oldState.Up[2][2]);
        expect(state.Left[1][2]).toEqual(oldState.Up[2][1]);
        expect(state.Left[2][2]).toEqual(oldState.Up[2][0]);

        oldState = cloneState(state);
        state.doMakeRotationByVector({ x: -1 }, false);
        expect(state.Right[0][2]).toEqual(oldState.Up[0][2]);
        expect(state.Right[1][2]).toEqual(oldState.Up[0][1]);
        expect(state.Right[2][2]).toEqual(oldState.Up[0][0]);
    });

    it('Une rotation horaire X devrait amener les cubes de la face supérieure sur la face droite', () => {
        let oldState = cloneState(state);
        state.doMakeRotationByVector({ x: 1 }, true);
        expect(state.Right[0][0]).toEqual(oldState.Up[2][2]);
        expect(state.Right[1][0]).toEqual(oldState.Up[2][1]);
        expect(state.Right[2][0]).toEqual(oldState.Up[2][0]);

        oldState = cloneState(state);
        state.doMakeRotationByVector({ x: -1 }, true);
        expect(state.Left[0][2]).toEqual(oldState.Up[0][2]);
        expect(state.Left[1][2]).toEqual(oldState.Up[0][1]);
        expect(state.Left[2][2]).toEqual(oldState.Up[0][0]);
    });

    it('Une rotation anti-horaire Y devrait amener les cubes de la face supérieure sur la face arriere', () => {
        let oldState = cloneState(state);
        state.doMakeRotationByVector({ y: 1 }, false);
        expect(state.Front[0][2]).toEqual(oldState.Up[0][2]);
        expect(state.Front[1][2]).toEqual(oldState.Up[1][2]);
        expect(state.Front[2][2]).toEqual(oldState.Up[2][2]);

        oldState = cloneState(state);
        state.doMakeRotationByVector({ y: -1 }, false);
        expect(state.Back[0][2]).toEqual(oldState.Up[2][0]);
        expect(state.Back[1][2]).toEqual(oldState.Up[1][0]);
        expect(state.Back[2][2]).toEqual(oldState.Up[0][0]);
    });

    it('Une rotation horaire Y devrait amener les cubes de la face supérieure sur la face avant', () => {
        let oldState = cloneState(state);
        state.doMakeRotationByVector({ y: 1 }, true);
        expect(state.Back[0][0]).toEqual(oldState.Up[0][2]);
        expect(state.Back[1][0]).toEqual(oldState.Up[1][2]);
        expect(state.Back[2][0]).toEqual(oldState.Up[2][2]);

        oldState = cloneState(state);
        state.doMakeRotationByVector({ y: -1 }, true);
        expect(state.Front[0][2]).toEqual(oldState.Up[2][0]);
        expect(state.Front[1][2]).toEqual(oldState.Up[1][0]);
        expect(state.Front[2][2]).toEqual(oldState.Up[0][0]);
    });
});
