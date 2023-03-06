import { NextFunction, Request, Response } from 'express';
import stationMappingService from '../services/stationMappings.service';

export async function getStationMappings(req: Request, res: Response, next: NextFunction) {
    try {
        const stationMappings = await stationMappingService.getStationMappings();

        res.json(stationMappings);
    } catch (error) {
        next(error);
    }
}

export default {
    getStationMappings,
};
