export enum StateFace {
    Up,
    Down,
    Front,
    Back,
    Left,
    Right,
}

export function getLibelleEnum(stateFace: StateFace) : string {
    const index = Object.values(StateFace).findIndex((sub) => sub === stateFace);
    return Object.keys(StateFace)[index];
}