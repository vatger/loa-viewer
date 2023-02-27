import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const password = req.body.password;
        if (Array.isArray(password) || !password) {
            throw new Error('code must be a string, no array');
        }

        if (password === config().adminPw) {
            let token = jwt.sign({}, config().jwtSecret, {
                expiresIn: '12h',
            });

            console.log(token);

            res.cookie('loa_token', token, {
                secure: false,
                httpOnly: true,
            });
            res.json({ success: true });
        }
    } catch (error) {
        next(error);
    }
}

export async function logoutUser(req: Request, res: Response, next: NextFunction) {
    res.clearCookie('loa_token');
    res.json({ success: true });
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
    res.json({ success: true });
}

export default {
    loginUser,
    logoutUser,
    getUser,
};
