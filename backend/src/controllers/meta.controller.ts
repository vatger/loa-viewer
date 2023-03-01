import { Request, Response } from 'express';
import config from '../config';

export function getVersion(req: Request, res: Response) {
    res.json(config().version);
}

export default {
    getVersion,
};
