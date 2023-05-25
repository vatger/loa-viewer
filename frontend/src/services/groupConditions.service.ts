import Waypoint from '@shared/interfaces/waypoint.interface';
import { FrontendCondition } from 'interfaces/condition.interface';
import { WaypointRecord } from 'interfaces/waypointRecord.interface';
import waypointService from './waypoint.service';

async function groupConditionsByCop(conditions: FrontendCondition[]): Promise<WaypointRecord[]> {
    const groupedConditions: Record<string, FrontendCondition[]> = {};

    for (const condition of conditions) {
        const cop = condition.cop;
        const aerodrome = condition.aerodrome;

        // check if cop is valid
        const targetGroup = cop.length < 2 ? aerodrome : cop;
        groupedConditions[targetGroup] = groupedConditions[targetGroup] || [];
        groupedConditions[targetGroup].push(condition as FrontendCondition);
    }

    const waypointRecords: WaypointRecord[] = [];

    for (const [cop, conditions] of Object.entries(groupedConditions)) {
        const waypoint: Waypoint = await waypointService.getCoordinates(cop);
        waypointRecords.push({ waypoint, conditions });
    }

    return waypointRecords;
}

export default groupConditionsByCop;
