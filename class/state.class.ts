import { StateFace } from "../enum/StateFace.enum";
import { Face } from "../model/face";
import { Slice } from "../model/slice";
import CubeJS from 'cubejs';

interface StateFaceRotation {
    stateFace: StateFace;
    clockwise: boolean;
    solverRotation: string;
}

export default class State {

    cubeSolver = new CubeJS();

    constructor() {
        this.showState();
    }
    

    getColoredCubie(cubie: string) {
        switch (cubie) {
            case 'U': return '\x1b[37mW\x1b[0m';
            case 'D': return '\x1b[33mY\x1b[0m';
            case 'R': return '\x1b[32mG\x1b[0m';
            case 'L': return '\x1b[34mB\x1b[0m';
            case 'B': return '\x1b[35mO\x1b[0m';
            case 'F': return '\x1b[31mR\x1b[0m';
        }
    }

    getPipe() {
        return '\x1b[30m|\x1b[0m';
    }

    getFaceDisplay(start: number): Array<string> {
        let result: Array<string> = [];
        const face = this.getFaceFromSolverState(start);
        face.forEach((line) => {
            const coloredLine = line.map(cubie => this.getColoredCubie(cubie)).join(this.getPipe());
            result.push(this.getPipe() + coloredLine + this.getPipe());
        });

        return result;
    }

    getSpaceDisplay(){
        return Array(3).fill('       ');
    }

    concatFaceDisplay(d1: Array<string>, d2: Array<string>){
        let result = [];

        for(let i = 0; i < d1.length; i++) {
            result.push(d1[i] + ' ' + d2[i]);
        }

        return result;
    }

    logDisplay(finalDisplay: Array<string>){
        finalDisplay.forEach((line) => console.log(line));
    }

    getFaceFromSolverState(start:number): Face {
        let result = [];
        const solverState: string = this.cubeSolver.asString();

        for (let i = 0; i < 3; i++) {
            const line = [];
            for (let j = 0; j < 3; j++) {
                const letter = solverState[start + i*3 + j];
                line.push(letter)
            }
            result.push(line);
        }
        
        return result;
    }

    showState(){
        let firstRowOfDisplay = [this.getSpaceDisplay(), this.getFaceDisplay(0)]
        let firstRow = firstRowOfDisplay.reduce((acc, val) => this.concatFaceDisplay(acc,val))

        let allFace = [36, 18, 9, 45]
        let secondRow = allFace.map((index) => this.getFaceDisplay(index)).reduce((acc, val) => this.concatFaceDisplay(acc,val));

        let thirdRowOfDisplay = [this.getSpaceDisplay(), this.getFaceDisplay(27)]
        let thirdRow = thirdRowOfDisplay.reduce((acc, val) => this.concatFaceDisplay(acc,val))

        console.log('')
        this.logDisplay(firstRow)
        this.logDisplay(secondRow)
        this.logDisplay(thirdRow)
        console.log('')
    }

    rotation: Array<StateFaceRotation> = [
        { stateFace: StateFace.Up, clockwise: true, solverRotation: "U" },
        { stateFace: StateFace.Down, clockwise: true, solverRotation: "D" },
        { stateFace: StateFace.Left, clockwise: true, solverRotation: "L" },
        { stateFace: StateFace.Right, clockwise: true, solverRotation: "R" },
        { stateFace: StateFace.Front, clockwise: true, solverRotation: "F" },
        { stateFace: StateFace.Back, clockwise: true, solverRotation: "B" },
    
        { stateFace: StateFace.Up, clockwise: false, solverRotation: "U'" },
        { stateFace: StateFace.Down, clockwise: false, solverRotation: "D'" },
        { stateFace: StateFace.Left, clockwise: false, solverRotation: "L'" },
        { stateFace: StateFace.Right, clockwise: false, solverRotation: "R'" },
        { stateFace: StateFace.Front, clockwise: false, solverRotation: "F'" },
        { stateFace: StateFace.Back, clockwise: false, solverRotation: "B'" },
    ];
    
    doMakeRotationByVector(stateFace: StateFace, isClockwise: boolean) {
        const rotation = this.rotation.find(
            (rot) => rot.stateFace === stateFace && rot.clockwise === isClockwise
        );
    
        if (rotation && rotation.solverRotation) {
            this.cubeSolver.move(rotation.solverRotation);
        } else {
            console.warn(`Rotation non définie pour face: ${stateFace}, sens horaire: ${isClockwise}`);
        }
    
        this.showState();
    }
    
}