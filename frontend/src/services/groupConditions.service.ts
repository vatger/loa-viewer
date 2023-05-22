import Waypoint from '@shared/interfaces/waypoint.interface';
import { FrontendCondition } from 'interfaces/condition.interface';
import { WaypointRecord } from 'interfaces/waypointRecord.interface';
import waypointService from './waypoint.service';

async function groupConditionsByCop(conditions: FrontendCondition[]): Promise<WaypointRecord[]> {
    const groupedConditions: Record<string, FrontendCondition[]> = {};

    for (const condition of conditions) {
        const { cop } = condition;
        if (!groupedConditions[cop]) {
            groupedConditions[cop] = [];
        }
        groupedConditions[cop].push(condition as FrontendCondition);
    }

    const waypointRecords: WaypointRecord[] = [];

    for (const [cop, conditions] of Object.entries(groupedConditions)) {
        const waypoint: Waypoint = await waypointService.getCoordinates(cop);
        waypointRecords.push({ waypoint, conditions });
    }

    return waypointRecords;
}

export default groupConditionsByCop;
