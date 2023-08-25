import { WaypointRecord } from 'interfaces/waypointRecord.interface';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

interface PropsTable {
    conditions: WaypointRecord;
}

export function MapConditionTable({ conditions }: PropsTable) {
    const agreements = conditions.conditions;

    const values = agreements.map(condition => {
        return {
            id: `${condition._id}`,
            adep_ades: `${condition.adep_ades === 'ADEP' ? '\u2191' : condition.adep_ades === 'ADES' ? '\u2193' : ''}${condition.aerodrome}`,
            cop: `${condition.cop}`,
            level: `${condition.feet ? 'A' : 'FL'}
            ${condition.level}
            ${condition.xc === null ? '' : condition.xc === 'A' ? '\u2193' : '\u2191'}`,
            sc: `${condition.special_conditions}`,
            from_sector: `${condition.from_sector}`,
            to_sector: `${condition.to_sector}`,
            from_fir: `${condition.from_fir}`,
            to_fir: `${condition.to_fir}`,
        };
    });

    const hasSpecialConditions = agreements.some(condition => condition.special_conditions);

    const columns = [
        <Column key="adep_ades" field="adep_ades" header="AD" />,
        <Column key="cop" field="cop" header="COP" />,
        <Column key="level" field="level" header="Level" />,
        hasSpecialConditions && <Column key="sc" field="sc" header="Special Conditions" />,
        <Column key="from_sector" field="from_sector" header="From Sector" />,
        <Column key="to_sector" field="to_sector" header="To Sector" />,
        <Column key="from_fir" field="from_fir" header="from FIR" />,
        <Column key="to_fir" field="to_fir" header="to FIR" />,
    ];

    return (
        <>
            <DataTable className="map-table-style" value={values} style={{ textAlign: 'center', fontSize: '13px', fontWeight: 'bold', padding: '10px' }}>
                {columns}
            </DataTable>
        </>
    );
}
