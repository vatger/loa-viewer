import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, MapContainerProps, TileLayerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FrontendCondition } from 'interfaces/condition.interface';
import { InputText } from 'primereact/inputtext';
import useDebounce from 'hooks/useDebounce';

export default function Map() {
    const [conditions, setConditions] = useState<FrontendCondition[]>([]);
    const [filteredConditions, setFilteredConditions] = useState<Record<string, FrontendCondition[]>>();
    const [search, setSearch] = useState<string>('GIN');

    useEffect(() => {
        // set default search if nothing is inputted
        if (search === '') {
            setSearch('GIN');
        }
    }, [search]);

    const debounceSearch = useDebounce(search, 500);
    useEffect(() => {
    }, [debounceSearch]);

    return (
        <>
            <div style={{ position: 'relative' }}>
                <InputText
                    type="search"
                    placeholder="Search"
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        position: 'absolute',
                        top: '5%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                    }}
                />
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
