import { APIError } from '@shared/errors';
import conditionController from './controllers/condition.controller';
import { NextFunction, Request, Response, Router } from 'express';
import authController from './controllers/auth.controller';
import authMiddleware from './middleware/auth.middleware';
import metaController from './controllers/meta.controller';
import datafeedController from './controllers/datafeed.controller';

const router = Router();

router.get('/conditions', conditionController.getAllConditions);
router.post('/conditions', authMiddleware, conditionController.addCondition);
router.get('/conditions/:id', authMiddleware, conditionController.getCondition);
router.delete('/conditions/:id', authMiddleware, conditionController.deleteCondition);
router.patch('/conditions/:id', authMiddleware, conditionController.updateCondition);

router.get('/datafeed', datafeedController.getDataFeed);

router.post('/auth/login', authController.loginUser);
router.get('/auth/logout', authController.logoutUser);
router.get('/auth/profile', authMiddleware, authController.getUser);

router.get('/version', metaController.getVersion);

router.use((req: Request, res: Response, next: NextFunction) => next(new APIError('Not Found', null, 404)));

export default router;
