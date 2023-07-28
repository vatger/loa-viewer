import { DivIcon, Icon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, useMap, useMapEvent } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { WaypointRecord } from 'interfaces/waypointRecord.interface';
import location from '../img/location.png';
import React from 'react';

interface ExtendedWaypointRecord extends WaypointRecord {
    drawn: boolean;
    zIndex: number;
}

function Markers({ conditions }: { conditions: WaypointRecord[] }) {
    const [drawnConditions, setDrawnConditions] = useState<ExtendedWaypointRecord[]>([]);
    const [countConditionsDrawn, setCountConditionsDrawn] = useState<Number>(0);

    useEffect(() => {
        setDrawnConditions(
            conditions.map(condition => {
                return {
                    ...condition,
                    drawn: false,
                    zIndex: 0,
                };
            })
        );
    }, [conditions]);

    const map = useMap();
    const [zoom, setZoom] = useState<number>(map.getZoom());
    const [MarkerIcon, setMarkerIcon] = useState<Icon>();

    const handleMarkerClick = (name: string) => {
        const copy = drawnConditions.map(condition => {
            if (condition.waypoint.name === name) {
                if (condition.drawn === true && condition.zIndex === 0) {
                    if (countConditionsDrawn === 1) {
                        condition.drawn = false;
                    } else {
                        condition.zIndex = 1001;
                    }
                } else if (condition.drawn === true) {
                    condition.drawn = false;
                    condition.zIndex = 0;
                } else {
                    condition.drawn = true;
                    condition.zIndex = 1001;
                }
            } else {
                condition.zIndex = 0;
            }
            // console.log(condition.waypoint.name + ' ' + condition.zIndex);
            return condition;
        });
        setDrawnConditions(copy);

        setCountConditionsDrawn(
            drawnConditions.reduce((count, condition) => {
                if (condition.drawn === true) {
                    return count + 1;
                } else {
                    return count;
                }
            }, 0)
        );
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
                            <React.Fragment key={`drawn-${waypoint.name}`}>
                                <Marker key={`${waypoint.name}`} position={[latitude, longitude]} icon={MarkerNameWidget(waypoint.name)} eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }} zIndexOffset={condition.zIndex} />
                                <Marker key={`${waypoint.name}-marker`} position={[latitude, longitude]} icon={MarkerIcon} eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }} zIndexOffset={condition.zIndex} />
                                <Marker
                                    key={`${waypoint.name}-table`}
                                    position={[latitude, longitude]}
                                    icon={MarkerConditionTable(condition, zoom)}
                                    eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }}
                                    zIndexOffset={condition.zIndex}
                                />
                            </React.Fragment>
                        );
                    }

                    return (
                        <React.Fragment key={`not-drawn-${waypoint.name}`}>
                            <Marker key={`${waypoint.name}`} position={[latitude, longitude]} icon={MarkerNameWidget(waypoint.name)} eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }} />;
                            <Marker key={`${waypoint.name}-marker`} position={[latitude, longitude]} icon={MarkerIcon} eventHandlers={{ click: () => handleMarkerClick(waypoint.name) }} />{' '}
                        </React.Fragment>
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
                    <th className="center line background-black" colSpan={2}>
                        Sector
                    </th>
                    <th className="center line background-black " colSpan={2}>
                        FIR
                    </th>
                </tr>
                <tr>
                    <th className="line background-black background-black">AD</th>
                    <th className="line background-black">COP</th>
                    <th className="line background-black">Level</th>
                    {hasSpecialConditions ? <th className="line background-black">Special Conditions</th> : null}
                    <th className="line background-black">From</th>
                    <th className="line background-black">To</th>
                    <th className="line background-black">From</th>
                    <th className="line background-black">To</th>
                </tr>
            </thead>
            <tbody>
                {agreements.map((condition, index) => (
                    <tr key={index}>
                        <td className="line background-black">
                            {condition.adep_ades === 'ADEP' ? '\u2191' : condition.adep_ades === 'ADES' ? '\u2193' : ''} {condition.aerodrome}
                        </td>
                        <td className="line background-black">{condition.cop}</td>
                        <td className="line background-black">
                            {condition.feet ? 'A' : 'FL'}
                            {condition.level}
                            {condition.xc}
                        </td>
                        {hasSpecialConditions ? <td className="line background-black">{condition.special_conditions}</td> : null}
                        <td className="line background-black">{condition.from_sector}</td>
                        <td className="line background-black">{condition.to_sector}</td>
                        <td className="line background-black">{condition.from_fir}</td>
                        <td className="line background-black">{condition.to_fir}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Markers;
