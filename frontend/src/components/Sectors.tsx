import { Polygon } from 'react-leaflet';
import Airspace, { Sector } from '@shared/interfaces/sector.interface';
import { LatLngExpression } from 'leaflet';
import React from 'react';

interface SectorsProps {
    airspaces: Airspace[];
    combineSectors: Boolean;
}

export function DisplayAirspaces({ airspaces, combineSectors }: SectorsProps) {
    airspaces = airspaces.filter(airspace => airspace.id === 'Münster Low');
        return (
            <div>
                {airspaces.map((airspace, airspaceIndex) => (
                    <React.Fragment key={airspaceIndex}>
                        <div key={airspace.id}>
                            {airspace.sectors.map((sector, sectorIndex) => (
                                <React.Fragment key={`${airspaceIndex}-${sectorIndex}`}>
                                    <Polygon key={`${airspaceIndex}-${sectorIndex}`} positions={convertCoordinatestoLatLngExpression(sector.points)} color="red" weight={2} />
                                </React.Fragment>
                            ))}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        );
}
function convertCoordinatestoLatLngExpression(coordinates: string[][]): LatLngExpression[] {
    return coordinates.map(([lat, lng]) => {
        const latNum = convertLatitudeToNumber(lat);
        const lngNum = convertLongitudeToNumber(lng);

        return [latNum, lngNum];
    });
}

function convertLatitudeToNumber(latitude: string): number {
    let latSign = 1;

    if (latitude.startsWith('-')) {
        latitude = latitude.slice(1); // Remove the '-' character
        latSign = -1;
    }
    const latDegrees = parseInt(latitude.slice(0, 2));
    const latMinutes = parseInt(latitude.slice(2, 4));
    const latSeconds = parseInt(latitude.slice(4, 9));
    const latNum = (latDegrees + latMinutes / 60 + latSeconds / 3600) * latSign;

    return latNum;
}

function convertLongitudeToNumber(longitude: string): number {
    let latSign = 1;

    if (longitude.startsWith('-')) {
        longitude = longitude.slice(1); // Remove the '-' character
        latSign = -1;
    }
    const lngDegrees = parseInt(longitude.slice(0, 3));
    const lngMinutes = parseInt(longitude.slice(3, 5));
    const lngSeconds = parseInt(longitude.slice(5, 8));
    const lngNum = (lngDegrees + lngMinutes / 60 + lngSeconds / 3600) * latSign;

    return lngNum;
}

export default {
    Sectors: DisplayAirspaces,
};
