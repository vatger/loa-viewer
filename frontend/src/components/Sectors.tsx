import { Marker, Polygon } from 'react-leaflet';
import Airspace from '@shared/interfaces/sector.interface';
import { DivIcon, Icon, LatLngExpression, PointExpression } from 'leaflet';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

interface SectorsProps {
    airspaces: Airspace[];
    showVerticalLimits: Boolean;
}

export function DisplayAirspaces({ airspaces, showVerticalLimits }: SectorsProps) {
    return (
        <div>
            {airspaces.map((airspace, airspaceIndex) => (
                <React.Fragment key={airspaceIndex}>
                    <div key={airspace.id}>
                        {airspace.sectors.map((sector, sectorIndex) => (
                            <React.Fragment key={`${airspaceIndex}-${sectorIndex}`}>
                                <Polygon key={`${airspaceIndex}-${sectorIndex}`} positions={convertCoordinatestoLatLngExpression(sector.points)} color="red" weight={2} />
                                {showVerticalLimits && <Marker position={getAverageOfCoordinates(sector.points)} icon={SectorLevelWidget(sector.min, sector.max)} />}
                            </React.Fragment>
                        ))}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

function SectorLevelWidget(min: number, max: number) {
    let className = 'Marker';
    let iconAnchor = [0, 0] as PointExpression;
    let htmlContent;

    if (min === 0) {
        htmlContent = (
            <span style={{ fontWeight: 'bold', fontSize: 13 }}>
                FL{max + 1}
                <br />
                GND
            </span>
        );
    } else {
        htmlContent = (
            <span style={{ fontWeight: 'bold', fontSize: 13 }}>
                FL{max + 1} <br />
                FL{min}
            </span>
        );
    }

    return new DivIcon({
        className: className,
        iconAnchor: iconAnchor,
        html: renderToStaticMarkup(htmlContent),
    });
}

function getAverageOfCoordinates(coordinates: string[][]): LatLngExpression {
    let latSum = 0;
    let lngSum = 0;
    let count = 0;

    coordinates.forEach(([lat, lng]) => {
        const latNum = convertLatitudeToNumber(lat);
        const lngNum = convertLongitudeToNumber(lng);

        latSum += latNum;
        lngSum += lngNum;

        count++;
    });

    const avgLat = latSum / count;
    const avgLng = lngSum / count;

    // console.log(avgLat);
    // console.log(avgLng);

    return [avgLat, avgLng];
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
