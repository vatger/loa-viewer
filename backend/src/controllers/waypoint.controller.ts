import { NextFunction, Request, Response } from 'express';
import waypointService from '../services/waypoints.service';
import { WaypointDocument } from '../models/waypoint.model';

export async function getAllWaypoints(req: Request, res: Response, next: NextFunction) {
    try {
        const conditions: WaypointDocument[] = await waypointService.getAllWaypoints();

        res.json(conditions);
    } catch (error) {
        next(error);
    }
}

export default {
    getAllWaypoints,
};
