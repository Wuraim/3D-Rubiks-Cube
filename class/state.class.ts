import { StateFace } from "../enum/StateFace.enum";
import { Face } from "../model/face";
import { Slice } from "../model/slice";

interface StateFaceRotation {
    stateFace: StateFace;
    clockwise: boolean;
    fnRotation: () => void;
}

export default class State {

    Up = [
        ['W', 'W', 'W'],            
        ['W', 'W', 'W'],
        ['W', 'W', 'W']
    ];
    
    Down = [
        ['Y', 'Y', 'Y'],
        ['Y', 'Y', 'Y'],
        ['Y', 'Y', 'Y']
    ];
    
    Front = [
        ['R', 'R', 'R'], // Rouge en face avant
        ['R', 'R', 'R'],
        ['R', 'R', 'R']
    ];

    Back = [
        ['O', 'O', 'O'], // Orange en face arrière
        ['O', 'O', 'O'],
        ['O', 'O', 'O']
    ];
    
    Left = [
        ['B', 'B', 'B'], // Bleu à gauche
        ['B', 'B', 'B'],
        ['B', 'B', 'B']
    ];
    
    Right = [
        ['G', 'G', 'G'], // Vert à droite
        ['G', 'G', 'G'],
        ['G', 'G', 'G']
    ];

    constructor() {
        this.showState();
    }
    

    getColoredCubie(cubie: string) {
        switch (cubie) {
            case 'W': return '\x1b[37mW\x1b[0m';
            case 'Y': return '\x1b[33mY\x1b[0m';
            case 'G': return '\x1b[32mG\x1b[0m';
            case 'B': return '\x1b[34mB\x1b[0m';
            case 'O': return '\x1b[35mO\x1b[0m';
            case 'R': return '\x1b[31mR\x1b[0m';
        }
    }

    getPipe() {
        return '\x1b[30m|\x1b[0m';
    }

    getFaceDisplay(face: Face): Array<string> {
        let result: Array<string> = [];
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

    showState(){
        let firstRowOfDisplay = [this.getSpaceDisplay(), this.getFaceDisplay(this.Up)]
        let firstRow = firstRowOfDisplay.reduce((acc, val) => this.concatFaceDisplay(acc,val))

        let allFace = [this.Left, this.Front, this.Right, this.Back]
        let secondRow = allFace.map((face) => this.getFaceDisplay(face)).reduce((acc, val) => this.concatFaceDisplay(acc,val));

        let thirdRowOfDisplay = [this.getSpaceDisplay(), this.getFaceDisplay(this.Down)]
        let thirdRow = thirdRowOfDisplay.reduce((acc, val) => this.concatFaceDisplay(acc,val))

        console.log('')
        this.logDisplay(firstRow)
        this.logDisplay(secondRow)
        this.logDisplay(thirdRow)
        console.log('')
    }

    rotation: Array<StateFaceRotation> = [
        { stateFace: StateFace.Up, clockwise: true, fnRotation: this.rotateUpClockwise },
        { stateFace: StateFace.Down, clockwise: true, fnRotation: this.rotateDownClockwise },
        { stateFace: StateFace.Left, clockwise: true, fnRotation: this.rotateLeftClockwise },
        { stateFace: StateFace.Right, clockwise: true, fnRotation: this.rotateRightClockwise },
        { stateFace: StateFace.Front, clockwise: true, fnRotation: this.rotateFrontClockwise },
        { stateFace: StateFace.Back, clockwise: true, fnRotation: this.rotateBackClockwise },
    
        { stateFace: StateFace.Up, clockwise: false, fnRotation: this.rotateUpCounterClockwise },
        { stateFace: StateFace.Down, clockwise: false, fnRotation: this.rotateDownCounterClockwise },
        { stateFace: StateFace.Left, clockwise: false, fnRotation: this.rotateLeftCounterClockwise },
        { stateFace: StateFace.Right, clockwise: false, fnRotation: this.rotateRightCounterClockwise },
        { stateFace: StateFace.Front, clockwise: false, fnRotation: this.rotateFrontCounterClockwise },
        { stateFace: StateFace.Back, clockwise: false, fnRotation: this.rotateBackCounterClockwise },
    ];
    
    doMakeRotationByVector(stateFace: StateFace, isClockwise: boolean) {
        const rotation = this.rotation.find(
            (rot) => rot.stateFace === stateFace && rot.clockwise === isClockwise
        );
    
        if (rotation && rotation.fnRotation) {
            rotation.fnRotation.call(this);
        } else {
            console.warn(`Rotation non définie pour face: ${stateFace}, sens horaire: ${isClockwise}`);
        }
    
        this.showState();
    }
    

    rotateFaceClockwise(face: Face): Face {
        const N = face.length;
        const newFace = Array.from({ length: N }, () => Array(N).fill(''));
    
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                newFace[j][N - 1 - i] = face[i][j];
            }
        }
    
