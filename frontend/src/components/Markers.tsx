import { DivIcon, Icon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, useMap, useMapEvent } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { WaypointRecord } from 'interfaces/waypointRecord.interface';
import location from '../img/location.png';

interface ExtendedWaypointRecord extends WaypointRecord {
    drawn: boolean;
}

function Markers({ conditions }: { conditions: WaypointRecord[] }) {
    const [drawnConditions, setDrawnConditions] = useState<ExtendedWaypointRecord[]>([]);

    useEffect(() => {
        setDrawnConditions(
            conditions.map(condition => {
                return {
                    ...condition,
                    drawn: false,
                };
            })
        );
    }, [conditions]);

    const map = useMap();
    const [zoom, setZoom] = useState<number>(map.getZoom());
    const [MarkerIcon, setMarkerIcon] = useState<Icon>();

    const handleMarkerClick = (name: string) => {
        setDrawnConditions(previousValue => {
            return previousValue.map(condition => {
                if (condition.waypoint.name === name) {
                    return {
                        ...condition,
                        drawn: !condition.drawn,
                    };
                }
                return condition;
            });
        });
    };

    useMapEvent('zoomend', () => {
        setZoom(map.getZoom());
    });

    useEffect(() => {
        const IconSize = 1 / (zoom * 2) + 15;
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

    return (
        <>
            {drawnConditions &&
                drawnConditions.map(condition => {
                    const { waypoint } = condition;
                    const { latitude, longitude } = waypoint;
                    if (condition.drawn) {
                        return (
                            <>
                                <Marker key={`${waypoint.name}`} position={[latitude, longitude]} icon={MarkerNameWidget(waypoint.name)} eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }} />
                                <Marker key={`${waypoint.name}-marker`} position={[latitude, longitude]} icon={MarkerIcon} eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }} />
                                <Marker key={`${waypoint.name}-table`} position={[latitude, longitude]} icon={MarkerConditionTable(condition, zoom)} eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }} />
                            </>
                        );
                    }

                    return (
                        <>
                            <Marker key={`${waypoint.name}`} position={[latitude, longitude]} icon={MarkerNameWidget(waypoint.name)} eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }} />;
                            <Marker key={`${waypoint.name}-marker`} position={[latitude, longitude]} icon={MarkerIcon} eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }} />{' '}
                        </>
                    );
                })}
        </>
    );
}

function MarkerNameWidget(name: string) {
    return new DivIcon({
        className: 'Marker',
        iconAnchor: [-10, 20],
        html: renderToStaticMarkup(<span style={{ fontWeight: 'normal', fontSize: 13 }}>{name}</span>),
    });
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
