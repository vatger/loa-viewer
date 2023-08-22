import useDebounce from 'hooks/useDebounce';
import { FrontendCondition } from 'interfaces/condition.interface';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import conditionService from 'services/conditionService';
import filterConditionsService from 'services/filterConditions.service';
import groupConditionsByCop from 'services/groupConditions.service';
import 'leaflet/dist/leaflet.css';
import Markers from './Markers';
import { WaypointRecord } from 'interfaces/waypointRecord.interface';
import { DisplayAirspaces } from './Sectors';
import Airspace from '@shared/interfaces/sector.interface';
import sectorService from 'services/sector.service';

export default function LoaViewerMap() {
    const [conditions, setConditions] = useState<FrontendCondition[]>([]);
    const [drawnConditions, setDrawnConditions] = useState<WaypointRecord[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const [airspaces, setAirspaces] = useState<Airspace[]>([]);
    const [drawnAirspaces, setDrawnAirspaces] = useState<Airspace[]>([]);

    const selectableGroups = ['EDMM', 'EDWW', 'EDGG', 'EDYY', 'EDUU', 'APP'];
    const sortedSelectableGroups = selectableGroups.sort((a, b) => a.localeCompare(b));
    const [allStations, setAllStations] = useState<String[]>([]);
    const [selectedSector, setSelectedSector] = useState<String>('GIN');
    const [selectedFir, setSelectedFir] = useState<String>('EDGG');

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
        sectorService.getSectors().then((data: Airspace[]) => {
            const convertedData: Airspace[] = data.map((element: Airspace) => {
                return {
                    id: element.id,
                    group: element.group,
                    owner: element.owner,
                    sectors: element.sectors,
                };
            });
            setAirspaces(convertedData);
        });

        setLoading(false);
    }, []);

    const debounceSearch = useDebounce(searchInput, 500);
    useEffect(() => {
        if (!loading) {
            const searchConditions = filterConditionsService(conditions, searchInput, selectedSector);
            groupConditionsByCop(searchConditions).then(groupedConditions => {
                setDrawnConditions(groupedConditions);
            });
        }
    }, [debounceSearch, loading, searchInput, conditions, selectedSector]);

    useEffect(() => {
        const stationsSet: Set<string> = new Set();
        for (const airspace of airspaces) {
            if (airspace.group === selectedFir) {
                const owner = airspace.owner[0];
                // filter approach stations not belonging to vACC Germany - all approach sectors are not using Vatsim callsigns i.e. no _ in their name
                const isNonGermanApproachStation = owner.includes('_');
                // filter Maastricht Sectors belonging to vACC Germany - sectors belonging to vACC Germany have 3 or more characters
                const isGermanMaastrichtSector = owner.length > 2;
                if (!isNonGermanApproachStation && isGermanMaastrichtSector) {
                    stationsSet.add(owner);
                }
            }
        }

        const stations: string[] = Array.from(stationsSet);
        const sortedStations = stations.sort((a, b) => a.localeCompare(b));
        setAllStations(sortedStations);
    }, [selectedFir, loading, airspaces]);

    useEffect(() => {
        const filtered = airspaces.filter(airspace => airspace.owner[0] === selectedSector);
        setDrawnAirspaces(filtered);
    }, [selectedFir, loading, airspaces, selectedSector]);

    return (
        <>
            <div>
                <div style={{ position: 'absolute', zIndex: 1, top: '10%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <InputText type="search" placeholder="Search" onChange={e => setSearchInput(e.target.value)} />
                    <Dropdown options={allStations} value={selectedSector} onChange={e => setSelectedSector(e.value)} />
                    <Dropdown options={sortedSelectableGroups} value={selectedFir} onChange={e => setSelectedFir(e.value)} />
                </div>

                <MapContainer center={[50.026292, 8.765245]} zoom={8} style={{ width: '100vw', height: '100vh', zIndex: 0 }} maxZoom={10} minZoom={6}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    <DisplayAirspaces airspaces={drawnAirspaces} combineSectors={true} />
                    <Markers key={'Markers'} conditions={drawnConditions} />
                </MapContainer>
            </div>
        </>
    );
}
