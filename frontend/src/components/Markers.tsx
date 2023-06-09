import { DivIcon, Icon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, useMap, useMapEvent } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { WaypointRecord } from 'interfaces/waypointRecord.interface';
import location from '../img/location.png';
import React from 'react';

function Markers({ conditions }: { conditions: WaypointRecord[] }) {
    const map = useMap();
    const [zoom, setZoom] = useState<number>(map.getZoom());
    const [MarkerIcon, setMarkerIcon] = useState<Icon>();

    useMapEvent('zoomend', () => {
        setZoom(map.getZoom());
    });

    useEffect(() => {
        const IconSize = 1 / zoom + 15;
        setMarkerIcon(
            new Icon({
                iconUrl: location,
                iconSize: [IconSize, IconSize],
            })
        );
    }, [zoom]);

    if (!conditions || conditions.length === 0) {
        return null; // Return null if there are no conditions to render
    }

    // Render markers based on the conditions
    const markers = conditions.map((condition, index) => {
        const { waypoint } = condition;
        const { latitude, longitude } = waypoint;

        // Render a marker using the latitude and longitude
        return (
            <React.Fragment key={index}>
                <Marker position={[latitude, longitude]} key={`${waypoint.name}-marker`} icon={MarkerIcon} />
                <Marker position={[latitude, longitude]} key={`${waypoint.name}-table`} icon={MarkerConditionTable(condition, zoom)} />
            </React.Fragment>
        );
    });

    return <>{markers}</>;
}

function MarkerConditionTable(condition: WaypointRecord, zoom: number) {
    return new DivIcon({
        className: 'custom-icon',
        html: renderToStaticMarkup(<ConditionTableIcon zoom={zoom} conditions={condition} />),
    });
}

interface PropsTable {
    zoom: number;
    conditions: WaypointRecord;
}

function ConditionTableIcon({ zoom, conditions }: PropsTable) {
    const tableStyle = {
        fontSize: 1 / zoom + 10,
    };

    const agreements = conditions.conditions;
    let hasSpecialConditions = false;
    let columnSpan = 3;

    agreements.forEach(condition => {
        if (condition.special_conditions) {
            hasSpecialConditions = true;
            columnSpan = 4;
        }
    });

    return (
        <table className="map-table-style" style={tableStyle}>
            <thead>
                <tr>
                    <th className="center" colSpan={columnSpan} />
                    <th className="center line" colSpan={2}>
                        Sector
                    </th>
                    <th className="center line " colSpan={2}>
                        FIR
                    </th>
                </tr>
                <tr>
                    <th className="line">AD</th>
                    <th className="line">COP</th>
                    <th className="line">Level</th>
                    {hasSpecialConditions ? <th className="line">Special Conditions</th> : null}
                    <th className="line">From</th>
                    <th className="line">To</th>
                    <th className="line">From</th>
                    <th className="line">To</th>
                </tr>
            </thead>
            <tbody>
                {agreements.map((condition, index) => (
                    <tr key={index}>
                        <td className="line">
                            {condition.adep_ades === 'ADEP' ? '\u2191' : condition.adep_ades === 'ADES' ? '\u2193' : ''} {condition.aerodrome}
                        </td>
                        <td className="line">{condition.cop}</td>
                        <td className="line">
                            {condition.feet ? 'A' : 'FL'}
                            {condition.level}
                            {condition.xc}
                        </td>
                        {hasSpecialConditions ? <td className="line">{condition.special_conditions}</td> : null}
                        <td className="line">{condition.from_sector}</td>
                        <td className="line">{condition.to_sector}</td>
                        <td className="line">{condition.from_fir}</td>
                        <td className="line">{condition.to_fir}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Markers;
