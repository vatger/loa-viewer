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
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Divider } from 'primereact/divider';

export default function LoaViewerMap() {
    const [loading, setLoading] = useState(true);

    // persistent data
    const [conditions, setConditions] = useState<FrontendCondition[]>([]);
    const [airspaces, setAirspaces] = useState<Airspace[]>([]);
    const selectableGroups = ['EDMM', 'EDWW', 'EDGG', 'EDYY', 'EDUU', 'APP'].sort((a, b) => a.localeCompare(b));

    // Toolbar:
    // Dropdown menu
    const [selectedSector, setSelectedSector] = useState<String>('GIN');
    const [selectedFir, setSelectedFir] = useState<String>('EDGG');
    // Button
    const [showVerticalLimits, setShowVerticalLimits] = useState<boolean>(false);
    const [conditionSearchRange, setConditionSearchRange] = useState<'ofSelectedSector' | 'all'>('ofSelectedSector');
    const [filterFromToSector, setFilterFromToSector] = useState<boolean>(false);
    const [filterFromToSectorSelection, setFilterFromToSectorSelection] = useState<'from sector' | 'to sector'>('to sector');
    // search bar
    const [searchInput, setSearchInput] = useState<string>('');

    // filtered data - based on input in toolbar
    const [drawnConditions, setDrawnConditions] = useState<WaypointRecord[]>([]);
    const [drawnAirspaces, setDrawnAirspaces] = useState<Airspace[]>([]);
    const [allStations, setAllStations] = useState<String[]>([]);

    useEffect(() => {
        conditionService.getConditions().then((data: FrontendCondition[]) => {
            const convertedConditionData: FrontendCondition[] = data.map((element: FrontendCondition) => {
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
            setConditions(convertedConditionData);
        });
        sectorService.getSectors().then((data: Airspace[]) => {
            const convertedAirspaceData: Airspace[] = data.map((element: Airspace) => {
                return {
                    country: element.country,
                    id: element.id,
                    group: element.group,
                    owner: element.owner,
                    sectors: element.sectors,
                };
            });
            setAirspaces(convertedAirspaceData);
        });

        setLoading(false);
    }, []);

    const debounceSearch = useDebounce(searchInput, 500);
    useEffect(() => {
        if (!loading) {
            const searchConditions = filterConditionsService(conditions, searchInput, conditionSearchRange === 'ofSelectedSector' ? selectedSector : undefined, filterFromToSector === true ? filterFromToSectorSelection : false);
            groupConditionsByCop(searchConditions).then(groupedConditions => {
                setDrawnConditions(groupedConditions);
            });
        }
    }, [debounceSearch, loading, searchInput, conditions, selectedSector, conditionSearchRange, filterFromToSector, filterFromToSectorSelection]);

    useEffect(() => {
        const stationsSet: Set<string> = new Set();
        for (const airspace of airspaces) {
            if (airspace.country === 'germany' && airspace.group === selectedFir) {
                stationsSet.add(airspace.owner[0]);
            }
        }

        const stations: string[] = Array.from(stationsSet);
        const sortedStations = stations.sort((a, b) => a.localeCompare(b));
        setAllStations(sortedStations);

        // If the FIR changes, select the first station from the FIR
        if (!sortedStations.includes(selectedSector as string) && sortedStations.length !== 0) {
            setSelectedSector(sortedStations[0]);
        }
    }, [selectedSector, selectedFir, loading, airspaces]);

    useEffect(() => {
        const filtered = airspaces.filter(airspace => airspace.owner[0] === selectedSector);
        setDrawnAirspaces(filtered);
    }, [selectedFir, loading, airspaces, selectedSector]);

    const startContent = [
        <InputText key="InputTextSearch" type="search" placeholder={conditionSearchRange === 'ofSelectedSector' ? 'Search by sector' : 'Search all conditions'} onChange={e => setSearchInput(e.target.value)} />,
        <Divider key="DividerSearch" layout="vertical" />,
        <Button
            key="ButtonSearchRange"
            label="Filter by sector"
            style={{ paddingRight: '20px' }}
            severity={conditionSearchRange === 'ofSelectedSector' ? 'success' : 'danger'}
            icon="pi pi-filter"
            tooltip="Search all conditions or only of the selected sector"
            tooltipOptions={{ position: 'mouse' }}
            onClick={e => setConditionSearchRange(conditionSearchRange === 'all' ? 'ofSelectedSector' : 'all')}
        />,
        <Dropdown key="DropdownSelectedStation" options={allStations} value={selectedSector} onChange={e => setSelectedSector(e.value)} disabled={conditionSearchRange === 'all'} />,
        <Dropdown key="DropdownSelectedFIR" options={selectableGroups} value={selectedFir} onChange={e => setSelectedFir(e.value)} disabled={conditionSearchRange === 'all'} />,
        <Divider key="DividerStationSelection" layout="vertical" />,
        <Button
            key="ButtonFilterFromTo"
            label="Filter by"
            severity={filterFromToSector === false ? 'danger' : 'success'}
            icon="pi pi-filter"
            tooltip="Filter in- or outgoing conditions"
            tooltipOptions={{ position: 'mouse' }}
            onClick={e => setFilterFromToSector(!filterFromToSector)}
            disabled={conditionSearchRange !== 'ofSelectedSector'}
        />,
        <Dropdown
            key="DropdownFromTo"
            options={['from sector', 'to sector']}
            value={filterFromToSectorSelection}
            onChange={e => setFilterFromToSectorSelection(e.value)}
            disabled={!filterFromToSector || conditionSearchRange !== 'ofSelectedSector'}
        />,
    ];

    const endContent = [
        <Button
            key="ButtonVerticalLimits"
            label="Show vertical limits"
            severity={showVerticalLimits === true ? 'success' : 'danger'}
            icon={showVerticalLimits === true ? 'pi pi-check' : 'pi pi-times'}
            onClick={e => setShowVerticalLimits(!showVerticalLimits)}
            disabled={conditionSearchRange === 'all'}
        />,
    ];

    return (
        <>
            <div>
                <Toolbar start={startContent} end={endContent} />

                <MapContainer style={{ width: '100vw', height: '100vh', zIndex: 0 }} center={[50.026292, 8.765245]} zoom={8} maxZoom={10} minZoom={6}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {conditionSearchRange !== 'all' && <DisplayAirspaces airspaces={drawnAirspaces} showVerticalLimits={showVerticalLimits} />}
                    <Markers key={'Markers'} conditions={drawnConditions} />
                </MapContainer>
            </div>
        </>
    );
}
