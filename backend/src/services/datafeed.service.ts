import axios from 'axios';
import * as VatsimTypes from '@shared/interfaces/vatsim.interface';

export async function getRawDatafeed(): Promise<VatsimTypes.VatsimDatafeed> {
    try {
        const response = await axios.get<VatsimTypes.VatsimDatafeed>('https://data.vatsim.net/v3/vatsim-data.json');

        return response.data;
    } catch (error) {
        throw error;
    }
}

export default {
    getRawDatafeed,
};
