import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, MapContainerProps, TileLayerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map() {

    return (
        <>
            <div style={{ position: 'relative' }}>
                <MapContainer center={[50.026292, 8.765245]} zoom={8} style={{ width: '100vw', height: '100vh', zIndex: 0 }} maxZoom={10} minZoom={6}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                </MapContainer>
            </div>
        </>
    );
}
