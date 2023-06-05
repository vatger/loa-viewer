import { FrontendCondition } from 'interfaces/condition.interface';

export default function filterConditions(conditions: FrontendCondition[], search: string, selectedOwner: String): FrontendCondition[] {
    search = search.toLowerCase();

    // Use the Array.filter() method to create a new array with only the elements that match the search string and selectedOwner
    const filteredConditions = conditions.filter(condition => {
        // Check if any of the properties of the current condition match the search string and selectedOwner
        return Object.values(condition).some(value => {
            if (typeof value === 'string' && value.toLowerCase().includes(search)) {
                return condition.from_sector === selectedOwner || condition.to_sector === selectedOwner;
            }
            return false;
        });
    });

    return filteredConditions;
}
