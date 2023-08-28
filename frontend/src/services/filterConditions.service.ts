import { FrontendCondition } from 'interfaces/condition.interface';

export default function filterConditions(conditions: FrontendCondition[], search: string, selectedOwner: String | undefined, filterFromToSector: false | 'from sector' | 'to sector'): FrontendCondition[] {
    search = search.toLowerCase();

    const isValueMatch = (value: any) => typeof value === 'string' && value.toLowerCase().includes(search);

    const isFromSectorMatch = filterFromToSector === false || filterFromToSector === 'from sector';
    const isToSectorMatch = filterFromToSector === false || filterFromToSector === 'to sector';

    const filteredConditions = conditions.filter(condition =>
        Object.values(condition).some(value => {
            if (selectedOwner === undefined && isValueMatch(value)) {
                return true;
            } else if (isValueMatch(value)) {
                if (isFromSectorMatch && condition.from_sector === selectedOwner) {
                    return true;
                } else if (isToSectorMatch && condition.to_sector === selectedOwner) {
                    return true;
                }
            }
            return false;
        })
    );

    return filteredConditions;
}
