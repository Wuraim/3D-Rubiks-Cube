import { StateFace } from "../enum/StateFace.enum";

const up = document.querySelector('#up')!;
const left = document.querySelector('#left')!;
const front = document.querySelector('#front')!;
const right = document.querySelector('#right')!;
const back = document.querySelector('#back')!;
const down = document.querySelector('#down')!;

const resolutionStateDisplay = document.querySelector('#isResolved')!;
const movingStateDisplay = document.querySelector('#isMoving')!;

function clearFaceDisplay(elem:Element): void {
    elem.replaceChildren();
}

interface ColoredDisplay {
    letter: string;
    tailwindClass: string;
}

function getColoredCubie(cubie: string): ColoredDisplay {
    switch (cubie) {
        case 'U': return { letter: 'W', tailwindClass: 'text-gray-400' };
        case 'D': return { letter: 'Y', tailwindClass: 'text-yellow-400' };
        case 'R': return { letter: 'G', tailwindClass: 'text-green-400' };
        case 'L': return { letter: 'B', tailwindClass: 'text-blue-400' };
        case 'B': return { letter: 'O', tailwindClass: 'text-purple-400' };
        case 'F': return { letter: 'R', tailwindClass: 'text-red-400' };
        default: throw new Error(`Unknown cubie: ${cubie}`);
    }
}

function displayState(elem: Element, solverState: string): void {
    const states = solverState.split('');
    clearFaceDisplay(elem);
    states.forEach((state) => {
        const displayElem = document.createElement('div');
        const displayInfo = getColoredCubie(state);
        displayElem.innerHTML = displayInfo.letter;
        displayElem.className = displayInfo.tailwindClass;
        elem.appendChild(displayElem);
    })
}

function getFaceDisplay(stateFace: StateFace) : Element {
    switch(stateFace) {
        case StateFace.Up: return up;
        case StateFace.Left: return left;
        case StateFace.Front: return front;
        case StateFace.Right: return right;
        case StateFace.Back: return back;
        case StateFace.Down: return down;
    }
}

export function displayStateFace(stateFace: StateFace, solverState: string): void {
    const displayElement = getFaceDisplay(stateFace);
    displayState(displayElement, solverState);
}

function displayBooleanState(elem: Element, state: boolean): void {
    const boolean = new Boolean(state);
    const className = state ? 'text-green-600' : 'text-red-600';
    elem.innerHTML = boolean.toString();
    elem.className = className;
}

export function displayStateOfResolution(isResolved: boolean): void {
    displayBooleanState(resolutionStateDisplay, isResolved);
}

export function displayStateOfMovement(isMoving: boolean): void {
    displayBooleanState(movingStateDisplay, isMoving);
}

displayStateOfMovement(false);