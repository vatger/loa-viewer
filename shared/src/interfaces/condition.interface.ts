export interface Condition {
    aerodrome: string; // ex. EDDF
    adep_ades: 'ADEP' | 'ADES' | null; // Whether the condition is for inbound or outbound aerodrome
    cop: string; // ex. BOMBI
    level: number; // ex. 150
    feet: boolean; // If true, level will be feet
    xc: 'A' | 'B' | null; // Crossing Condition: A (above) = climbing, B (below) = descending
    special_conditions: string; // ex. When clear of sector xyz
    from_sector: string; // ex. GIN
    to_sector: string; // ex. WUR
    from_fir: string;
    to_fir: string;
}

export default Condition;
