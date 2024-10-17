export default class State {

    Up = [
            ['W','W','W'],
            ['W','W','W'],
            ['W','W','W']
        ]

    Down = [
        ['Y','Y','Y'],
        ['Y','Y','Y'],
        ['Y','Y','Y']
    ];

    Front= [
        ['G','G','G'],
        ['G','G','G'],
        ['G','G','G']
    ];

    Back = [
        ['B','B','B'],
        ['B','B','B'],
        ['B','B','B']
    ];

    Left = [
        ['O','O','O'],
        ['O','O','O'],
        ['O','O','O']
    ];

    Right = [
        ['R','R','R'],
        ['R','R','R'],
        ['R','R','R']
    ];

    getColoredCubie(cubie) {
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

    getFaceDisplay(face) {
        let result = [];
        face.forEach((line) => {
            const coloredLine = line.map(cubie => this.getColoredCubie(cubie)).join(this.getPipe());
            result.push(this.getPipe() + coloredLine + this.getPipe());
        });
        return result;
    }

    getSpaceDisplay(){
        return Array(3).fill('       ');
    }

    concatFaceDisplay(d1, d2){
        let result = [];

        for(let i = 0; i < d1.length; i++) {
            result.push(d1[i] + ' ' + d2[i]);
        }

        return result;
    }

    logDisplay(finalDisplay){
        finalDisplay.forEach((line) => console.log(line));
    }

    showState(){
        let firstRowOfDisplay = [this.getSpaceDisplay(), this.getFaceDisplay(this.Up)]
        let firstRow = firstRowOfDisplay.reduce((acc, val) => this.concatFaceDisplay(acc,val))

        let allFace = [this.Left, this.Front, this.Right, this.Back]
        let secondRow = allFace.map((face) => this.getFaceDisplay(face)).reduce((acc, val) => this.concatFaceDisplay(acc,val));

        let thirdRowOfDisplay = [this.getSpaceDisplay(), this.getFaceDisplay(this.Down)]
        let thirdRow = thirdRowOfDisplay.reduce((acc, val) => this.concatFaceDisplay(acc,val))

        console.log(new Date())
        console.log('')
        this.logDisplay(firstRow)
        this.logDisplay(secondRow)
        this.logDisplay(thirdRow)
        console.log('')
    }

    rotateFaceClockwise(face) {
        const N = face.length;
        const newFace = Array.from({ length: N }, () => Array(N).fill(''));
    
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                newFace[j][N - 1 - i] = face[i][j];
            }
        }
    
        return newFace;
    }

    rotateFaceCounterClockwise(face) {
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
        // Rotation de la face Up
        this.Up = this.rotateFaceClockwise(this.Up);
    
        // Sauvegarder les bandes adjacentes
        let frontRow = [...this.Front[0]];
        let rightRow = [...this.Right[0]];
        let backRow = [...this.Back[0]];
        let leftRow = [...this.Left[0]];
    
        // Échanger les bandes adjacentes (sens horaire)
        this.Front[0] = [...rightRow];       // La première ligne de Right devient la première ligne de Front
        this.Right[0] = [...backRow];        // La première ligne de Back devient la première ligne de Right
        this.Back[0] = [...leftRow];         // La première ligne de Left devient la première ligne de Back
        this.Left[0] = [...frontRow];        // La première ligne de Front devient la première ligne de Left
    }

    rotateUpCounterClockwise() {
        // Rotation de la face Up
        this.Up = this.rotateFaceCounterClockwise(this.Up);
    
        // Sauvegarder les bandes adjacentes
        let frontRow = [...this.Front[0]];
        let rightRow = [...this.Right[0]];
        let backRow = [...this.Back[0]];
        let leftRow = [...this.Left[0]];
    
        // Échanger les bandes adjacentes (sens antihoraire)
        this.Front[0] = [...leftRow];        // La première ligne de Left devient la première ligne de Front
        this.Right[0] = [...frontRow];       // La première ligne de Front devient la première ligne de Right
        this.Back[0] = [...rightRow];        // La première ligne de Right devient la première ligne de Back
        this.Left[0] = [...backRow];         // La première ligne de Back devient la première ligne de Left
    }    
    
    rotateDownClockwise() {
        // Rotation de la face Down
        this.Down = this.rotateFaceClockwise(this.Down);
    
        // Sauvegarder les bandes adjacentes
        let frontRow = [...this.Front[2]];
        let rightRow = [...this.Right[2]];
        let backRow = [...this.Back[2]];
        let leftRow = [...this.Left[2]];
    
        // Échanger les bandes adjacentes (sens horaire)
        this.Front[2] = [...rightRow];       // La troisième ligne de Right devient la troisième ligne de Front
        this.Right[2] = [...backRow];        // La troisième ligne de Back devient la troisième ligne de Right
        this.Back[2] = [...leftRow];         // La troisième ligne de Left devient la troisième ligne de Back
        this.Left[2] = [...frontRow];        // La troisième ligne de Front devient la troisième ligne de Left
    }
    
    rotateDownCounterClockwise() {
        // Rotation de la face Down
        this.Down = this.rotateFaceCounterClockwise(this.Down);
    
        // Sauvegarder les bandes adjacentes
        let frontRow = [...this.Front[2]];
        let rightRow = [...this.Right[2]];
        let backRow = [...this.Back[2]];
        let leftRow = [...this.Left[2]];
    
        // Échanger les bandes adjacentes (sens antihoraire)
        this.Front[2] = [...leftRow];        // La troisième ligne de Left devient la troisième ligne de Front
        this.Right[2] = [...frontRow];       // La troisième ligne de Front devient la troisième ligne de Right
        this.Back[2] = [...rightRow];        // La troisième ligne de Right devient la troisième ligne de Back
        this.Left[2] = [...backRow];         // La troisième ligne de Back devient la troisième ligne de Left
    }
    
    rotateFrontClockwise() {
        // Rotation de la face Front
        this.Front = this.rotateFaceClockwise(this.Front);
    
        // Sauvegarder les bandes adjacentes
        let upRow = this.Up[2].slice(); // Dernière ligne de Up
        let leftCol = this.Left.map(row => row[2]); // Dernière colonne de Left
        let downRow = this.Down[0].slice(); // Première ligne de Down
        let rightCol = this.Right.map(row => row[0]); // Première colonne de Right
    
        // Échanger les bandes adjacentes (sens horaire)
        this.Up[2] = leftCol.reverse();           // La colonne droite de Left devient la dernière ligne de Up (inversée)
        for (let i = 0; i < 3; i++) {
            this.Left[i][2] = downRow[i];         // La première ligne de Down devient la colonne droite de Left
            this.Down[0][i] = rightCol[i];        // La colonne gauche de Right devient la première ligne de Down
            this.Right[i][0] = upRow.reverse()[i]; // La dernière ligne de Up devient la colonne gauche de Right (inversée)
        }
    }
    
    rotateFrontCounterClockwise() {
        // Rotation de la face Front
        this.Front = this.rotateFaceCounterClockwise(this.Front);
    
        // Sauvegarder les bandes adjacentes
        let upRow = this.Up[2].slice(); // Dernière ligne de Up
        let leftCol = this.Left.map(row => row[2]); // Dernière colonne de Left
        let downRow = this.Down[0].slice(); // Première ligne de Down
        let rightCol = this.Right.map(row => row[0]); // Première colonne de Right
    
        // Échanger les bandes adjacentes (sens antihoraire)
        this.Up[2] = rightCol;           // La colonne gauche de Right devient la dernière ligne de Up
        for (let i = 0; i < 3; i++) {
            this.Left[i][2] = upRow[i];  // La dernière ligne de Up devient la colonne droite de Left
            this.Down[0][i] = leftCol.reverse()[i]; // La colonne droite de Left devient la première ligne de Down (inversée)
            this.Right[i][0] = downRow[i];          // La première ligne de Down devient la colonne gauche de Right
        }
    }
    
    rotateBackClockwise() {
        // Rotation de la face Back
        this.Back = this.rotateFaceClockwise(this.Back);
    
        // Sauvegarder les bandes adjacentes
        let upRow = this.Up[0].slice(); // Première ligne de Up
        let leftCol = this.Left.map(row => row[0]); // Première colonne de Left
        let downRow = this.Down[2].slice(); // Dernière ligne de Down
        let rightCol = this.Right.map(row => row[2]); // Dernière colonne de Right
    
        // Échanger les bandes adjacentes (sens horaire)
        this.Up[0] = rightCol.reverse();           // La colonne droite de Right devient la première ligne de Up (inversée)
        for (let i = 0; i < 3; i++) {
            this.Left[i][0] = upRow[i];            // La première ligne de Up devient la colonne gauche de Left
            this.Down[2][i] = leftCol.reverse()[i]; // La colonne gauche de Left devient la dernière ligne de Down (inversée)
            this.Right[i][2] = downRow[i];         // La dernière ligne de Down devient la colonne droite de Right
        }
    }
    
    rotateBackCounterClockwise() {
        // Rotation de la face Back
        this.Back = this.rotateFaceCounterClockwise(this.Back);
    
        // Sauvegarder les bandes adjacentes
        let upRow = this.Up[0].slice(); // Première ligne de Up
        let leftCol = this.Left.map(row => row[0]); // Première colonne de Left
        let downRow = this.Down[2].slice(); // Dernière ligne de Down
        let rightCol = this.Right.map(row => row[2]); // Dernière colonne de Right
    
        // Échanger les bandes adjacentes (sens antihoraire)
        this.Up[0] = leftCol.reverse();           // La colonne gauche de Left devient la première ligne de Up (inversée)
        for (let i = 0; i < 3; i++) {
            this.Left[i][0] = downRow[i];         // La dernière ligne de Down devient la colonne gauche de Left
            this.Down[2][i] = rightCol[i];        // La colonne droite de Right devient la dernière ligne de Down
            this.Right[i][2] = upRow[i];          // La première ligne de Up devient la colonne droite de Right
        }
    }
    
    rotateLeftClockwise() {
        // Rotation de la face Left
        this.Left = this.rotateFaceClockwise(this.Left);
    
        // Sauvegarder les bandes adjacentes
        let upCol = this.Up.map(row => row[0]);
        let frontCol = this.Front.map(row => row[0]);
        let downCol = this.Down.map(row => row[0]);
        let backCol = this.Back.map(row => row[2]).reverse();
    
        // Échanger les bandes adjacentes (sens horaire)
        for (let i = 0; i < 3; i++) {
            this.Up[i][0] = backCol[i];        // La colonne gauche de Back devient la colonne gauche de Up (inversée)
            this.Front[i][0] = upCol[i];       // La colonne gauche de Up devient la colonne gauche de Front
            this.Down[i][0] = frontCol[i];     // La colonne gauche de Front devient la colonne gauche de Down
            this.Back[2 - i][2] = downCol[i];  // La colonne gauche de Down devient la colonne gauche de Back (inversée)
        }
    }
    
    rotateLeftCounterClockwise() {
        // Rotation de la face Left
        this.Left = this.rotateFaceCounterClockwise(this.Left);
        
        // Sauvegarder les bandes adjacentes
        let upCol = this.Up.map(row => row[0]);
        let frontCol = this.Front.map(row => row[0]);
        let downCol = this.Down.map(row => row[0]);
        let backCol = this.Back.map(row => row[2]).reverse();
        
        // Échanger les bandes adjacentes (sens antihoraire)
        for (let i = 0; i < 3; i++) {
            this.Up[i][0] = frontCol[i];
            this.Front[i][0] = downCol[i];
            this.Down[i][0] = backCol[i];
            this.Back[2 - i][2] = upCol[i];    // On inverse ici l'ordre de la colonne back
        }
    }

    rotateRightClockwise() {
        // Rotation de la face Right
        this.Right = this.rotateFaceClockwise(this.Right);
    
        // Sauvegarder les bandes adjacentes
        let upCol = this.Up.map(row => row[2]);
        let frontCol = this.Front.map(row => row[2]);
        let downCol = this.Down.map(row => row[2]);
        let backCol = this.Back.map(row => row[0]).reverse();
    
        // Échanger les bandes adjacentes (sens horaire)
        for (let i = 0; i < 3; i++) {
            this.Up[i][2] = frontCol[i];       // La colonne droite de Front devient la colonne droite de Up
            this.Front[i][2] = downCol[i];     // La colonne droite de Down devient la colonne droite de Front
            this.Down[i][2] = backCol[i];      // La colonne droite de Back devient la colonne droite de Down (inversée)
            this.Back[2 - i][0] = upCol[i];    // La colonne droite de Up devient la colonne droite de Back (inversée)
        }
    }
    
    
    rotateRightCounterClockwise() {
        // Rotation de la face Right
        this.Right = this.rotateFaceCounterClockwise(this.Right);
    
        // Sauvegarder les bandes adjacentes
        let upCol = this.Up.map(row => row[2]);
        let frontCol = this.Front.map(row => row[2]);
        let downCol = this.Down.map(row => row[2]);
        let backCol = this.Back.map(row => row[0]).reverse();
    
        // Échanger les bandes adjacentes (sens antihoraire)
        for (let i = 0; i < 3; i++) {
            this.Up[i][2] = backCol[i];        // La colonne droite de Back devient la colonne droite de Up (inversée)
            this.Front[i][2] = upCol[i];       // La colonne droite de Up devient la colonne droite de Front
            this.Down[i][2] = frontCol[i];     // La colonne droite de Front devient la colonne droite de Down
            this.Back[2 - i][0] = downCol[i];  // La colonne droite de Down devient la colonne droite de Back
        }
    }
    
    
}