import axios from 'axios';

export async function getStationMappings(): Promise<any> {
    try {
        const response = await axios.get('https://git.vatsim-germany.org/nav-public/loa-station-mapping/-/raw/main/station_mapping.json');

        return response.data;
    } catch (error) {
        throw error;
    }
}

export default {
    getStationMappings,
};
