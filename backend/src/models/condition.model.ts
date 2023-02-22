import mongoose, { HydratedDocument } from 'mongoose';
import Condition from '@shared/interfaces/condition.interface';

export type ConditionDocument = HydratedDocument<Condition>;

const conditionSchema = new mongoose.Schema(
    {
        aerodrome: { type: String, default: '' },
        adep_ades: { type: String, default: '' },
        cop: { type: String, required: true },
        level: { type: Number, required: true },
        feet: { type: Boolean, default: false },
        xc: { type: String, default: '' },
        special_conditions: { type: String, default: '' },
        from_sector: { type: String, default: '' },
        to_sector: { type: String, default: '' },
        from_fir: { type: String, default: '' },
        to_fir: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.model<ConditionDocument>('Condition', conditionSchema);
