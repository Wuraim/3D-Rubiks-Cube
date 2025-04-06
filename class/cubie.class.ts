import { Mesh, MeshBasicMaterial, BoxGeometry, CanvasTexture } from "three";
import { StateFace } from "../enum/StateFace.enum";
import { getStateFaceCoreFromPos } from "../service/rubiksToState";

function createBorderedTexture(color: string) {
	const size = 256; // Taille de la texture
	const borderSize = 16; // Taille de la bordure

	// Créer un élément canvas
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;

	const context = canvas.getContext("2d")!;

	// Remplir le fond avec la couleur noire (pour la bordure)
	context.fillStyle = "#000000"; // Noir pour la bordure
	context.fillRect(0, 0, size, size);

	// Remplir le centre avec la couleur désirée
	context.fillStyle = color;
	context.fillRect(
		borderSize,
		borderSize,
		size - borderSize * 2,
		size - borderSize * 2
	);

	// Utiliser le canvas comme texture
	const texture = new CanvasTexture(canvas);
	return texture;
}

export default class Cubie {
	private static cubeSize: number = 1;
	public mesh: Mesh | null = null;
	public core: StateFace | null = null;

	private allColor = [
		"#ff0000", // Rouge
		"#ff8c00", // Orange
		"#39ff14", // Vert
		"#0000cd", // Bleu
		"#ffffff", // Blanc
		"#ffff00", // Jaune
	];

	private allColorCouple = [
		{
			color: this.allColor[0],
			pos: { x: 1 },
		},
		{
			color: this.allColor[1],
			pos: { x: -1 },
		},
		{
			color: this.allColor[2],
			pos: { y: 1 },
		},
		{
			color: this.allColor[3],
			pos: { y: -1 },
		},
		{
			color: this.allColor[4],
			pos: { z: 1 },
		},
		{
			color: this.allColor[5],
			pos: { z: -1 },
		},
	];

	private getMaterials(x: number, y: number, z: number) {
		return this.allColorCouple.map((couple) => {
			let color = "#000000";
			const isConcerned =
				couple.pos.x === x || couple.pos.y === y || couple.pos.z === z;
			if (isConcerned) {
				color = couple.color;
			}
			return new MeshBasicMaterial({
				map: createBorderedTexture(color),
			});
		});
	}

	constructor(x: number, y: number, z: number) {
		const geometry = new BoxGeometry(
			Cubie.cubeSize,
			Cubie.cubeSize,
			Cubie.cubeSize,
			8,
			8,
			8
		);

		const materials = this.getMaterials(x, y, z);

		this.mesh = new Mesh(geometry, materials);
		this.mesh.position.set(x, y, z);
		this.core = getStateFaceCoreFromPos(x, y, z);
	}
}
