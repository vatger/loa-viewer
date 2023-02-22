import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import {
    DataTable,
    DataTableFilterMeta,
    DataTableRowEditCompleteEvent,
} from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import conditionService from 'services/conditionService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import React from 'react';
import { FrontendCondition } from 'interfaces/condition.interface';
import { Toast } from 'primereact/toast';

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

    const [conditions, setConditions] = useState<FrontendCondition[]>([]);
    const [loading, setLoading] = useState(true);
    const [addConditionDialog, setAddConditionDialog] =
        useState<boolean>(false);
    const [condition, setCondition] =
        useState<FrontendCondition>(newEmptyCondition);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [deleteConditionDialog, setDeleteConditionDialog] =
        useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        aerodrome: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        cop: { value: null, matchMode: FilterMatchMode.CONTAINS },
        level: { value: null, matchMode: FilterMatchMode.CONTAINS },
        from_sector: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        to_sector: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        from_fir: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        to_fir: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
    });

    useEffect(() => {
        conditionService.getConditions().then((data: any[]) => {
            setConditions(data);
            setLoading(false);
        });
    }, []);

    const levelTemplate = (option: any) => {
        if (option.xc === 'A') {
            return <>{'\u2191 ' + option.level}</>;
        } else if (option.xc === 'B') {
            return <>{'\u2193 ' + option.level} </>;
        } else {
            return option.level;
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
                <Button
                    className="p-button-sm mr-2"
                    label="Edit"
                    onClick={() => openEdit(rowData)}
                />
                <Button
                    className="p-button-sm "
                    label="Delete"
                    onClick={() => openDelete(rowData)}
                />
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

    const saveCondition = async () => {
        setSubmitted(true);

        let _conditions = [...conditions];
        let _condition = { ...condition };

        if (_condition._id !== null) {
            const index = _conditions.findIndex(
                element => element._id === _condition._id
            );

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
        setAddConditionDialog(false);
        setCondition(newEmptyCondition);
    };

    const onInputChange = (
        e: any,
        name:
            | 'cop'
            | 'aerodrome'
            | 'special_conditions'
            | 'from_sector'
            | 'to_sector'
            | 'from_fir'
            | 'to_fir'
    ) => {
        const val = (e.target && e.target.value) || '';
        let _condition = { ...condition };

        _condition[`${name}`] = val;

        setCondition(_condition);
    };

    const onInputNumberChange = (e: any, name: 'level') => {
        const val = e.value || 0;
        let _condition = { ...condition };

        _condition[`${name}`] = val;

        setCondition(_condition);
    };

    const onRadioChange = (
        e: RadioButtonChangeEvent,
        name: 'xc' | 'adep_ades'
    ) => {
        let _condition = { ...condition };

        _condition[`${name}`] = e.value;
        setCondition(_condition);
    };

    const onCheckmarkChange = (e: CheckboxChangeEvent) => {
        let _condition = { ...condition };

        _condition.feet = e.checked ?? false;
        setCondition(_condition);
    };

    const hideDeleteConditionsDialog = () => {
        setDeleteConditionDialog(false);
    };

    const deleteCondition = async () => {
        try {
            let _conditions = conditions.filter(
                val => val._id !== condition._id
            );

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
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteConditionsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteCondition}
            />
        </React.Fragment>
    );

    const conditionDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
            />
            <Button label="Save" icon="pi pi-check" onClick={saveCondition} />
        </React.Fragment>
    );

    return (
        <>
            <Card header="LoA">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    outlined
                    onClick={openNew}
                    className="mb-2"
                />
                <DataTable
                    responsiveLayout="scroll"
                    value={conditions}
                    showGridlines
                    loading={loading}
                    stateStorage="local"
                    filters={filters}
                    dataKey="_id"
                    stateKey="dt-conditions"
                    emptyMessage="No conditions found.">
                    <Column
                        filter
                        filterField="aerodrome"
                        body={rowData => aerodromeTemplate(rowData)}
                        header="ADEP/ADES"
                        headerStyle={{ width: '10%' }}></Column>
                    <Column field="cop" header="COP"></Column>
                    <Column
                        body={rowData => levelTemplate(rowData)}
                        header="Level"
                        field="level"></Column>
                    <Column
                        style={{ width: '30%' }}
                        field="special_conditions"
                        header="Special Conditions"
                    />
                    <Column
                        headerStyle={{ width: '10%' }}
                        filter
                        field="from_sector"
                        header="From Sector"></Column>
                    <Column
                        headerStyle={{ maxWidth: '10%' }}
                        filter
                        field="to_sector"
                        header="To Sector"></Column>
                    <Column
                        headerStyle={{ maxWidth: '10%' }}
                        filter
                        field="from_fir"
                        header="From FIR"></Column>
                    <Column
                        headerStyle={{ maxWidth: '10%' }}
                        filter
                        field="to_fir"
                        header="To FIR"></Column>
                    <Column
                        header="Admin"
                        body={adminButtonTemplate}
                        align="center"
                    />
                </DataTable>
            </Card>
            <Dialog
                visible={addConditionDialog}
                style={{ width: '48rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Condition Details"
                modal
                className="p-fluid"
                footer={conditionDialogFooter}
                onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="aerodromes" className="font-bold">
                        Aerodromes
                    </label>
                    <InputText
                        id="aerodromes"
                        placeholder="ICAO, ICAO, ... etc."
                        value={condition.aerodrome}
                        onChange={e => onInputChange(e, 'aerodrome')}
                    />
                </div>
                <div className="field">
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="adep"
                                name="adep"
                                value="ADEP"
                                onChange={e => onRadioChange(e, 'adep_ades')}
                                checked={condition.adep_ades === 'ADEP'}
                            />
                            <label htmlFor="adep" className="ml-2">
                                Departure
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="adep"
                                name="ades"
                                value="ADES"
                                onChange={e => onRadioChange(e, 'adep_ades')}
                                checked={condition.adep_ades === 'ADES'}
                            />
                            <label htmlFor="ades" className="ml-2">
                                Destination
                            </label>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="cop" className="font-bold">
                        COP
                    </label>
                    <InputText
                        id="cop"
                        value={condition.cop}
                        onChange={e => onInputChange(e, 'cop')}
                        autoFocus
                    />
                </div>
                <div className="field">
                    <label htmlFor="level" className="font-bold">
                        Level
                    </label>
                    <div className="p-inputgroup">
                        <InputNumber
                            id="level"
                            value={condition.level}
                            onChange={e => onInputNumberChange(e, 'level')}
                            autoFocus
                        />
                        <span className="p-inputgroup-addon">
                            <Checkbox
                                id="feet"
                                checked={condition.feet}
                                onChange={e => onCheckmarkChange(e)}
                            />
                            <label htmlFor="feet" className="ml-2">
                                is feet
                            </label>
                        </span>
                    </div>
                </div>
                <div className="field">
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="climbing"
                                name="xc"
                                value="A"
                                onChange={e => onRadioChange(e, 'xc')}
                                checked={condition.xc === 'A'}
                            />
                            <label htmlFor="climbing" className="ml-2">
                                Climbing
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="descending"
                                name="xc"
                                value="B"
                                onChange={e => onRadioChange(e, 'xc')}
                                checked={condition.xc === 'B'}
                            />
                            <label htmlFor="descending" className="ml-2">
                                Descending
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="none"
                                name="xc"
                                value={null}
                                onChange={e => onRadioChange(e, 'xc')}
                                checked={condition.xc === null}
                            />
                            <label htmlFor="none" className="ml-2">
                                At level
                            </label>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="special_conditions" className="font-bold">
                        Special Conditions
                    </label>
                    <InputTextarea
                        id="special_conditions"
                        value={condition.special_conditions}
                        onChange={e => onInputChange(e, 'special_conditions')}
                        required
                        rows={3}
                        cols={20}
                    />
                </div>
                <div className="field">
                    <label htmlFor="from_sector" className="font-bold">
                        From Sector
                    </label>
                    <InputText
                        id="from_sector"
                        value={condition.from_sector}
                        onChange={e => onInputChange(e, 'from_sector')}
                    />
                </div>
                <div className="field">
                    <label htmlFor="to_sector" className="font-bold">
                        To Sector
                    </label>
                    <InputText
                        id="to_sector"
                        value={condition.to_sector}
                        onChange={e => onInputChange(e, 'to_sector')}
                    />
                </div>
                <div className="field">
                    <label htmlFor="from_fir" className="font-bold">
                        From FIR
                    </label>
                    <InputText
                        id="from_fir"
                        value={condition.from_fir}
                        onChange={e => onInputChange(e, 'from_fir')}
                    />
                </div>
                <div className="field">
                    <label htmlFor="to_fir" className="font-bold">
                        To FIR
                    </label>
                    <InputText
                        id="to_fir"
                        value={condition.to_fir}
                        onChange={e => onInputChange(e, 'to_fir')}
                    />
                </div>
            </Dialog>

            <Dialog
                visible={deleteConditionDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={deleteConditionsDialogFooter}
                onHide={hideDeleteConditionsDialog}>
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: '2rem' }}
                    />
                    {condition && (
                        <span>
                            Are you sure you want to delete the selected
                            Condition?
                        </span>
                    )}
                </div>
            </Dialog>
            <Toast ref={toast} />
        </>
    );
};

export default ConditionsTable;
