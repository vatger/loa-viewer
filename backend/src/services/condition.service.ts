import Condition from '@shared/interfaces/condition.interface';
import conditionModel, { ConditionDocument } from '../models/condition.model';

export async function getAllConditions() {
    try {
        const condition: ConditionDocument[] = await conditionModel
            .find()
            .exec();

        return condition;
    } catch (e) {
        throw e;
    }
}

export async function getCondition(icao: string): Promise<ConditionDocument> {
    try {
        const condition: ConditionDocument | null = await conditionModel
            .findOne({ icao })
            .exec();

        if (!condition) {
            throw new Error('condition not found');
        }

        return condition;
    } catch (e) {
        throw e;
    }
}

export async function addCondition(
    condition: Condition
): Promise<ConditionDocument> {
    const conditionDocument: ConditionDocument = new conditionModel(condition);

    try {
        await conditionDocument.save();
    } catch (e) {
        throw e;
    }

    return conditionDocument;
}

export async function deleteCondition(id: string): Promise<void> {
    try {
        await conditionModel.findByIdAndDelete(id).exec();
    } catch (e) {
        throw e;
    }
}

export async function updateCondition(
    id: string,
    changes: Partial<Condition>
): Promise<ConditionDocument> {
    try {
        const condition = await conditionModel
            .findByIdAndUpdate(id, changes)
            .exec();

        if (!condition) {
            throw new Error('airport does not exist');
        }

        return condition;
    } catch (e) {
        throw e;
    }
}

export default {
    getAllConditions,
    getCondition,
    updateCondition,
    addCondition,
    deleteCondition,
};
