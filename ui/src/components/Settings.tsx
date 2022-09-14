import React, { useState, useEffect, FunctionComponent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { ISettings } from '../Simulator';
import TextField from '@mui/material/TextField';
import SettingsInputField from './SettingsInputField';
import CurrencyFormat from 'react-currency-format';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

type CallbackFunction = (input: ISettings) => void;
interface SettingsInput {
    defaults?: ISettings;
    onSettingsChange: CallbackFunction;
}
export const Settings = (args: SettingsInput) => {
    const [downPaymentValue, setDownPaymentValue] = useState(0);
    const [totalClosing, setTotalClosing] = useState(0);
    const [canSubmit, setCanSubmit] = useState(false);

    let defaults = args.defaults;
    console.log('Defaults:', defaults);

    const [purchasePrice, setPurchasePrice] = useState<string>(defaults ? defaults.PurchasePrice.toString() : '');
    const [landValuePtc, setLandValuePtc] = useState<string>(defaults ? defaults.LandValuePtc.toString() : '');
    const [downPaymentPtc, setDownPaymentPtc] = useState<string>(defaults ? (defaults.DownPaymentPtc * 100).toString() : '');
    const [loanFees, setLoanFees] = useState<string>(defaults ? defaults.LoanFee.toString() : '');
    const [escrowPtc, setEscrowPtc] = useState<string>(defaults ? (defaults.EscrowPtc * 100).toString() : '');
    const [loanRatePtc, setLoanRatePtc] = useState<string>(defaults ? (defaults.LoanPtc * 100).toString() : '');
    const [loanTerm, setLoanTerm] = useState<string>(defaults ? defaults.LoanTerms.toString() : '');
    const [rentIncome, setRentIncome] = useState<string>(defaults ? defaults.RentIncome.toString() : '');
    const [remodelCost, setRemodelCost] = useState<string>(defaults ? defaults.RemodelCost.toString() : '');
    const [remodelValueIncrease, setRemodelValueIncrease] = useState<string>(defaults ? defaults.RemodelValueIncrease.toString() : '');
    const [managementFeePtc, setManagementFeePtc] = useState<string>(defaults ? (defaults.ManagementFeePtc * 100).toString() : '');
    const [maintenanceCostPtc, setMaintenanceCostPtc] = useState<string>(defaults ? (defaults.MaintenanceCostPtc * 100).toString() : '');
    const [taxRatePtc, setTaxRatePtc] = useState<string>(defaults ? (defaults.TaxRatePtc * 100).toString() : '');
    const [propertyTaxPtc, setPropertyTaxPtc] = useState<string>(defaults ? (defaults.PropertyTaxPtc * 100).toString() : '');
    const [vacancyRatePtc, setVacancyRatePtc] = useState<string>(defaults ? (defaults.VacancyRatePtc * 100).toString() : '');
    const [annualAppreciationPtc, setAnnualAppreciationPtc] = useState<string>(defaults ? (defaults.AnnualAppreciationPtc * 100).toString() : '');
    const [annualRentIncreasePtc, setAnnualRentIncreasePtc] = useState<string>(defaults ? (defaults.AnnualRentPtc * 100).toString() : '');
    const [annualUtilities, setAnnualUtilities] = useState<string>(defaults ? defaults.AnnualUtilities.toString() : '');
    const [annualInsurance, setAnnualInsurance] = useState<string>(defaults ? defaults.AnnualInsurance.toString() : '');
    const [annualOtherCosts, setAnnualOtherCosts] = useState<string>(defaults ? defaults.AnnualOtherCost.toString() : '');
    const [salesFeesPtc, setSalesFeesPtc] = useState<string>(defaults ? (defaults.SalesFeesPtc * 100).toString() : '');

    const parse = (v: string): number => {
        if (Number(v.replace(/,/g, '')) === NaN) {
            return 0;
        }
        return parseFloat(v.replace(/,/g, ''));
    };

    React.useEffect(() => {
        if (purchasePrice === '' || downPaymentPtc === '') {
            setDownPaymentValue(0);
        }
        setDownPaymentValue(parse(purchasePrice) * (parse(downPaymentPtc) / 100.0));
    }, [downPaymentPtc, purchasePrice]);

    React.useEffect(() => {
        if (purchasePrice === '' || downPaymentPtc === '') {
            setTotalClosing(0);
        }
        setTotalClosing(
            parse(purchasePrice) * (parse(downPaymentPtc) / 100.0) + parse(loanFees) + parse(purchasePrice) * (parse(escrowPtc) / 100.0) + parse(remodelCost)
        );
    }, [purchasePrice, downPaymentPtc, loanFees, escrowPtc, remodelCost]);

    React.useEffect(() => {
        setCanSubmit(
            purchasePrice.length > 0 &&
                parse(purchasePrice) > 0 &&
                downPaymentPtc.length > 0 &&
                parse(downPaymentPtc) > 0 &&
                loanFees.length > 0 &&
                parse(loanFees) > 0 &&
                escrowPtc.length > 0 &&
                parse(escrowPtc) > 0 &&
                loanRatePtc.length > 0 &&
                parse(loanRatePtc) > 0 &&
                loanTerm.length > 0 &&
                parse(loanTerm) > 0 &&
                rentIncome.length > 0 &&
                parse(rentIncome) > 0 &&
                remodelCost.length > 0 &&
                parse(remodelCost) > 0 &&
                remodelValueIncrease.length > 0 &&
                parse(remodelValueIncrease) > 0 &&
                managementFeePtc.length > 0 &&
                parse(managementFeePtc) > 0 &&
                maintenanceCostPtc.length > 0 &&
                parse(maintenanceCostPtc) > 0 &&
                taxRatePtc.length > 0 &&
                parse(taxRatePtc) > 0 &&
                propertyTaxPtc.length > 0 &&
                parse(propertyTaxPtc) > 0 &&
                vacancyRatePtc.length > 0 &&
                parse(vacancyRatePtc) > 0 &&
                annualAppreciationPtc.length > 0 &&
                parse(annualAppreciationPtc) > 0 &&
                annualRentIncreasePtc.length > 0 &&
                parse(annualRentIncreasePtc) > 0 &&
                annualUtilities.length > 0 &&
                parse(annualUtilities) > 0 &&
                annualInsurance.length > 0 &&
                parse(annualInsurance) > 0 &&
                annualOtherCosts.length > 0 &&
                parse(annualOtherCosts) > 0 &&
                salesFeesPtc.length > 0 &&
                parse(salesFeesPtc) > 0
        );
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

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (!canSubmit) {
            return;
        }

        args.onSettingsChange({
            PurchasePrice: parse(purchasePrice),
            LandValuePtc: parse(landValuePtc) / 100,
            DownPaymentPtc: parse(downPaymentPtc) / 100,
            LoanFee: parse(loanFees),
            EscrowPtc: parse(escrowPtc) / 100,
            LoanPtc: parse(loanRatePtc) / 100,
            LoanTerms: parse(loanTerm),
            RentIncome: parse(rentIncome),
            RemodelCost: parse(remodelCost),
            RemodelValueIncrease: parse(remodelValueIncrease) / 100,
            ManagementFeePtc: parse(managementFeePtc) / 100,
            MaintenanceCostPtc: parse(maintenanceCostPtc) / 100,
            TaxRatePtc: parse(taxRatePtc) / 100,
            PropertyTaxPtc: parse(propertyTaxPtc) / 100,
            VacancyRatePtc: parse(vacancyRatePtc) / 100,
            AnnualAppreciationPtc: parse(annualAppreciationPtc) / 100,
            AnnualRentPtc: parse(annualRentIncreasePtc) / 100,
            AnnualUtilities: parse(annualUtilities),
            AnnualInsurance: parse(annualInsurance),
            AnnualOtherCost: parse(annualOtherCosts),
            SalesFeesPtc: parse(salesFeesPtc) / 100,
        });
    };

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
                            setFieldValue={setPurchasePrice}
                            fieldName="purchasePrice"
                            fieldLable="Purchase Price"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={landValuePtc}
                            setFieldValue={setLandValuePtc}
                            fieldName="landValuePtc"
                            fieldLable="Land value"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={downPaymentPtc}
                            setFieldValue={setDownPaymentPtc}
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
                                    <CurrencyFormat
                                        value={downPaymentValue}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
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
                            setFieldValue={setLoanFees}
                            fieldName="loanFees"
                            fieldLable="Loan Fees"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={escrowPtc}
                            setFieldValue={setEscrowPtc}
                            fieldName="escrowFeesPtc"
                            fieldLable="Escrow Fees"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={remodelCost}
                            setFieldValue={setRemodelCost}
                            fieldName="remodelCost"
                            fieldLable="Remodeling Cost"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={remodelValueIncrease}
                            setFieldValue={setRemodelValueIncrease}
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
                                    <CurrencyFormat
                                        value={totalClosing}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider variant="middle" />
                        <SettingsInputField
                            fieldValue={loanRatePtc}
                            setFieldValue={setLoanRatePtc}
                            fieldName="loanRatePtc"
                            fieldLable="Loan Rate"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={loanTerm}
                            setFieldValue={setLoanTerm}
                            fieldName="loanTerms"
                            fieldLable="Loan Terms"
                            surfix="months"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={rentIncome}
                            setFieldValue={setRentIncome}
                            fieldName="rentIncome"
                            fieldLable="Rent Income"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={managementFeePtc}
                            setFieldValue={setManagementFeePtc}
                            fieldName="managementFeePtc"
                            fieldLable="Management Fee"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={maintenanceCostPtc}
                            setFieldValue={setMaintenanceCostPtc}
                            fieldName="maintenanceCostPtc"
                            fieldLable="Maintenance Cost"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={taxRatePtc}
                            setFieldValue={setTaxRatePtc}
                            fieldName="taxRatePtc"
                            fieldLable="Tax Rate"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={propertyTaxPtc}
                            setFieldValue={setPropertyTaxPtc}
                            fieldName="propertyTaxPtc"
                            fieldLable="Property Tax"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={vacancyRatePtc}
                            setFieldValue={setVacancyRatePtc}
                            fieldName="vacancyRatePtc"
                            fieldLable="Vacancy rate"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={annualAppreciationPtc}
                            setFieldValue={setAnnualAppreciationPtc}
                            fieldName="annualAppreciationPtc"
                            fieldLable="Annual appreciation increase"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={annualRentIncreasePtc}
                            setFieldValue={setAnnualRentIncreasePtc}
                            fieldName="annualRentIncreasePtc"
                            fieldLable="Annual rent increase"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={annualUtilities}
                            setFieldValue={setAnnualUtilities}
                            fieldName="annualUtilities"
                            fieldLable="Annual utilities"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={annualInsurance}
                            setFieldValue={setAnnualInsurance}
                            fieldName="annualInsurance"
                            fieldLable="Annual insurance"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={annualOtherCosts}
                            setFieldValue={setAnnualOtherCosts}
                            fieldName="annualOtherCosts"
                            fieldLable="Annual other costs"
                            prefix="$"
                            rules={{
                                min: 0,
                            }}
                        />
                        <SettingsInputField
                            fieldValue={salesFeesPtc}
                            setFieldValue={setSalesFeesPtc}
                            fieldName="salesFeesPtc"
                            fieldLable="Sales Fee"
                            surfix="%"
                            rules={{
                                min: 0,
                                max: 100,
                            }}
                        />
                        <Button variant="contained" type="submit" disabled={canSubmit}>
                            Calculate
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </form>
    );
};
