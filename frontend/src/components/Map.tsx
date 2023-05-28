import useDebounce from 'hooks/useDebounce';
import { FrontendCondition } from 'interfaces/condition.interface';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import conditionService from 'services/conditionService';
import filterConditionsService from 'services/filterConditions.service';
import groupConditionsByCop from 'services/groupConditions.service';
import 'leaflet/dist/leaflet.css';
import Markers from './Markers';
import { WaypointRecord } from 'interfaces/waypointRecord.interface';
import Airspace from '@shared/interfaces/sector.interface';
import sectorService from 'services/sector.service';

export default function LoaViewerMap() {
    const [conditions, setConditions] = useState<FrontendCondition[]>([]);
    const [drawnConditions, setDrawnConditions] = useState<WaypointRecord[]>([]);
    const [searchInput, setSearchInput] = useState<string>('GIN');
    const [loading, setLoading] = useState(true);

    const [airspaces, setAirspaces] = useState<Airspace[]>([]);

    useEffect(() => {
        conditionService.getConditions().then((data: FrontendCondition[]) => {
            const convertedData: FrontendCondition[] = data.map((element: FrontendCondition) => {
                return {
                    _id: element._id,
                    aerodrome: element.aerodrome,
                    adep_ades: element.adep_ades,
                    cop: element.cop,
                    level: element.level,
                    feet: element.feet,
                    xc: element.xc,
                    special_conditions: element.special_conditions,
                    from_sector: element.from_sector,
                    to_sector: element.to_sector,
                    from_fir: element.from_fir,
                    to_fir: element.to_fir,
                };
            });
            setConditions(convertedData);
        });
        sectorService.getWaypoints().then((data: Airspace[]) => {
            const convertedData: Airspace[] = data.map((element: Airspace) => {
                return {
                    id: element.id,
                    group: element.group,
                    owner: element.owner,
                    sectors: element.sectors,
                };
            });
            setAirspaces(convertedData);
            console.log(convertedData);
        });

        setLoading(false);
    }, []);

    useEffect(() => {
        if (searchInput === '' || searchInput.length < 2) {
            setSearchInput('GIN');
        }
    }, [searchInput]);

    const debounceSearch = useDebounce(searchInput, 500);
    useEffect(() => {
        if (!loading) {
            const searchConditions = filterConditionsService(conditions, searchInput);
            groupConditionsByCop(searchConditions).then(groupedConditions => {
                setDrawnConditions(groupedConditions);
            });
        }
    }, [debounceSearch, loading]);

    return (
        <>
            <div style={{ position: 'relative' }}>
                <InputText
                    type="search"
                    placeholder="Search"
                    onChange={e => setSearchInput(e.target.value)}
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
                    <Markers key={'Markers'} conditions={drawnConditions} />
                </MapContainer>
            </div>
        </>
    );
}
