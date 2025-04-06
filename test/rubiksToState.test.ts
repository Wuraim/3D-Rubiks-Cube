import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
	getStateSlice,
	setIdentityVector,
	transformSliceBaseOnMainRotation,
} from "../service/rubiksToState";
import { Slice } from "../model/slice";

describe("setIdentityVector", () => {
	it("ne devrait pas modifier l'axe X", () => {
		const mainRotation = new THREE.Vector3(1000, 1000, 1000);
		setIdentityVector(mainRotation);
		expect(mainRotation.x).toBe(1000);
	});

	it("ne devrait pas avoir des nombre inférieur à -2 ou supérieur à 2 sur l'axe Y et Z", () => {
		for (let n = -20; n < 20; n++) {
			const mainRotation = new THREE.Vector3(n, n, n);
			setIdentityVector(mainRotation);

			expect(mainRotation.y).toBeGreaterThanOrEqual(-2);
			expect(mainRotation.y).toBeLessThanOrEqual(2);

			expect(mainRotation.z).toBeGreaterThanOrEqual(-2);
			expect(mainRotation.z).toBeLessThanOrEqual(2);
		}
	});
});

describe("transformSliceBaseOnMainRotation", () => {
	it("", () => {
		const mainRotation = new THREE.Vector3(0, 2, 0);
		const slice: Slice = { y: 1 };
		transformSliceBaseOnMainRotation(mainRotation, slice);
		expect(slice.y).toBe(1);
	});

	it("", () => {
		const mainRotation = new THREE.Vector3(0, 0, 1);
		const slice: Slice = { y: 1 };
		transformSliceBaseOnMainRotation(mainRotation, slice);
		expect(slice.y).toBe(undefined);
		expect(slice.x).toBe(-1);
	});

	it("", () => {
		const mainRotation = new THREE.Vector3(0, 0, 2);
		const slice: Slice = { y: 1 };
		transformSliceBaseOnMainRotation(mainRotation, slice);
		expect(slice.y).toBe(-1);
	});
});

describe("getStateSlice", () => {
	it("doit renvoyer un mouvement horaire de la slice x", () => {
		const slice = { x: 1 };
		const mainRotation = new THREE.Vector3(0, 0, 0);
		const axis = new THREE.Vector3(1, 0, 0);

		const stateSlice = getStateSlice(mainRotation, slice, axis);

		expect(stateSlice.isClockWise).toBe(true);
		expect(slice.x).toBe(1);
	});

	it("doit renvoyer un mouvement horaire de la slice -x", () => {
		const slice = { x: 1 };
		const mainRotation = new THREE.Vector3(0, 0, 2);
		const axis = new THREE.Vector3(1, 0, 0);

		const stateSlice = getStateSlice(mainRotation, slice, axis);

		expect(stateSlice.isClockWise).toBe(false);
		expect(slice.x).toBe(-1);
	});

	it("ne doit pas avoir de différence entre tout les 2 et -2 incrémentations de la main rotation", () => {
		[{ x: -1 }, { x: 1 }].forEach((slice) => {
			for (let i = 0; i <= 12; i = i + 2) {
				const mainRotation = new THREE.Vector3(0, 0, i);
				const axis = new THREE.Vector3(1, 0, 0);

				const stateSlice = getStateSlice(mainRotation, slice, axis);

				expect(stateSlice.isClockWise).toBe(slice.x > 0);
				expect(Math.abs(slice.x)).toBe(1);
			}
		});

		[{ y: -1 }, { y: 1 }].forEach((slice) => {
			for (let i = 0; i <= 12; i = i + 2) {
				const mainRotation = new THREE.Vector3(0, 0, i);
				const axis = new THREE.Vector3(1, 0, 0);

				const stateSlice = getStateSlice(mainRotation, slice, axis);

				expect(stateSlice.isClockWise).toBe(slice.y > 0);
				expect(Math.abs(slice.y)).toBe(1);
			}
		});

		[{ z: -1 }, { z: 1 }].forEach((slice) => {
			for (let i = 0; i <= 12; i = i + 2) {
				const mainRotation = new THREE.Vector3(0, i, 0);
				const axis = new THREE.Vector3(1, 0, 0);

				const stateSlice = getStateSlice(mainRotation, slice, axis);

				expect(stateSlice.isClockWise).toBe(slice.z > 0);
				expect(Math.abs(slice.z)).toBe(1);
			}
		});
	});
});
