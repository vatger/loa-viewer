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
async function getWaypointDataFilename(type: string): Promise<{ waypointsFilename?: string; navaidsFilename?: string } | undefined> {
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

export default async function getDataXlsxs(): Promise<{ waypointsExcel: any; navaidsExcel: any } | undefined> {
    try {
        const filename = await getWaypointDataFilename('Excel');

        if (filename) {
            const waypointsPromise = filename.waypointsFilename ? axios.get('https://aip.dfs.de/datasets/rest/9999/' + filename.waypointsFilename, { responseType: 'arraybuffer' }) : null;

            const navaidsPromise = filename.navaidsFilename ? axios.get('https://aip.dfs.de/datasets/rest/9999/' + filename.navaidsFilename, { responseType: 'arraybuffer' }) : null;

            const [waypointsResponse, navaidsResponse] = await Promise.all([waypointsPromise, navaidsPromise]);

            const waypointsExcel = waypointsResponse?.data ?? null;
            const navaidsExcel = navaidsResponse?.data ?? null;

            return {
                waypointsExcel,
                navaidsExcel,
            };
        } else {
            return undefined;
        }
    } catch (error) {
        console.error(`Error at ${getDataXlsxs.name}`);
        console.error(error);
    }
}
