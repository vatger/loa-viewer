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
async function getWaypointDataFilename(type: string): Promise<string | undefined> {
    if (type !== 'Excel' && type !== 'AIXM 5.1') {
        console.error(`${getWaypointDataFilename.name} Insufficient type`);
        return undefined;
    }

    try {
        // retrieve metadata json
        const metadata = await getMetadata();

        // Find snapshot amendment (i.e., most recent, currently effective data)
        const Amendment = metadata?.Amdts?.find((amdt: any) => amdt?.Amdt === 9999);

        // route through json to find the filename:
        const AmdtDatasets = Amendment?.Metadata?.datasets;
        const waypointDataset = AmdtDatasets?.find((dataset: any) => dataset?.name === 'AIP data set');
        const waypointItem = waypointDataset?.items?.find((item: any) => item?.name === 'ED Waypoints');
        const waypointRelease = waypointItem?.releases?.find((release: any) => release?.type === type);
        const filename = waypointRelease?.filename;

        return filename;
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
