import { NextFunction, Request, Response } from 'express';
import sectorService from 'services/sector.service';
import { SectorDocument } from 'models/sector.model';

export async function getAllSectors(req: Request, res: Response, next: NextFunction) {
    try {
        const sectors: SectorDocument[] | undefined = await sectorService.getAllSectors();

        res.json(sectors);
    } catch (error) {
        next(error);
    }
}

export default {
    getAllSectors,
};
