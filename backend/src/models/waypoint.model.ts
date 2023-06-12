import mongoose, { HydratedDocument } from 'mongoose';
import Waypoint from '@shared/interfaces/waypoint.interface';

export type WaypointDocument = HydratedDocument<Waypoint>;

export const waypointSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

export default mongoose.model<WaypointDocument>('Waypoint', waypointSchema);
