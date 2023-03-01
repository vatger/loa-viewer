import { NextFunction, Request, Response } from 'express';
import datafeedService from '../services/datafeed.service';

export async function getDataFeed(req: Request, res: Response, next: NextFunction) {
    try {
        const datafeed = await datafeedService.getRawDatafeed();

        res.json(datafeed);
    } catch (error) {
        next(error);
    }
}

export default {
    getDataFeed,
};
