import { AxisType } from "./axis";
import { Object3D, Object3DEventMap } from "three";

export interface PointedPlanCubieType {
	cubie: Object3D<Object3DEventMap>;
	plan: AxisType;
}
