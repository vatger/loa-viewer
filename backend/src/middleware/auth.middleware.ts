import { APIError } from '@shared/errors';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    let loaToken = `${req?.cookies?.loa_token}`;

    if (!loaToken) {
        return next(new APIError('token cookie must be set!', null, 400));
    }

    try {
        jwt.verify(loaToken, config().jwtSecret, {});
    } catch (error) {
        return next(new APIError('Unauthorized', null, 401));
    }

    next();
}

export default authMiddleware;
