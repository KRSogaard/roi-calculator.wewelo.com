import React, { useState, useEffect, FunctionComponent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { ISettings } from '../Simulator';

type CallbackFunction = (input: ISettings) => void;
interface SettingsInput {
    onSettingsChange: CallbackFunction;
}
export const Settings = (args: SettingsInput) => {
    const [downPaymentValue, setDownPaymentValue] = useState(0);
    const [totalClosing, setTotalClosing] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm({
        shouldUseNativeValidation: true,
        reValidateMode: 'onChange',
        defaultValues: {
            purchasePrice: 1500000,
            downPaymentPtc: 20,
            landValuePtc: 60,
            loanFees: 5000,
            escrowFeesPtc: 1,
            rehabCost: 80000,
            rehabValueCost: 300000,
            loanRatePtc: 3.5,
            loanTerms: 12 * 30,
            rentIncome: 10800,
            managementFeePtc: 0,
            maintenanceCostPtc: 5,
            taxRatePtc: 25,
            propertyTaxPtc: 1.25,
            vacancyRatePtc: 5,
            annualAppreciationPtc: 1,
            annualRentIncreasePtc: 1,
            annualUtilities: 2700,
            annualInsurance: 2300,
            annualOtherCosts: 1200,
            salesFeesPtc: 3,
        },
    });

    const watchDownpayment = watch(['purchasePrice', 'downPaymentPtc']);
    const watchTotalClosing = watch(['purchasePrice', 'downPaymentPtc', 'loanFees', 'escrowFeesPtc', 'rehabCost']);
    React.useEffect(() => {
        setDownPaymentValue(watchDownpayment[0] * (watchDownpayment[1] / 100.0));
    }, [watchDownpayment]);
    React.useEffect(() => {
        setTotalClosing(
            watchTotalClosing[0] * (watchTotalClosing[1] / 100.0) +
                watchTotalClosing[2] +
                watchTotalClosing[0] * (watchTotalClosing[3] / 100.0) +
                watchTotalClosing[4]
        );
    }, [watchTotalClosing]);

    const onSubmit = (data: any, e: any) => {
        args.onSettingsChange({
            PurchasePrice: data.purchasePrice,
            LandValuePtc: data.landValuePtc / 100,
            DownPaymentPtc: data.downPaymentPtc / 100,
            LoanFee: data.loanFees,
            EscrowPtc: data.escrowFeesPtc / 100,
            LoanPtc: data.loanRatePtc / 100,
            LoanTerms: data.loanTerms,
            RentIncome: data.rentIncome,
            RemodelCost: data.rehabCost,
            RemodelValueIncrease: data.rehabValueCost,
            ManagementFeePtc: data.managementFeePtc / 100,
            MaintenanceCostPtc: data.maintenanceCostPtc / 100,
            TaxRatePtc: data.taxRatePtc / 100,
            PropertyTaxPtc: data.propertyTaxPtc / 100,
            VacancyRatePtc: data.vacancyRatePtc / 100,
            AnnualAppreciationPtc: data.annualAppreciationPtc / 100,
            AnnualRentPtc: data.annualRentIncreasePtc / 100,
            AnnualUtilities: data.annualUtilities,
            AnnualInsurance: data.annualInsurance,
            AnnualOtherCost: data.annualOtherCosts,
            SalesFeesPtc: data.salesFeesPtc / 100,
        });
    };
    const onError = (errors: any, e: any) => console.log('Error', errors, e);

    var inputField = (title: string, fields: any, prefix?: string, errors?: any) => {
        if (errors) {
            console.log('Errors:', errors);
        }
        return (
            <div className="form-group row">
                <label className="col-sm-6" htmlFor={fields.name}>
                    {title}:
                </label>
                <div className="col-sm-6">
                    <div className="input-group mb-3">
                        {prefix !== '' && (
                            <span className="input-group-text" id="basic-addon3">
                                {prefix}
                            </span>
                        )}
                        <input id={fields.name} type="number" className="form-control form-control-sm" step="any" {...fields} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            {inputField(
                'Purchase Price',
                register('purchasePrice', {
                    required: true,
                    valueAsNumber: true,
                }),
                '$'
            )}
            {inputField(
                'Land value',
                register('landValuePtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            {inputField(
                'Down payment',
                register('downPaymentPtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            <div className="form-group row">
                <label className="col-sm-6" htmlFor="downPayment">
                    Down payment:
                </label>
                <div className="col-sm-6">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon3">
                            $
                        </span>
                        <input type="number" id="downPayment" className="form-control" value={downPaymentValue.toFixed(2)} readOnly disabled />
                    </div>
                </div>
            </div>
            <h4>Closing costs</h4>
            {inputField(
                'Loan Fees',
                register('loanFees', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                }),
                '$'
            )}
            {inputField(
                'Escrow Fees',
                register('escrowFeesPtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                }),
                '%'
            )}
            <h4>Closing costs</h4>
            {inputField(
                'Renovation',
                register('rehabCost', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                }),
                '$'
            )}
            {inputField(
                'Renovation value increase',
                register('rehabValueCost', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                }),
                '$'
            )}
            <div className="form-group row">
                <label className="col-sm-6" htmlFor="downPayment">
                    Total Closing:
                </label>
                <div className="col-sm-6">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon3">
                            $
                        </span>
                        <input type="number" id="downPayment" className="form-control" value={totalClosing} readOnly disabled />
                    </div>
                </div>
            </div>
            <hr />
            {inputField(
                'Loan Rate',
                register('loanRatePtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            {inputField(
                'Loan Rate',
                register('loanTerms', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                }),
                'months'
            )}
            {inputField(
                'Rent Income',
                register('rentIncome', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                }),
                '$',
                errors.rentIncome
            )}
            {inputField(
                'Management Fee',
                register('managementFeePtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            {inputField(
                'Maintenance Cost',
                register('maintenanceCostPtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            {inputField(
                'Tax Rate',
                register('taxRatePtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            {inputField(
                'Property Tax',
                register('propertyTaxPtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            {inputField(
                'Vacancy rate',
                register('vacancyRatePtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}

            {inputField(
                'Annual appreciation increase',
                register('annualAppreciationPtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            {inputField(
                'Annual rent increase',
                register('annualRentIncreasePtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            {inputField(
                'Annual utilities',
                register('annualUtilities', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                }),
                '$'
            )}
            {inputField(
                'Annual insurance',
                register('annualInsurance', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                }),
                '$'
            )}
            {inputField(
                'Annual other costs',
                register('annualOtherCosts', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                }),
                '$'
            )}
            {inputField(
                'Sales Fee',
                register('salesFeesPtc', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                }),
                '%'
            )}
            <div className="form-group row">
                <input type="submit" value="Calculate" />
            </div>
        </form>
    );
};
