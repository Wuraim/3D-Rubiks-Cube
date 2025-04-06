import { StateFace } from "../enum/StateFace.enum";
import { StateRotation } from "../enum/StateRotation.enum";
import CubeJS from "cubejs";
import "cubejs/lib/async";

import {
	displayStateFace,
	displayStateOfResolution,
} from "../service/displayState";

interface SolverStateFace {
	stateFace: StateFace;
	start: number;
}

interface StateFaceRotation {
	stateFace: StateFace;
	clockwise: boolean;
	solverRotation: StateRotation;
}

export default class State {
	public cubeSolver = new CubeJS();

	constructor() {
		this.showState();
	}

	private solverStateFace: Array<SolverStateFace> = [
		{ stateFace: StateFace.Up, start: 0 },
		{ stateFace: StateFace.Left, start: 36 },
		{ stateFace: StateFace.Front, start: 18 },
		{ stateFace: StateFace.Right, start: 9 },
		{ stateFace: StateFace.Back, start: 45 },
		{ stateFace: StateFace.Down, start: 27 },
	];

	private showState() {
		const solverState: string = this.cubeSolver.asString();
		this.solverStateFace.forEach((sub) => {
			displayStateFace(
				sub.stateFace,
				solverState.substring(sub.start, sub.start + 9)
			);
		});
		displayStateOfResolution(this.cubeSolver.isSolved());
	}

	private rotation: Array<StateFaceRotation> = [
		{
			stateFace: StateFace.Up,
			clockwise: true,
			solverRotation: StateRotation.U,
		},
		{
			stateFace: StateFace.Down,
			clockwise: true,
			solverRotation: StateRotation.D,
		},
		{
			stateFace: StateFace.Left,
			clockwise: true,
			solverRotation: StateRotation.L,
		},
		{
			stateFace: StateFace.Right,
			clockwise: true,
			solverRotation: StateRotation.R,
		},
		{
			stateFace: StateFace.Front,
			clockwise: true,
			solverRotation: StateRotation.F,
		},
		{
			stateFace: StateFace.Back,
			clockwise: true,
			solverRotation: StateRotation.B,
		},

		{
			stateFace: StateFace.Up,
			clockwise: false,
			solverRotation: StateRotation.Ubis,
		},
		{
			stateFace: StateFace.Down,
			clockwise: false,
			solverRotation: StateRotation.Dbis,
		},
		{
			stateFace: StateFace.Left,
			clockwise: false,
			solverRotation: StateRotation.Lbis,
		},
		{
			stateFace: StateFace.Right,
			clockwise: false,
			solverRotation: StateRotation.Rbis,
		},
		{
			stateFace: StateFace.Front,
			clockwise: false,
			solverRotation: StateRotation.Fbis,
		},
		{
			stateFace: StateFace.Back,
			clockwise: false,
			solverRotation: StateRotation.Bbis,
		},
	];

	public doMakeRotationByVector(stateFace: StateFace, isClockwise: boolean) {
		const rotation = this.rotation.find(
			(rot) =>
				rot.stateFace === stateFace && rot.clockwise === isClockwise
		);

		if (rotation && rotation.solverRotation) {
			this.cubeSolver.move(rotation.solverRotation);
		} else {
			console.warn(
				`Rotation non définie pour face: ${stateFace}, sens horaire: ${isClockwise}`
			);
		}

		this.showState();
	}

	public async solve(): Promise<Array<StateRotation>> {
		const cube = this.cubeSolver;

		return new Promise((resolve, reject) => {
			// Initialise le solver asynchrone (via Web Worker)
			CubeJS.asyncInit("lib/worker.js", () => {
				// Lance la résolution en parallèle
				CubeJS._asyncSolve(cube, (algorithm: string) => {
					console.log("Résolution trouvée :", algorithm);
					const result = algorithm.split(" ") as Array<StateRotation>;
					resolve(result);
				});
			});
		});
	}
}
