import { FrontendCondition } from 'interfaces/condition.interface';

export default function filterConditions(conditions: FrontendCondition[], search: string): FrontendCondition[] {
    search = search.toLowerCase();

    // Use the Array.filter() method to create a new array with only the elements that match the search string
    const filteredConditions = conditions.filter(condition => {
        // Check if any of the properties of the current condition match the search string
        return Object.values(condition).some(value => {
            // Convert the value to a string and check if it contains the search string
            return typeof value === 'string' && value.toLowerCase().includes(search);
        });
    });

    return filteredConditions;
}
