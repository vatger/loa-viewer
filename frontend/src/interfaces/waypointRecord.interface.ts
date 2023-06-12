import Waypoint from '@shared/interfaces/waypoint.interface';
import { FrontendCondition } from './condition.interface';

export interface WaypointRecord {
    waypoint: Waypoint;
    conditions: FrontendCondition[];
}
