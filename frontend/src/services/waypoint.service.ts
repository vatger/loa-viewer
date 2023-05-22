import axios from 'axios';
import { LatLngExpression } from 'leaflet';
import Waypoint from '@shared/interfaces/waypoint.interface';

let waypointData: Waypoint[] | undefined;

async function getWaypoints() {
    try {
        const response = await axios.get('/api/v1/waypoints');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getCoordinates(name: string) {
    if (!waypointData) {
        const data = await getWaypoints();

        // Map the response data to an array of Waypoint objects
        const waypoints: Waypoint[] = data.map((waypointData: any) => {
            return {
                name: waypointData.name,
                latitude: waypointData.latitude,
                longitude: waypointData.longitude,
            };
        });
        waypointData = waypoints;
    }

    const waypoint = waypointData.find(waypoint => waypoint.name === name);
    if (waypoint === undefined) {
        return { name: name, latitude: 0, longitude: 0 } as Waypoint;
    }

    const latitude = Number(waypoint.latitude);
    const longitude = Number(waypoint.longitude);
    return { name: name, latitude: latitude, longitude: longitude } as Waypoint;
}

export default {
    getCoordinates,
};
