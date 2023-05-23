import axios from 'axios';

/**
 * @returns metadata of the DFS AIP
 */
async function getMetadata(): Promise<any> {
    try {
        const response = await axios.get('https://aip.dfs.de/datasets/rest/');
        return response.data;
    } catch (error) {
        console.error(`Error at ${getMetadata.name}`);
        console.error(error);
    }
}

/**
 * @param {string} type - The type of data which should be returned, must be either 'AIXM 5.1' (i.e. xml) or 'Excel'
 * @returns the current xml filename containing the waypoint data of the current airac
 */
async function getWaypointDataFilename(type: string): Promise<{ waypointsFilename: string | undefined; navaidsFilename: string | undefined } | undefined> {
    if (type !== 'Excel' && type !== 'AIXM 5.1') {
        console.error(`${getWaypointDataFilename.name} Insufficient type`);
        return undefined;
    }

    try {
        // retrieve metadata json
        const metadata = await getMetadata();
        const waypointsFilename = metadata?.Amdts?.find(amdt => amdt?.Amdt === 9999)
            ?.Metadata?.datasets?.find(dataset => dataset?.name === 'AIP data set')
            ?.items?.find(item => item?.name === 'ED Waypoints')
            ?.releases?.find(release => release?.type === type)?.filename;

        const navaidsFilename = metadata?.Amdts?.find(amdt => amdt?.Amdt === 9999)
            ?.Metadata?.datasets?.find(dataset => dataset?.name === 'AIP data set')
            ?.items?.find(item => item?.name === 'ED Navaids')
            ?.releases?.find(release => release?.type === type)?.filename;

        return { waypointsFilename, navaidsFilename };
    } catch (error) {
        console.error(`Error at ${getWaypointDataFilename.name}`);
        console.error(error);
    }
}

export default async function getWaypointsExcel(): Promise<any> {
    try {
        const filename = await getWaypointDataFilename('Excel');

        if (filename) {
            const url = 'https://aip.dfs.de/datasets/rest/9999/' + filename;
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
            });
            return response.data;
        } else {
            console.log(`Filename error at ${getWaypointsExcel.name}`);
            console.log(filename);
        }

        return undefined;
    } catch (error) {
        console.error(`Error at ${getWaypointsExcel.name}`);
        console.error(error);
    }
}
