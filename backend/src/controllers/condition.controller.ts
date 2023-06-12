import { NextFunction, Request, Response } from 'express';
import conditionService from '../services/condition.service';
import { ConditionDocument } from '../models/condition.model';

export async function addCondition(req: Request, res: Response, next: NextFunction) {
    try {
        const condition: ConditionDocument = await conditionService.addCondition(req.body);

        res.json(condition);
    } catch (error) {
        next(error);
    }
}

export async function getAllConditions(req: Request, res: Response, next: NextFunction) {
    try {
        const conditions: ConditionDocument[] = await conditionService.getAllConditions();

        res.json(conditions);
    } catch (error) {
        next(error);
    }
}

export async function getCondition(req: Request, res: Response, next: NextFunction) {
    try {
        const condition: ConditionDocument = await conditionService.getCondition(req.params.icao);

        res.json(condition);
    } catch (error) {
        next(error);
    }
}

export async function deleteCondition(req: Request, res: Response, next: NextFunction) {
    try {
        await conditionService.deleteCondition(req.params.id);

        res.json({
            msg: 'deleted condition',
        });
    } catch (error) {
        next(error);
    }
}

export async function updateCondition(req: Request, res: Response, next: NextFunction) {
    try {
        const condition: ConditionDocument = await conditionService.updateCondition(req.params.id, req.body);

        res.json(condition);
    } catch (error) {
        next(error);
    }
}

export default {
    getAllConditions,
    getCondition,
    addCondition,
    updateCondition,
    deleteCondition,
};
