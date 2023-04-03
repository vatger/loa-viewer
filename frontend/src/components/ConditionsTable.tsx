import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import conditionService from 'services/conditionService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import React from 'react';
import { FrontendCondition } from 'interfaces/condition.interface';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Password } from 'primereact/password';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import authService from 'services/authService';
import Condition from '@shared/interfaces/condition.interface';

import datafeedService from 'services/datafeedService';
import filterMappingService from 'services/filterMappingService';

const ConditionsTable = (props: any) => {
    const newEmptyCondition = {
        _id: null,
        aerodrome: '',
        adep_ades: null,
        cop: '',
        level: 0,
        feet: false,
        xc: null,
        special_conditions: '',
        from_sector: '',
        to_sector: '',
        from_fir: '',
        to_fir: '',
    };

    interface Station {
        name: string;
        code: string[];
    }

    const [conditions, setConditions] = useState<FrontendCondition[]>([]);
    const [loading, setLoading] = useState(true);
    const [addConditionDialog, setAddConditionDialog] = useState<boolean>(false);
    const [condition, setCondition] = useState<FrontendCondition>(newEmptyCondition);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [deleteConditionDialog, setDeleteConditionDialog] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [adminDialog, setAdminDialog] = useState<boolean>(false);
    const [admin, setAdmin] = useState<boolean>(false);

    const defaultValues = { value: '' };
    const form = useForm({ defaultValues });
    const errors = form.formState.errors;

    const [selectedStations, setSelectedStations] = useState<Station | null>(null);
    const stations: Station[] = [{ name: 'EDGG_KTG_CTR', code: ['KTG', 'DKB', 'STG'] }];
    const [vid, setVid] = useState<number | null>();
    const [fromSectors, setFromSectors] = useState<Object[]>([]);
    const [toSectors, setToSectors] = useState<Object[]>([]);
    const [fromFir, setFromFir] = useState<Object[]>([]);
    const [toFir, setToFir] = useState<Object[]>([]);

    const [filters, setFilters] = useState<any>();

    useEffect(() => {
        conditionService.getConditions().then((data: FrontendCondition[]) => {
            data.forEach((element: Condition) => {
                fromSectors.findIndex((sector: any) => sector.name === element.from_sector) === -1 && fromSectors.push({ name: element.from_sector, value: element.from_sector });
                toSectors.findIndex((sector: any) => sector.name === element.to_sector) === -1 && toSectors.push({ name: element.to_sector, value: element.to_sector });
                fromFir.findIndex((sector: any) => sector.name === element.from_fir) === -1 && fromFir.push({ name: element.from_fir, value: element.from_fir });
                toFir.findIndex((sector: any) => sector.name === element.to_fir) === -1 && toFir.push({ name: element.to_fir, value: element.to_fir });
            });

            fromSectors.sort(customSort);
            toSectors.sort(customSort);
            fromFir.sort(customSort);
            toFir.sort(customSort);

            setConditions(data);
            setLoading(false);
            initFilters();
        });

        authService
            .getUser()
            .then(() => {
                setAdmin(true);
            })
            .catch(e => {});
    }, []);

    function customSort(a: any, b: any) {
        let fa = a.name,
            fb = b.name;

        if (fa < fb) {
            return -1;
        }

        if (fa > fb) {
            return 1;
        }
        return 0;
    }

    const initFilters = () => {
        setGlobalFilterValue('');
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            aerodrome: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            cop: { value: null, matchMode: FilterMatchMode.CONTAINS },
            level: { value: null, matchMode: FilterMatchMode.CONTAINS },
            from_sector: { value: null, matchMode: FilterMatchMode.IN },
            to_sector: { value: null, matchMode: FilterMatchMode.IN },
            from_fir: { value: null, matchMode: FilterMatchMode.IN },
            to_fir: { value: null, matchMode: FilterMatchMode.IN },
        });
    };

    const levelTemplate = (option: any) => {
        if (option.xc === 'A') {
            return option.feet ? <>{'\u2191 ' + option.level + '00ft'}</> : <>{'\u2191 ' + option.level}</>;
        } else if (option.xc === 'B') {
            return option.feet ? <>{'\u2193 ' + option.level + '00ft'}</> : <>{'\u2193 ' + option.level}</>;
        } else {
            return option.feet ? option.level + '00ft' : option.level;
        }
    };

    const aerodromeTemplate = (option: any) => {
        if (option.adep_ades === 'ADEP') {
            return <>{'\u2197 ' + option.aerodrome}</>;
        } else if (option.adep_ades === 'ADES') {
            return <>{'\u2198 ' + option.aerodrome} </>;
        } else {
            return option.aerodrome;
        }
    };

    const adminButtonTemplate = (rowData: any) => {
        return (
            <>
                <Button className="p-button-sm mr-2" label="Edit" onClick={() => openEdit(rowData)} />
                <Button className="p-button-sm " label="Delete" onClick={() => openDelete(rowData)} />
            </>
        );
    };

    const openNew = () => {
        setCondition(newEmptyCondition);
        setSubmitted(false);
        setAddConditionDialog(true);
    };

    const openEdit = (condition: any) => {
        setCondition({ ...condition });
        setAddConditionDialog(true);
    };

    const openDelete = (condition: any) => {
        setCondition(condition);
        setDeleteConditionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAddConditionDialog(false);
    };

    const openAdminDialog = () => {
        setAdminDialog(true);
    };

    const hideAdminDialog = () => {
        setAdminDialog(false);
    };

    const onSubmit = async (data: any) => {
        try {
            await authService.loginUser({ password: data.value });

            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Form Submitted',
                life: 3000,
            });

            form.reset();
            setAdmin(true);
            setAdminDialog(false);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Wrong Password',
                detail: `${error}`,
                life: 3000,
            });
        }
    };

    const logoutUser = async () => {
        await authService.logoutUser();
        setAdmin(false);
    };

    const saveCondition = async () => {
        setSubmitted(true);

        let _conditions = [...conditions];
        let _condition = { ...condition };

        if (_condition._id !== null) {
            const index = _conditions.findIndex(element => element._id === _condition._id);

            await conditionService.updateCondition(_condition._id, _condition);

            _conditions[index] = _condition;
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Condition Updated',
                life: 3000,
            });
        } else {
            await conditionService.addCondition(_condition);
            _conditions.push(_condition);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Condition Created',
                life: 3000,
            });
        }

        setConditions(_conditions);
        //setAddConditionDialog(false);
        setCondition(newEmptyCondition);
    };

    const onInputChange = (e: any, name: 'cop' | 'aerodrome' | 'special_conditions' | 'from_sector' | 'to_sector' | 'from_fir' | 'to_fir') => {
        const val = (e.target && e.target.value) || '';
        let _condition = { ...condition };

        if (name === 'special_conditions') {
            _condition[`${name}`] = val;
        } else {
            _condition[`${name}`] = val.toUpperCase();
        }

        setCondition(_condition);
    };

    const onInputNumberChange = (e: any, name: 'level') => {
        const val = e.value || 0;
        let _condition = { ...condition };

        _condition[`${name}`] = val;

        setCondition(_condition);
    };

    const onRadioChange = (e: RadioButtonChangeEvent, name: 'xc' | 'adep_ades') => {
        let _condition = { ...condition };

        _condition[`${name}`] = e.value;
        setCondition(_condition);
    };

    const onCheckmarkChange = (e: CheckboxChangeEvent) => {
        let _condition = { ...condition };

        _condition.feet = e.checked ? true : false;
        setCondition(_condition);
    };

    const hideDeleteConditionsDialog = () => {
        setDeleteConditionDialog(false);
    };

    const deleteCondition = async () => {
        try {
            let _conditions = conditions.filter(val => val._id !== condition._id);

            await conditionService.deleteCondition(condition._id);

            setConditions(_conditions);
            setDeleteConditionDialog(false);
            setCondition(newEmptyCondition);

            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Entry Deleted',
                life: 3000,
            });
        } catch (error) {
            throw new Error('Delete unable!' + error);
        }
    };

    const deleteConditionsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteConditionsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteCondition} />
        </React.Fragment>
    );

    const conditionDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveCondition} />
        </React.Fragment>
    );

    const exportCSV = () => {
        console.log(dt.current);

        dt.current?.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" outlined onClick={openNew} className="mb-2" disabled={!admin} />
                <div className="p-inputgroup mr-2">
                    <InputNumber onValueChange={e => setVid(e.value)} useGrouping={false} placeholder="Enter CID" style={{ width: '5rem' }} />
                    <Button label="Apply" onClick={searchVid} />
                </div>
            </div>
        );
    };

    const searchVid = async () => {
        let _stationFilter = { ...filters };

        if (!vid) {
            _stationFilter['from_sector'].value = [];
            setFilters(_stationFilter);
        } else {
            try {
                const dataFeed = await datafeedService.getRawDatafeed();

                const station = dataFeed.controllers.filter(element => element.cid === vid);

                if (station.length > 0) {
                    const stationMapping: any = await filterMappingService.getFilters();

                    const filteredStation = stationMapping.filter((element: any) => element.frequency === station[0].frequency);

                    if (filteredStation.length === 0) {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'No filter preset found',
                            detail: `No filter is defined for your station`,
                            life: 3000,
                        });
                    } else {
                        _stationFilter['from_sector'].value = filteredStation[0].stationFilter;

                        setFilters(_stationFilter);
                    }
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'No Station found',
                        detail: `for the entered CID`,
                        life: 3000,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                {/* <MultiSelect value={selectedStations} onChange={(e: any) => setSelectedStations(e.value)} options={stations} optionLabel="name" placeholder="Select Stations" maxSelectedLabels={3} className="w-full md:w-20rem mr-2" /> */}
                <Button label="Export" icon="pi pi-upload" className="p-button-help mr-2" onClick={exportCSV} />
                <Button label="Admin" icon="pi pi-sliders-h" className="p-button-danger" onClick={openAdminDialog} visible={!admin} />
                <Button label="Logout" icon="pi pi-sliders-h" className="p-button-danger" onClick={logoutUser} visible={admin} />
            </>
        );
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        console.log(_filters);

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onApplyFilter = (e: any) => {
        console.log(e);
        let _filters = { ...filters };

        _filters[`${e.field}`].value = e.constraints.value;

        setFilters(_filters);
    };

    const fromSectorFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <MultiSelect value={options.value} options={fromSectors} onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)} filter optionLabel="name" placeholder="Any" className="p-column-filter" />;
    };

    const toSectorFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <MultiSelect value={options.value} options={toSectors} onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)} filter optionLabel="name" placeholder="Any" className="p-column-filter" />;
    };

    const fromFirFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <MultiSelect value={options.value} options={fromFir} onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)} filter optionLabel="name" placeholder="Any" className="p-column-filter" />;
    };

    const toFirFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <MultiSelect value={options.value} options={toFir} onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)} filter optionLabel="name" placeholder="Any" className="p-column-filter" />;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <InputText type="search" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search Airports or COPs" />
            <Button label="Reset Filters" className="p-buttonmr-2" onClick={initFilters} />
        </div>
    );

    return (
        <>
            <Card>
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    globalFilterFields={['aerodrome', 'cop']}
                    header={header}
                    ref={dt}
                    responsiveLayout="scroll"
                    value={conditions}
                    showGridlines
                    loading={loading}
                    stateStorage="local"
                    filters={filters}
                    dataKey="_id"
                    stateKey="dt-conditions"
                    size="small"
                    emptyMessage="No conditions found.">
                    <Column field="aerodrome" body={rowData => aerodromeTemplate(rowData)} header="ADEP/ADES" headerStyle={{ width: '10%' }}></Column>
                    <Column field="cop" header="COP"></Column>
                    <Column body={rowData => levelTemplate(rowData)} header="Level" field="level"></Column>
                    <Column style={{ width: '30%' }} field="special_conditions" header="Special Conditions" />
                    <Column headerStyle={{ width: '10%' }} filter filterElement={fromSectorFilterTemplate} onFilterApplyClick={e => onApplyFilter(e)} showFilterMatchModes={false} field="from_sector" header="From Sector"></Column>
                    <Column headerStyle={{ maxWidth: '10%' }} filter filterElement={toSectorFilterTemplate} onFilterApplyClick={e => onApplyFilter(e)} showFilterMatchModes={false} field="to_sector" header="To Sector"></Column>
                    <Column headerStyle={{ maxWidth: '10%' }} filter filterElement={fromFirFilterTemplate} onFilterApplyClick={e => onApplyFilter(e)} showFilterMatchModes={false} field="from_fir" header="From FIR"></Column>
                    <Column headerStyle={{ maxWidth: '10%' }} filter filterElement={toFirFilterTemplate} onFilterApplyClick={e => onApplyFilter(e)} showFilterMatchModes={false} field="to_fir" header="To FIR"></Column>
                    <Column header="Admin" body={adminButtonTemplate} align="center" hidden={!admin} />
                </DataTable>
            </Card>
            <Dialog visible={addConditionDialog} style={{ width: '48rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Condition Details" modal className="p-fluid" footer={conditionDialogFooter} onHide={hideDialog}>
                <div className="formgrid grid">
                    <div className="field col-6">
                        <label htmlFor="aerodromes" className="font-bold">
                            Aerodromes
                        </label>
                        <InputText id="aerodromes" placeholder="ICAO, ICAO, ... etc." value={condition.aerodrome} onChange={e => onInputChange(e, 'aerodrome')} autoFocus />
                    </div>

                    <div className="field col-6">
                        <label className="font-bold">ADEP/ADES</label>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex align-items-center">
                                <RadioButton inputId="adep" name="adep" value="ADEP" onChange={e => onRadioChange(e, 'adep_ades')} checked={condition.adep_ades === 'ADEP'} />
                                <label htmlFor="adep" className="ml-2">
                                    Departure
                                </label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="ades" name="ades" value="ADES" onChange={e => onRadioChange(e, 'adep_ades')} checked={condition.adep_ades === 'ADES'} />
                                <label htmlFor="ades" className="ml-2">
                                    Destination
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col-2">
                        <label htmlFor="cop" className="font-bold">
                            COP
                        </label>
                        <InputText id="cop" value={condition.cop} onChange={e => onInputChange(e, 'cop')} />
                    </div>
                    <div className="field col-3">
                        <label htmlFor="level" className="font-bold">
                            Level
                        </label>
                        <div className="p-inputgroup">
                            <InputNumber id="level" value={condition.level} useGrouping={false} onChange={e => onInputNumberChange(e, 'level')} />
                            <span className="p-inputgroup-addon">
                                <Checkbox id="feet" checked={condition.feet} onChange={e => onCheckmarkChange(e)} />
                                <label htmlFor="feet" className="ml-2">
                                    is feet
                                </label>
                            </span>
                        </div>
                    </div>
                    <div className="field col-6">
                        <label className="font-bold">Crossing Condition</label>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex align-items-center">
                                <RadioButton inputId="climbing" name="xc" value="A" onChange={e => onRadioChange(e, 'xc')} checked={condition.xc === 'A'} />
                                <label htmlFor="climbing" className="ml-2">
                                    Climbing
                                </label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="descending" name="xc" value="B" onChange={e => onRadioChange(e, 'xc')} checked={condition.xc === 'B'} />
                                <label htmlFor="descending" className="ml-2">
                                    Descending
                                </label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="none" name="xc" value={null} onChange={e => onRadioChange(e, 'xc')} checked={condition.xc === null} />
                                <label htmlFor="none" className="ml-2">
                                    At level
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="special_conditions" className="font-bold">
                        Special Conditions
                    </label>
                    <InputTextarea id="special_conditions" value={condition.special_conditions} onChange={e => onInputChange(e, 'special_conditions')} required rows={3} cols={20} />
                </div>

                <div className="formgrid grid">
                    <div className="field col-6">
                        <label htmlFor="from_sector" className="font-bold">
                            From Sector
                        </label>
                        <InputText id="from_sector" placeholder="ex. GIN" value={condition.from_sector} onChange={e => onInputChange(e, 'from_sector')} />
                    </div>
                    <div className="field col-6">
                        <label htmlFor="to_sector" className="font-bold">
                            To Sector
                        </label>
                        <InputText id="to_sector" placeholder="ex. FUL" value={condition.to_sector} onChange={e => onInputChange(e, 'to_sector')} />
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col-6">
                        <label htmlFor="from_fir" className="font-bold">
                            From FIR
                        </label>
                        <InputText id="from_fir" placeholder="ex. EDGG" value={condition.from_fir} onChange={e => onInputChange(e, 'from_fir')} />
                    </div>
                    <div className="field col-6">
                        <label htmlFor="to_fir" className="font-bold">
                            To FIR
                        </label>
                        <InputText id="to_fir" placeholder="ex. EDUU" value={condition.to_fir} onChange={e => onInputChange(e, 'to_fir')} />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteConditionDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteConditionsDialogFooter} onHide={hideDeleteConditionsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {condition && <span>Are you sure you want to delete the selected Condition?</span>}
                </div>
            </Dialog>
            <Dialog visible={adminDialog} onHide={hideAdminDialog}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-column gap-2">
                    <Controller
                        name="value"
                        control={form.control}
                        rules={{ required: 'Password is required.' }}
                        render={({ field, fieldState }) => (
                            <>
                                <label
                                    htmlFor={field.name}
                                    className={classNames({
                                        'p-error': errors.value,
                                    })}>
                                    Password
                                </label>
                                <Password
                                    id={field.name}
                                    {...field}
                                    inputRef={field.ref}
                                    className={classNames({
                                        'p-invalid': fieldState.error,
                                    })}
                                    feedback={false}
                                />
                                {/* {getFormErrorMessage(field.name)} */}
                            </>
                        )}
                    />
                    <Button label="Submit" type="submit" icon="pi pi-check" />
                </form>
            </Dialog>
            <Toast ref={toast} />
        </>
    );
};

export default ConditionsTable;
