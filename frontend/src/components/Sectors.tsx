import { Marker, Polygon } from 'react-leaflet';
import Airspace from '@shared/interfaces/sector.interface';
import { DivIcon, PointExpression } from 'leaflet';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { convertCoordinatestoLatLngExpression, getAverageOfCoordinates } from 'util/coordinate.util';

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
                                <Polygon key={`${airspaceIndex}-${sectorIndex}`} positions={convertCoordinatestoLatLngExpression(sector.points)} color="rgb(64, 224, 208)" weight={2} fillOpacity={0.1} />
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

    if (min === 0 || !min) {
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
                FL{max + 1 || 660} <br />
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
