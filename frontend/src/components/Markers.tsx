import { DivIcon, Icon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, useMap, useMapEvent } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { WaypointRecord } from 'interfaces/waypointRecord.interface';
import location from '../img/location.png';
import React from 'react';
import { MapConditionTable } from './MapConditionTable';

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
                                    icon={MarkerConditionTable(condition)}
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

function MarkerConditionTable(condition: WaypointRecord) {
    return new DivIcon({
        className: 'custom-icon',
        html: renderToStaticMarkup(<MapConditionTable conditions={condition} />),
    });
}

export default Markers;
