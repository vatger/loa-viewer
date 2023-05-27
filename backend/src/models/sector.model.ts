import mongoose, { HydratedDocument } from 'mongoose';
import Airspace from '@shared/interfaces/sector.interface';

export type SectorDocument = HydratedDocument<Airspace>;

export const sectorSchema = new mongoose.Schema({
    max: { type: Number, required: false },
    min: { type: Number, required: false },
    points: { type: [[Number]], required: true },
});

export const airspaceSchema = new mongoose.Schema({
    id: { type: String, required: true },
    group: { type: String, required: true },
    owner: { type: [String], required: true },
    sectors: { type: [sectorSchema], required: true },
});

export default mongoose.model<SectorDocument>('Sector', airspaceSchema);
