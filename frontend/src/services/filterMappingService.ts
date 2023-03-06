import axios from 'axios';

export async function getFilters(): Promise<{}> {
    try {
        const filters = await axios.get<{}>('/api/v1/stationMappings');

        return filters.data;
    } catch (error) {
        throw error;
    }
}

export default { getFilters };
