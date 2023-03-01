import axios from 'axios';

import * as VatsimTypes from '@shared/interfaces/vatsim.interface';

export async function getRawDatafeed(): Promise<VatsimTypes.VatsimDatafeed> {
    try {
        const response = await axios.get<VatsimTypes.VatsimDatafeed>('/api/v1/datafeed');

        return response.data;
    } catch (error) {
        throw error;
    }
}

export default {
    getRawDatafeed,
};
