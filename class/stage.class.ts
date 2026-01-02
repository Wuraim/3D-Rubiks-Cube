import {
	Scene,
	WebGLRenderer,
	PerspectiveCamera,
	DirectionalLight,
	Raycaster,
	Intersection,
	Object3D,
	Object3DEventMap,
	Vector2,
	Vector3,
	MOUSE,
	Mesh,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RubiksCube from "./rubiksCube.class";
import { PointedPlanCubieType } from "../model/planCubie";
import { AxisType } from "../model/axis";
import { Rotation } from "../model/rotation";

export default class Stage {
	private scene: Scene;
	private renderer: WebGLRenderer;
	private camera: PerspectiveCamera;
	private rubiks: RubiksCube;
	private light: DirectionalLight;
	private controls: OrbitControls;
	private raycaster: Raycaster;
	private allPointedPlanCubie: Array<PointedPlanCubieType>;
	private rotationVector: Vector3;
	private working: boolean;

	private onLoadStart: () => void;
	private onLoadEnd: () => void;

	private setupRenderer(
		frame: Element,
		renderer: WebGLRenderer,
		scene: Scene,
		camera: PerspectiveCamera,
		rubiks: RubiksCube
	): void {
		renderer.setSize(frame.clientWidth, frame.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		const animation = rubiks.getAnimation(renderer, scene, camera);
		renderer.setAnimationLoop(animation);
	}

	private getRenderer(
		frame: Element,
		scene: Scene,
		camera: PerspectiveCamera,
		rubiks: RubiksCube
	): WebGLRenderer {
		const result = new WebGLRenderer({ antialias: true });
		this.setupRenderer(frame, result, scene, camera, rubiks);
		return result;
	}

	private getPerpective(frame: Element): number {
		return frame.clientWidth > frame.clientHeight
			? frame.clientWidth / frame.clientHeight
			: 1;
	}

	private getCamera(frame: Element): PerspectiveCamera {
		const perspective = this.getPerpective(frame);
		const result = new PerspectiveCamera(50, perspective, 0.1, 1000);
		result.position.set(6, 3, -4);
		return result;
	}

	private setupController(controls: OrbitControls): void {
		controls.target = this.rubiks.group.position;
		controls.rotateSpeed /= 3;
		controls.enableZoom = false;
		controls.enablePan = false;
		controls.enableRotate = true;
		controls.enabled = true;

		controls.mouseButtons = {
			LEFT: MOUSE.ROTATE,
			MIDDLE: null,
			RIGHT: null,
		};

		controls.enabled = true;
	}

	private getController(
		camera: PerspectiveCamera,
		renderer: WebGLRenderer
	): OrbitControls {
		const result = new OrbitControls(camera, renderer.domElement);
		this.setupController(result);
		return result;
	}

	private getLight(): DirectionalLight {
		const result = new DirectionalLight(0xffffff, 2);
		result.position.set(20, 20, 20);
		return result;
	}

	constructor(
		frame: Element,
		onLoadStart: () => void,
		onLoadEnd: () => void
	) {
		this.working = false;
		this.scene = new Scene();
		this.camera = this.getCamera(frame);
		this.rubiks = new RubiksCube();
		this.light = this.getLight();
		this.renderer = this.getRenderer(
			frame,
			this.scene,
			this.camera,
			this.rubiks
		);
		this.controls = this.getController(this.camera, this.renderer);
		this.raycaster = new Raycaster();
		this.allPointedPlanCubie = [];

		this.scene.add(this.rubiks.group);
		this.scene.add(this.light);
		this.controls.update();

		this.rotationVector = new Vector3();

		this.onLoadStart = onLoadStart;
		this.onLoadEnd = onLoadEnd;

		frame.appendChild(this.renderer.domElement);
		this.renderer.domElement.classList = "lg:rounded-lg";
	}

	public resizeRenderer(frame: Element): void {
		this.camera.aspect = this.getPerpective(frame);
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(frame.clientWidth, frame.clientHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
	}

	private getPointedPlan(
		inter: Intersection<Object3D<Object3DEventMap>>
	): AxisType | null {
		let result: AxisType | null = null;

		// TODO: Calculer le border coord en fonction de la taille des cubies
		const borderCoord = 1.5;
		const allAxis: Array<AxisType> = ["x", "y", "z"];

		const point = inter.point;

		for (const axis of allAxis) {
			if (Math.round(Math.abs(point[axis]) * 10) / 10 === borderCoord) {
				result = axis;
				break;
			}
		}

		return result;
	}

	private getPointedPlanCubie(pointer: Vector2): PointedPlanCubieType | null {
		let result = null;

		this.raycaster.setFromCamera(pointer, this.camera);
		const allCubeMesh: Object3D[] = this.rubiks.allCubies.map(
			(cubie) => cubie.mesh!
		);

		const intersects = this.raycaster.intersectObjects(allCubeMesh);
		if (intersects[0]) {
			const plan = this.getPointedPlan(intersects[0]);

			if (plan) {
				result = {
					cubie: intersects[0].object,
					plan: this.getPointedPlan(intersects[0])!,
				};
			} else {
				console.error(
					"Intersected an object without finding the meeting point"
				);
			}
		}

		return result;
	}

	private getAllowedAxisFromForbidden(forbidden: AxisType): Array<AxisType> {
		const result: Array<AxisType> = ["x", "y", "z"];

		const index = result.indexOf(forbidden);
		result.splice(index, 1);

		return result;
	}

	private areInlineOnAxis(axis: AxisType): boolean {
		let result = true;

		const allowedAxis = this.getAllowedAxisFromForbidden(axis);
		const axisA = allowedAxis[0];
		const axisB = allowedAxis[1];

		if (this.allPointedPlanCubie.length === 2) {
			const checkAxisA =
				Math.round(
					this.allPointedPlanCubie[0].cubie.position[axisA]
				) ===
				Math.round(this.allPointedPlanCubie[1].cubie.position[axisA]);

			const checkAxisB =
				Math.round(
					this.allPointedPlanCubie[0].cubie.position[axisB]
				) ===
				Math.round(this.allPointedPlanCubie[1].cubie.position[axisB]);

			const checkPlan =
				this.allPointedPlanCubie[0].plan ===
				this.allPointedPlanCubie[1].plan;

			const checkMainAxis =
				Math.round(
					Math.abs(this.allPointedPlanCubie[0].cubie.position[axis]) +
						Math.abs(
							this.allPointedPlanCubie[1].cubie.position[axis]
						)
				) === 1;

			result = checkAxisA && checkAxisB && checkPlan && checkMainAxis;
		} else if (this.allPointedPlanCubie.length === 3) {
			const checkAxisA =
				Math.round(
					this.allPointedPlanCubie[0].cubie.position[axisA]
				) ===
					Math.round(
						this.allPointedPlanCubie[1].cubie.position[axisA]
					) &&
				Math.round(
					this.allPointedPlanCubie[1].cubie.position[axisA]
				) ===
					Math.round(
						this.allPointedPlanCubie[2].cubie.position[axisA]
					);

			const checkAxisB =
				Math.round(
					this.allPointedPlanCubie[0].cubie.position[axisB]
				) ===
					Math.round(
						this.allPointedPlanCubie[1].cubie.position[axisB]
					) &&
				Math.round(
					this.allPointedPlanCubie[1].cubie.position[axisB]
				) ===
					Math.round(
						this.allPointedPlanCubie[2].cubie.position[axisB]
					);

			const checkPlan =
				this.allPointedPlanCubie[0].plan ===
					this.allPointedPlanCubie[1].plan &&
				this.allPointedPlanCubie[1].plan ===
					this.allPointedPlanCubie[2].plan;

			const checkMainAxis =
				Math.round(
					Math.abs(this.allPointedPlanCubie[0].cubie.position[axis]) +
						Math.abs(
							this.allPointedPlanCubie[1].cubie.position[axis]
						)
				) === 1 &&
				Math.round(
					Math.abs(this.allPointedPlanCubie[1].cubie.position[axis]) +
						Math.abs(
							this.allPointedPlanCubie[2].cubie.position[axis]
						)
				) === 1 &&
				Math.round(
					this.allPointedPlanCubie[0].cubie.position[axis] +
						this.allPointedPlanCubie[2].cubie.position[axis]
				) === 0;

			result = checkAxisA && checkAxisB && checkPlan && checkMainAxis;
		}

		return result;
	}

	private getWantedRotation(inlineAxis: AxisType): Rotation {
		const planClick = this.allPointedPlanCubie[0].plan;

		const allowedAxis = this.getAllowedAxisFromForbidden(inlineAxis);
		const sliceAxis: AxisType = allowedAxis.find(
			(axe) => axe !== planClick
		)!;

		const slice: Rotation["slice"] = {};
		slice[sliceAxis] =
			this.allPointedPlanCubie[0].cubie.position[sliceAxis];

		const vector: Rotation["vector"] = { x: 0, y: 0, z: 0 };

		const plan = new Vector3(0, 0, 0);
		plan[planClick] = Math.round(
			this.allPointedPlanCubie[0].cubie.position[planClick]
		);

		const projected = new Vector3(0, 0, 0);
		projected[inlineAxis] = Math.round(
			this.allPointedPlanCubie[2].cubie.position[inlineAxis]
		);

		const product = new Vector3();
		product.crossVectors(plan, projected);

		vector[sliceAxis] = product[sliceAxis];

		return {
			slice,
			vector,
		};
	}

	private areInline(): boolean {
		return (
			this.areInlineOnAxis("x") ||
			this.areInlineOnAxis("y") ||
			this.areInlineOnAxis("z")
		);
	}

	private getInlineAxis(): AxisType | null {
		let result: AxisType | null = null;
		const allAxis: Array<AxisType> = ["x", "y", "z"];

		for (let axis of allAxis) {
			if (this.areInlineOnAxis(axis)) {
				result = axis;
				break;
			}
		}

		return result;
	}

	private isRowCentral(): boolean {
		return this.allPointedPlanCubie.some(
			(planCubie) =>
				Math.round(
					Math.abs(planCubie.cubie.position.x) +
						Math.abs(planCubie.cubie.position.y) +
						Math.abs(planCubie.cubie.position.z)
				) === 1
		);
	}

	private isPlanShared(): boolean {
		let result = true;

		if (this.allPointedPlanCubie.length >= 2) {
			const planToCheck = this.allPointedPlanCubie[0].plan;
			for (let i = 1; i < this.allPointedPlanCubie.length; i++) {
				if (this.allPointedPlanCubie[i].plan !== planToCheck) {
					result = false;
					break;
				}
			}
		}

		return result;
	}

	private async addPointedCube(
		planCubie: PointedPlanCubieType
	): Promise<void> {
		const allPointedCubie = this.allPointedPlanCubie.map(
			(sub) => sub.cubie
		);

		if (!allPointedCubie.includes(planCubie.cubie)) {
			this.allPointedPlanCubie.push(planCubie);

			if (this.allPointedPlanCubie.length > 1) {
				const inlined = this.areInline();
				const isPlanOk = this.isPlanShared();

				if (inlined && isPlanOk) {
					if (this.allPointedPlanCubie.length === 3) {
						const inlineAxis = this.getInlineAxis()!;

						const move = this.getWantedRotation(inlineAxis);
						if (move) {
							this.rotationVector.set(
								move.vector.x,
								move.vector.y,
								move.vector.z
							);
							await this.rubiks.rotateSliceUntilOtherSide(
								move.slice,
								this.rotationVector
							);
						}
					}
				} else {
					this.allPointedPlanCubie.splice(
						0,
						this.allPointedPlanCubie.length - 1
					);
				}
			}

			if (this.allPointedPlanCubie.length >= 3) {
				this.allPointedPlanCubie = [];
			}
		}
	}

	private startLoading(): void {
		this.working = true;
		this.onLoadStart();
	}

	private endLoading(): void {
		this.onLoadEnd();
		this.working = false;
	}

	private async work<T>(fn: () => T): Promise<T | null> {
		let result = null;

		if (this.working === false) {
			this.startLoading();
			result = await fn();
			this.endLoading();
		}

		return result;
	}

	public enableControl(): void {
		if (this.controls.enabled === false) {
			this.controls.enabled = true;
		}
	}

	private async handlePointed(pointer: Vector2): Promise<void> {
		if (this.controls.enabled === false) {
			const pointedCubie = this.getPointedPlanCubie(pointer);
			if (pointedCubie) {
				this.addPointedCube(pointedCubie);
			}
		}
	}

	public async select(pointer: Vector2): Promise<void> {
		await this.work(() => this.handlePointed(pointer));
	}

	public check(pointer: Vector2): void {
		const pointedCubie = this.getPointedPlanCubie(pointer);
		if (pointedCubie !== null) {
			this.controls.enabled = false;
		}
	}

	public async shuffle(): Promise<void> {
		await this.work(() => this.rubiks.shuffleTimes(30));
	}

	public async resolve(): Promise<void> {
		await this.work(() => this.rubiks.resolve());
	}

	public end(): void {
		this.renderer.setAnimationLoop(null);

		this.scene.traverse((object) => {
			if ((object as Mesh).isMesh) {
				const mesh = object as Mesh;
				mesh.geometry.dispose();
			}
		});

		while (this.scene.children.length > 0) {
			this.scene.remove(this.scene.children[0]);
		}

		this.renderer.dispose();

		if (this.renderer.domElement && this.renderer.domElement.parentNode) {
			this.renderer.domElement.parentNode.removeChild(
				this.renderer.domElement
			);
		}
	}
}
