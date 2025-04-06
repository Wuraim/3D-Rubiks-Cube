import { Slice } from "./model/slice";

export interface MovementVector {
	x: number;
	y: number;
	z: number;
}

export interface SliceMovement {
	slice: Slice;
	vector: MovementVector;
}

export const allSliceMovement: Array<SliceMovement> = [
	{
		slice: { z: 1 },
		vector: { x: 0, y: 0, z: 1 },
	},
	{
		slice: { z: 1 },
		vector: { x: 0, y: 0, z: -1 },
	},
	{
		slice: { z: -1 },
		vector: { x: 0, y: 0, z: 1 },
	},
	{
		slice: { z: -1 },
		vector: { x: 0, y: 0, z: -1 },
	},
	{
		slice: { y: -1 },
		vector: { x: 0, y: -1, z: 0 },
	},
	{
		slice: { y: 1 },
		vector: { x: 0, y: -1, z: 0 },
	},
	{
		slice: { y: -1 },
		vector: { x: 0, y: 1, z: 0 },
	},
	{
		slice: { y: 1 },
		vector: { x: 0, y: 1, z: 0 },
	},
	{
		slice: { x: 1 },
		vector: { x: 1, y: 0, z: 0 },
	},
	{
		slice: { x: 1 },
		vector: { x: -1, y: 0, z: 0 },
	},
	{
		slice: { x: -1 },
		vector: { x: 1, y: 0, z: 0 },
	},
	{
		slice: { x: -1 },
		vector: { x: -1, y: 0, z: 0 },
	},
];
