export const allRubiksMovement = [
    {
        key: 'ArrowRight',
        vector: {x: 0, y: 0, z: 1},
    },
    {
        key: 'ArrowLeft',
        vector: {x: 0, y: 0, z: -1},
    },
    {
        key: 'ArrowUp',
        vector: {x: 0, y: -1, z: 0},
    },
    {
        key: 'ArrowDown',
        vector: {x: 0, y: 1, z: 0},
    },
]

export const allSliceMovement = [
    {
        slice: {z: 1},
        vector: {x: 0, y: 0, z: 1},
    },
    {
        slice: {z: 1},
        vector: {x: 0, y: 0, z: -1},
    },
    {
        slice: {z: -1},
        vector: {x: 0, y: 0, z: 1},
    },
    {
        slice: {z: -1},
        vector: {x: 0, y: 0, z: -1},
    },
    {
        slice: {y: -1},
        vector: {x: 0, y: -1, z: 0},
    },
    {
        slice: {y: 1},
        vector: {x: 0, y: -1, z: 0},
    },
    {
        slice: {y: -1},
        vector: {x: 0, y: 1, z: 0},
    },
    {
        slice: {y: 1},
        vector: {x: 0, y: 1, z: 0},
    },
    { 
        slice: {x: 1},
        vector: {x: 1, y: 0, z: 0},
    },
    { 
        slice: {x: 1},
        vector: {x: -1, y: 0, z: 0},
    },
    { 
        slice: {x: -1},
        vector: {x: 1, y: 0, z: 0},
    },
    { 
        slice: {x: -1},
        vector: {x: -1, y: 0, z: 0},
    }
];
