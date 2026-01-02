import * as THREE from "three";
import "./service/displayState.js";
import Stage from "./class/stage.class.js";

let pointer = new THREE.Vector2(999, 999);
const frameContainer = document.querySelector(
	"#rendererContainer"
) as HTMLElement | null;
let frame = document.querySelector("#rendererFrame")!;
const frameSize = document.querySelector("#frameSize");
let stage = new Stage(frame, displayLoader, displayReset);

function updateFrameSize(): void {
	if (frameContainer) {
		const width = frameContainer.clientWidth;
		frameContainer.style.height = `${width}px`; // force square on browsers lacking aspect-ratio support
	}

	const rect = frame.getBoundingClientRect();
	if (frameSize) {
		frameSize.textContent = `${Math.round(rect.width)} x ${Math.round(
			rect.height
		)}`;
	}
}

const onKeyDown = async (event: KeyboardEvent) => {
	if (event.key === "Enter") {
		await onClickShuffle();
	}
};

function normalizePointer(clientX: number, clientY: number, canvas: Element) {
	const rect = canvas.getBoundingClientRect();
	pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
	pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
}

async function onSelection(clientX: number, clientY: number): Promise<void> {
	normalizePointer(clientX, clientY, frame);
	await stage.select(pointer);
}

async function onPointerMove(event: MouseEvent) {
	onSelection(event.clientX, event.clientY);
}

function conditionnalControlDisabling(clientX: number, clientY: number): void {
	normalizePointer(clientX, clientY, frame);
	stage.check(pointer);
}

function onMouseDown(event: MouseEvent) {
	if (event.button === 0) {
		conditionnalControlDisabling(event.clientX, event.clientY);
	}
}

function onMouseUp(event: MouseEvent) {
	if (event.button === 0) {
		stage.enableControl();
		stage.onReleaseControl();
	}
}

function onTouchStart(event: TouchEvent): void {
	const touche = event.touches[0];
	conditionnalControlDisabling(touche.clientX, touche.clientY);
}

async function onTouched(event: TouchEvent): Promise<void> {
	const firstTouche = event.touches[0];
	await onSelection(firstTouche.clientX, firstTouche.clientY);
}

window.addEventListener("touchstart", onTouchStart);

window.addEventListener("touchmove", onTouched);

function onTouchEnd() {
	stage.enableControl();
	stage.onReleaseControl();
}

window.addEventListener("touchend", onTouchEnd);

const shuffleButton = document.querySelector("#shuffle")!;
const restartButton = document.querySelector("#restart")!;
const resolvedButton = document.querySelector("#resolved")!;

async function onClickShuffle(): Promise<void> {
	await stage.shuffle();
}

async function onClickRestart(): Promise<void> {
	stage.end();
	stage = new Stage(frame, displayLoader, displayReset);
}

async function onClickResolved(): Promise<void> {
	await stage.resolve();
}

window.addEventListener("keydown", (event) => onKeyDown(event));

window.addEventListener("load", () => {
	updateFrameSize();
	stage.resizeRenderer(frame);
});

window.addEventListener("resize", () => {
	updateFrameSize();
	stage.resizeRenderer(frame);
});

window.addEventListener("mousedown", onMouseDown);

window.addEventListener("mouseup", onMouseUp);

window.addEventListener("mousemove", onPointerMove);

shuffleButton.addEventListener("click", onClickShuffle);

restartButton.addEventListener("click", onClickRestart);

resolvedButton.addEventListener("click", onClickResolved);

function displayLoader(): void {
	const loader = document.querySelector("#loader");
	const word = document.querySelector("#resetWord");

	if (loader && word) {
		word.className = word.className.replace("block", "hidden");
		loader.className = loader.className.replace("hidden", "block");
	}
}

function displayReset(): void {
	const loader = document.querySelector("#loader");
	const word = document.querySelector("#resetWord");

	if (loader && word) {
		loader.className = loader.className.replace("block", "hidden");
		word.className = word.className.replace("hidden", "block");
	}
}