        return newFace;
    }

    rotateFaceCounterClockwise(face: Face): Face {
        const N = face.length;
        const newFace = Array.from({ length: N }, () => Array(N).fill(''));
    
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                newFace[N - 1 - j][i] = face[i][j];
            }
        }
    
        return newFace;
    }
    
    rotateUpClockwise() {
        this.Up = this.rotateFaceClockwise(this.Up);
    
        let frontRow = [...this.Front[0]];
        let rightRow = [...this.Right[0]];
        let backRow = [...this.Back[0]];
        let leftRow = [...this.Left[0]];
    
        this.Front[0] = [...rightRow];
        this.Right[0] = [...backRow];
        this.Back[0] = [...leftRow];
        this.Left[0] = [...frontRow];
    }

    rotateUpCounterClockwise() {
        this.Up = this.rotateFaceCounterClockwise(this.Up);
    
        let frontRow = [...this.Front[0]];
        let rightRow = [...this.Right[0]];
        let backRow = [...this.Back[0]];
        let leftRow = [...this.Left[0]];
    
        this.Front[0] = [...leftRow];
        this.Right[0] = [...frontRow];
        this.Back[0] = [...rightRow];
        this.Left[0] = [...backRow];
    }    
    
    rotateDownClockwise() {
        this.Down = this.rotateFaceClockwise(this.Down);
    
        let frontRow = [...this.Front[2]];
        let rightRow = [...this.Right[2]];
        let backRow = [...this.Back[2]];
        let leftRow = [...this.Left[2]];

        this.Front[2] = [...leftRow];
        this.Right[2] = [...frontRow];
        this.Back[2] = [...rightRow];
        this.Left[2] = [...backRow];
    }
    
    rotateDownCounterClockwise() {
        this.Down = this.rotateFaceCounterClockwise(this.Down);
    
        let frontRow = [...this.Front[2]];
        let rightRow = [...this.Right[2]];
        let backRow = [...this.Back[2]];
        let leftRow = [...this.Left[2]];
    
        this.Front[2] = [...rightRow];     
        this.Right[2] = [...backRow];
        this.Back[2] = [...leftRow];
        this.Left[2] = [...frontRow];
    }
    
    rotateFrontClockwise() {
        this.Front = this.rotateFaceClockwise(this.Front);
    
        let upRow = this.Up[2].slice();
        let leftCol = this.Left.map(row => row[2]);
        let downRow = this.Down[0].slice();
        let rightCol = this.Right.map(row => row[0]);
    
        this.Up[2] = leftCol.reverse();
        for (let i = 0; i < 3; i++) {
            this.Left[i][2] = downRow[i]; 
            this.Down[0][i] = rightCol[i];
            this.Right[i][0] = upRow.reverse()[i];
        }
    }
    
    rotateFrontCounterClockwise() {
        this.Front = this.rotateFaceCounterClockwise(this.Front);
    
        let upRow = this.Up[2].slice();
        let leftCol = this.Left.map(row => row[2]);
        let downRow = this.Down[0].slice();
        let rightCol = this.Right.map(row => row[0]);
    
        this.Up[2] = rightCol;
        for (let i = 0; i < 3; i++) {
            this.Left[i][2] = upRow[i];
            this.Down[0][i] = leftCol.reverse()[i];
            this.Right[i][0] = downRow[i];
        }
    }
    
    rotateBackClockwise() {
        this.Back = this.rotateFaceClockwise(this.Back);
    
        let upRow = this.Up[0].slice();
        let leftCol = this.Left.map(row => row[0]);
        let downRow = this.Down[2].slice();
        let rightCol = this.Right.map(row => row[2]);
    
        this.Up[0] = rightCol.reverse();
        for (let i = 0; i < 3; i++) {
            this.Left[i][0] = upRow[i];
            this.Down[2][i] = leftCol.reverse()[i];
            this.Right[i][2] = downRow[i];
        }
    }
    
    rotateBackCounterClockwise() {
        this.Back = this.rotateFaceCounterClockwise(this.Back);

        let upRow = this.Up[0].slice();
        let leftCol = this.Left.map(row => row[0]);
        let downRow = this.Down[2].slice();
        let rightCol = this.Right.map(row => row[2]);
    
        this.Up[0] = leftCol.reverse();
        for (let i = 0; i < 3; i++) {
            this.Left[i][0] = downRow[i];
            this.Down[2][i] = rightCol[i];
            this.Right[i][2] = upRow[i];
        }
    }
    
    rotateLeftClockwise() {
        this.Left = this.rotateFaceClockwise(this.Left);
    
        let upCol = this.Up.map(row => row[0]);
        let frontCol = this.Front.map(row => row[0]);
        let downCol = this.Down.map(row => row[0]);
        let backCol = this.Back.map(row => row[2]).reverse();
    
        for (let i = 0; i < 3; i++) {
            this.Up[i][0] = backCol[i];
            this.Front[i][0] = upCol[i];
            this.Down[i][0] = frontCol[i]; 
            this.Back[2 - i][2] = downCol[i];
        }
    }
    
    rotateLeftCounterClockwise() {
        this.Left = this.rotateFaceCounterClockwise(this.Left);
        
        let upCol = this.Up.map(row => row[0]);
        let frontCol = this.Front.map(row => row[0]);
        let downCol = this.Down.map(row => row[0]);
        let backCol = this.Back.map(row => row[2]).reverse();
        
        for (let i = 0; i < 3; i++) {
            this.Up[i][0] = frontCol[i];
            this.Front[i][0] = downCol[i];
            this.Down[i][0] = backCol[i];
            this.Back[2 - i][2] = upCol[i];
        }
    }

    rotateRightClockwise() {
        this.Right = this.rotateFaceClockwise(this.Right);
    
        let upCol = this.Up.map(row => row[2]);
        let frontCol = this.Front.map(row => row[2]);
        let downCol = this.Down.map(row => row[2]);
        let backCol = this.Back.map(row => row[0]).reverse();
    
        for (let i = 0; i < 3; i++) {
            this.Up[i][2] = frontCol[i];       
            this.Front[i][2] = downCol[i];
            this.Down[i][2] = backCol[i];
            this.Back[2 - i][0] = upCol[i];
        }
    }
    
    
    rotateRightCounterClockwise() {
        this.Right = this.rotateFaceCounterClockwise(this.Right);
    
        let upCol = this.Up.map(row => row[2]);
        let frontCol = this.Front.map(row => row[2]);
        let downCol = this.Down.map(row => row[2]);
        let backCol = this.Back.map(row => row[0]).reverse();
    
        for (let i = 0; i < 3; i++) {
            this.Up[i][2] = backCol[i];
            this.Front[i][2] = upCol[i];
            this.Down[i][2] = frontCol[i];
            this.Back[2 - i][0] = downCol[i]
        }
    }
    
    
}