import React, { useState, useEffect } from 'react';
import { ISettings } from '../Simulator';
import { useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import SettingsInputField from './SettingsInputField';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Currency from './Currency';
import { parse } from '../utils';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PercentField from './PercentField';

type CallbackFunction = (input: ISettings) => void;
interface SettingsInput {
    defaults: ISettings;
    onSettingsChange: CallbackFunction;
}

interface SaveModel {
    name: string;
    value: ISettings;
}

export const Settings = (props: SettingsInput) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getSettingsValue = (key: string, defaultValue: number): number => {
        if (searchParams.has(key)) {
            return parseInt(searchParams.get(key) as string);
        }
        return defaultValue;
    };

    let { defaults, onSettingsChange } = props;

    const [saveName, setSaveName] = useState<string>('');
    const [selectedSave, setSelectedSave] = useState<string | null>(null);
    const [saves, setSaves] = useState<SaveModel[]>([
        {
            name: 'Default',
            value: defaults,
        },
    ]);

    const [downPaymentValue, setDownPaymentValue] = useState(0);
    const [totalClosing, setTotalClosing] = useState(0);

    const [purchasePrice, setPurchasePrice] = useState<number>(getSettingsValue('PurchasePrice', defaults.PurchasePrice));
    const [landValuePtc, setLandValuePtc] = useState<number>(getSettingsValue('LandValuePtc', defaults.LandValuePtc));
    const [downPaymentPtc, setDownPaymentPtc] = useState<number>(getSettingsValue('DownPaymentPtc', defaults.DownPaymentPtc));
    const [loanFees, setLoanFees] = useState<number>(getSettingsValue('LoanFee', defaults.LoanFee));
    const [escrowPtc, setEscrowPtc] = useState<number>(getSettingsValue('EscrowPtc', defaults.EscrowPtc));
    const [loanRatePtc, setLoanRatePtc] = useState<number>(getSettingsValue('LoanPtc', defaults.LoanPtc));
    const [loanTerm, setLoanTerm] = useState<number>(getSettingsValue('LoanTerms', defaults.LoanTerms));
    const [rentIncome, setRentIncome] = useState<number>(getSettingsValue('RentIncome', defaults.RentIncome));
    const [remodelCost, setRemodelCost] = useState<number>(getSettingsValue('RemodelCost', defaults.RemodelCost));
    const [remodelValueIncrease, setRemodelValueIncrease] = useState<number>(getSettingsValue('RemodelValueIncrease', defaults.RemodelValueIncrease));
    const [managementFeePtc, setManagementFeePtc] = useState<number>(getSettingsValue('ManagementFeePtc', defaults.ManagementFeePtc));
    const [maintenanceCostPtc, setMaintenanceCostPtc] = useState<number>(getSettingsValue('MaintenanceCostPtc', defaults.MaintenanceCostPtc));
    const [taxRatePtc, setTaxRatePtc] = useState<number>(getSettingsValue('TaxRatePtc', defaults.TaxRatePtc));
    const [propertyTaxPtc, setPropertyTaxPtc] = useState<number>(getSettingsValue('PropertyTaxPtc', defaults.PropertyTaxPtc));
    const [vacancyRatePtc, setVacancyRatePtc] = useState<number>(getSettingsValue('VacancyRatePtc', defaults.VacancyRatePtc));
    const [annualAppreciationPtc, setAnnualAppreciationPtc] = useState<number>(getSettingsValue('AnnualAppreciationPtc', defaults.AnnualAppreciationPtc));
    const [annualRentIncreasePtc, setAnnualRentIncreasePtc] = useState<number>(getSettingsValue('AnnualRentPtc', defaults.AnnualRentPtc));
    const [annualUtilities, setAnnualUtilities] = useState<number>(getSettingsValue('AnnualUtilities', defaults.AnnualUtilities));
    const [annualInsurance, setAnnualInsurance] = useState<number>(getSettingsValue('AnnualInsurance', defaults.AnnualInsurance));
    const [annualOtherCosts, setAnnualOtherCosts] = useState<number>(getSettingsValue('AnnualOtherCost', defaults.AnnualOtherCost));
    const [salesFeesPtc, setSalesFeesPtc] = useState<number>(getSettingsValue('SalesFeesPtc', defaults.SalesFeesPtc));

    const onSubmit = (e: any) => {
        e.preventDefault();
        handelCalculate();
    };

    const getObjectFromValue = (): ISettings => {
        return {
            PurchasePrice: purchasePrice,
            LandValuePtc: landValuePtc,
            DownPaymentPtc: downPaymentPtc,
            LoanFee: loanFees,
            EscrowPtc: escrowPtc,
            LoanPtc: loanRatePtc,
            LoanTerms: loanTerm,
            RentIncome: rentIncome,
            RemodelCost: remodelCost,
            RemodelValueIncrease: remodelValueIncrease,
            ManagementFeePtc: managementFeePtc,
            MaintenanceCostPtc: maintenanceCostPtc,
            TaxRatePtc: taxRatePtc,
            PropertyTaxPtc: propertyTaxPtc,
            VacancyRatePtc: vacancyRatePtc,
            AnnualAppreciationPtc: annualAppreciationPtc,
            AnnualRentPtc: annualRentIncreasePtc,
            AnnualUtilities: annualUtilities,
            AnnualInsurance: annualInsurance,
            AnnualOtherCost: annualOtherCosts,
            SalesFeesPtc: salesFeesPtc,
        };
    };

    const saveSaves = (savesToSave: any) => {
        if (savesToSave.length > 0) {
            setSelectedSave(savesToSave[0].name);
            sessionStorage.setItem('saves', JSON.stringify(savesToSave));
        }
    };

    const loadSelected = () => {
        if (!selectedSave) return;
        let save = saves.find((s) => s.name === selectedSave);
        if (save) {
            setPurchasePrice(save.value.PurchasePrice);
            setLandValuePtc(save.value.LandValuePtc);
            setDownPaymentPtc(save.value.DownPaymentPtc);
            setLoanFees(save.value.LoanFee);
            setEscrowPtc(save.value.EscrowPtc);
            setLoanRatePtc(save.value.LoanPtc);
            setLoanTerm(save.value.LoanTerms);
            setRentIncome(save.value.RentIncome);
            setRemodelCost(save.value.RemodelCost);
            setRemodelValueIncrease(save.value.RemodelValueIncrease);
            setManagementFeePtc(save.value.ManagementFeePtc);
            setMaintenanceCostPtc(save.value.MaintenanceCostPtc);
            setTaxRatePtc(save.value.TaxRatePtc);
            setPropertyTaxPtc(save.value.PropertyTaxPtc);
            setVacancyRatePtc(save.value.VacancyRatePtc);
            setAnnualAppreciationPtc(save.value.AnnualAppreciationPtc);
            setAnnualRentIncreasePtc(save.value.AnnualRentPtc);
            setAnnualUtilities(save.value.AnnualUtilities);
            setAnnualInsurance(save.value.AnnualInsurance);
            setAnnualOtherCosts(save.value.AnnualOtherCost);
            setSalesFeesPtc(save.value.SalesFeesPtc);
        }
    };

    const handelCalculate = () => {
        onSettingsChange(getObjectFromValue());
    };

    const saveSettings = () => {
        if (!saveName || saveName === '') {
            return;
        }

        let settings = {
            name: saveName,
            value: getObjectFromValue(),
        };
        let newSaves = [...saves.filter((s) => s.name.toLowerCase() !== settings.name.toLowerCase()), settings];
        setSaves(newSaves);
        saveSaves(newSaves);
    };

    const deleteSelected = () => {
        if (!selectedSave) return;
        let newSaves = saves.filter((s) => s.name !== selectedSave);
        setSaves(newSaves);
        saveSaves(newSaves);
    };

    useEffect(() => {
        // Loading saves
        if (!selectedSave && saves.length > 0) {
            setSelectedSave(saves[0].name);
            return;
        }
    }, [saves]);

    useEffect(() => {
        // Loading saves
        if (sessionStorage.getItem('saves')) {
            setSaves(JSON.parse(sessionStorage.getItem('saves') as string));
        }
    }, []);

    useEffect(() => {
        if (purchasePrice === undefined || downPaymentPtc === undefined) {
            console.log('No purchase price or down payment', purchasePrice, downPaymentPtc);
            setDownPaymentValue(0);
            return;
        }
        setDownPaymentValue(purchasePrice * downPaymentPtc);
    }, [downPaymentPtc, purchasePrice]);

    useEffect(() => {
        if (purchasePrice === undefined || downPaymentPtc === undefined) {
            setTotalClosing(0);
            return;
        }
        setTotalClosing(purchasePrice * downPaymentPtc + loanFees + purchasePrice * escrowPtc + remodelCost);
    }, [purchasePrice, downPaymentPtc, loanFees, escrowPtc, remodelCost]);

    const navigate = useNavigate();
    useEffect(() => {
        const options = {
            pathname: '/',
            search: `?${createSearchParams(getObjectFromValue() as any)}`,
        };
        navigate(options, { replace: true });
    }, [
        purchasePrice,
        landValuePtc,
        downPaymentPtc,
        loanFees,
        escrowPtc,
        loanRatePtc,
        loanTerm,
        rentIncome,
        remodelCost,
        remodelValueIncrease,
        managementFeePtc,
        maintenanceCostPtc,
        taxRatePtc,
        propertyTaxPtc,
        vacancyRatePtc,
        annualAppreciationPtc,
        annualRentIncreasePtc,
        annualUtilities,
        annualInsurance,
        annualOtherCosts,
        salesFeesPtc,
    ]);

    return (
        <form onSubmit={onSubmit}>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ padding: 2 }}>
                    <Stack spacing={2}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography gutterBottom variant="h5" component="div">
                                    Settings
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider variant="middle" />
                        <SettingsInputField
                            fieldValue={purchasePrice}
                            onChange={setPurchasePrice}
                            fieldName="purchasePrice"
                            fieldLable="Purchase Price"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <PercentField value={landValuePtc} onChanged={setLandValuePtc} label="Land Value %" name="landValuePtc" />
                        <SettingsInputField
                            fieldValue={downPaymentPtc}
                            onChange={setDownPaymentPtc}
                            fieldName="downPaymentPtc"
                            fieldLable="Down payment"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <Divider variant="middle" />
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography gutterBottom variant="h5" component="div">
                                    Down payment:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography gutterBottom variant="h6" component="div">
                                    <Currency value={downPaymentValue} prefix="$" />
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider variant="middle" />
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography gutterBottom variant="h5" component="div">
                                    Closing costs
                                </Typography>
                            </Grid>
                        </Grid>
                        <SettingsInputField
                            fieldValue={loanFees}
                            onChange={setLoanFees}
                            fieldName="loanFees"
                            fieldLable="Loan Fees"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <PercentField value={escrowPtc} onChanged={setEscrowPtc} label="Escrow Fees" name="escrowFeesPtc" />

                        <SettingsInputField
                            fieldValue={remodelCost}
                            onChange={setRemodelCost}
                            fieldName="remodelCost"
                            fieldLable="Remodeling Cost"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={remodelValueIncrease}
                            onChange={setRemodelValueIncrease}
                            fieldName="remodelValueIncrease"
                            fieldLable="Remodeling value increase"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <Divider variant="middle" />
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography gutterBottom variant="h5" component="div">
                                    Total Closing:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography gutterBottom variant="h6" component="div">
                                    <Currency value={totalClosing} prefix="$" />
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider variant="middle" />
                        <PercentField value={loanRatePtc} onChanged={setLoanRatePtc} label="Loan Rate" name="loanRatePtc" />

                        <SettingsInputField
                            fieldValue={loanTerm}
                            onChange={setLoanTerm}
                            fieldName="loanTerms"
                            fieldLable="Loan Terms"
                            surfix="months"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={rentIncome}
                            onChange={setRentIncome}
                            fieldName="rentIncome"
                            fieldLable="Rent Income"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <PercentField value={managementFeePtc} onChanged={setManagementFeePtc} label="Management Fee" name="managementFeePtc" />
                        <PercentField value={maintenanceCostPtc} onChanged={setMaintenanceCostPtc} label="Maintenance Cost" name="maintenanceCostPtc" />
                        <PercentField value={taxRatePtc} onChanged={setTaxRatePtc} label="Tax Rate" name="taxRatePtc" />
                        <PercentField value={propertyTaxPtc} onChanged={setPropertyTaxPtc} label="Property Tax" name="propertyTaxPtc" />
                        <PercentField value={vacancyRatePtc} onChanged={setVacancyRatePtc} label="Vacancy rate" name="vacancyRatePtc" />
                        <PercentField
                            value={annualAppreciationPtc}
                            onChanged={setAnnualAppreciationPtc}
                            label="Annual appreciation increase"
                            name="annualAppreciationPtc"
                        />
                        <PercentField
                            value={annualRentIncreasePtc}
                            onChanged={setAnnualRentIncreasePtc}
                            label="Annual rent increase"
                            name="annualRentIncreasePtc"
                        />

                        <SettingsInputField
                            fieldValue={annualUtilities}
                            onChange={setAnnualUtilities}
                            fieldName="annualUtilities"
                            fieldLable="Annual utilities"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={annualInsurance}
                            onChange={setAnnualInsurance}
                            fieldName="annualInsurance"
                            fieldLable="Annual insurance"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={annualOtherCosts}
                            onChange={setAnnualOtherCosts}
                            fieldName="annualOtherCosts"
                            fieldLable="Annual other costs"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <PercentField value={salesFeesPtc} onChanged={setSalesFeesPtc} label="Sales Fee" name="salesFeesPtc" />
                        <Button variant="contained" type="submit">
                            Calculate
                        </Button>
                    </Stack>
                </Paper>
                <Paper style={{ marginTop: '8px' }}>
                    <Stack spacing={2} sx={{ p: 2 }}>
                        <Typography variant="h5">Save</Typography>
                        <TextField id="save-settings" label="Save settings" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
                        <Button variant="contained" onClick={saveSettings}>
                            Save
                        </Button>
                    </Stack>
                </Paper>
                {saves && saves.length > 0 && selectedSave && (
                    <Paper style={{ marginTop: '8px' }}>
                        <Stack spacing={2} sx={{ p: 2 }}>
                            <Select id="load-settings" label="Load settings" value={selectedSave} onChange={(e) => setSelectedSave(e.target.value)}>
                                {saves.map((option) => (
                                    <MenuItem key={option.name} value={option.name}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button variant="contained" onClick={loadSelected}>
                                Load
                            </Button>
                            <Button variant="contained" onClick={deleteSelected}>
                                Delete
                            </Button>
                        </Stack>
                    </Paper>
                )}
            </Box>
        </form>
    );
};
