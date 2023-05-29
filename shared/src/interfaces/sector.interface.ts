export interface Airspace {
    id: string;
    group: string;
    owner: string[];
    sectors: Sector[];
}

export interface Sector {
    max: number;
    min: number;
    points: string[][];
}

export default Airspace;
