import { APIError } from '@shared/errors';
import conditionController from './controllers/condition.controller';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.get('/conditions', conditionController.getAllConditions);
router.post('/conditions', conditionController.addCondition);
router.get('/conditions/:id', conditionController.getCondition);
router.delete('/conditions/:id', conditionController.deleteCondition);
router.patch('/conditions/:id', conditionController.updateCondition);

router.use((req: Request, res: Response, next: NextFunction) =>
    next(new APIError('Not Found', null, 404))
);

export default router;
