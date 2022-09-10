import React, { useState, useEffect } from "react";
import EditTaskModal from "./EditTaskModal";
import { useForm, Controller } from "react-hook-form";
import { NumericFormat } from 'react-number-format';

export interface ISettings {
  PurchasePrice: number;
  LandValuePtc: number;
  DownPaymentPtc: number;
  LoanFee: number;
  EscrowPtc: number;
  LoanPtc: number;
  LoanTerms: number;
  RentIncome: number;
  RemodelCost: number;
  RemodelValueIncrease: number;
  ManagementFeePtc: number;
  MaintenanceCostPtc: number;
  TaxRatePtc: number;
  PropertyTaxPtc: number;
  VacancyRatePtc: number;
  AnnualAppreciationPtc: number;
  AnnualRentPtc: number;
  AnnualUtilities: number;
  AnnualInsurance: number;
  AnnualOtherCost: number;
  SalesFeePtc: number;
}

export const Settings = (onSettingsChange: any) => {
  const [downPaymentValue, setDownPaymentValue] = useState(0);
  const [totalClosing, setTotalClosing] = useState(0);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
    shouldUseNativeValidation: true,
    reValidateMode: "onChange",
    defaultValues: {
      purchasePrice: 1000000,
      downPaymentPtc: 25,
      landValuePtc: 50,
      loanFeesPtc: 1,
      escrowFeesPtc: 1,
      rehabCost: 0,
      rehabValueCost: 0,
      loanRatePtc: 5,
      loanTerm: 12 * 30,
      rentIncome: 3600,
      managementFeePtc: 0,
      maintenanceCostPtc: 5,
      taxRatePtc: 25,
      propertyTaxPtc: 0.69,
      vacancyRatePtc: 10,
      annualRentIncreasePtc: 3,
      annualUtilities: 1000,
      annualInsurance: 1000,
      annualOtherCosts: 1000,
      salesFeesPtc: 5
    }
  });

  const watchDownpayment = watch(["purchasePrice", "downPaymentPtc"]);
  const watchTotalClosing = watch(["purchasePrice", "downPaymentPtc", "loanFeesPtc", "escrowFeesPtc", "rehabCost"]);
  React.useEffect(() => {
    console.log(watchDownpayment);
    setDownPaymentValue(
      watchDownpayment[0] * (watchDownpayment[1] /
        100.0)
    );
  }, [watchDownpayment]);
  React.useEffect(() => {
    setTotalClosing(
      watchTotalClosing[0] * (watchTotalClosing[1] / 100.0) +
      watchTotalClosing[0] * (watchTotalClosing[2] / 100.0) +
      watchTotalClosing[0] * (watchTotalClosing[3] / 100.0) +
      watchTotalClosing[4]);
  }, [watchTotalClosing]);

  const onDownPaymentChanged = async (test: any) => {
    console.log("OnChanged:", test);
  };
  const onSubmit = (data: any, e: any) => console.log("Submit", data, e);
  const onError = (errors: any, e: any) => console.log("Error", errors, e);

  var inputField = (title: string, fields: any, prefix?: string, errors?: any) => {
    if (errors) {
      console.log("Errors:", errors);
    }
    return (
      <div className="form-group row">
        <label className="col-sm-5" htmlFor={fields.name}>{title}:</label>
        <div className="col-sm-7">
          <div className="input-group mb-3">
            {prefix !== "" && (
              // <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                {prefix}
                //</span>
              </div>)}
          <input
            id={fields.name}
            type="number"
            className="form-control form-control-sm"
            step="any"
            {...fields}
          />
        </div>

      </div>
      </div >)
  }

return (
  <form onSubmit={handleSubmit(onSubmit, onError)}>
    {/* <small className="text-danger">
        {errors?.role && errors.role.message}
      </small> */}

    {inputField("Purchase Price", register("purchasePrice", {
      required: true,
      valueAsNumber: true
    }), "$")}
    {inputField("Land value", register("landValuePtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}
    {inputField("Land value", register("downPaymentPtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}

    <div className="form-group">
      <label htmlFor="landValue">Down payment value:</label>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">
            $
          </span>
        </div>
        <input
          type="number"
          className="form-control"
          value={downPaymentValue.toFixed(2)}
          readOnly
        />
      </div>
    </div>

    <h3>
      Closing costs
    </h3>
    {inputField("Loan Fees", register("loanFeesPtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}
    {inputField("Escrow Fees", register("escrowFeesPtc", {
      required: true,
      valueAsNumber: true,
      min: 0
    }), "%")}

    <h3>
      Closing costs
    </h3>
    {inputField("Rehab", register("rehabCost", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "$")}
    {inputField("Rehab value increase", register("rehabValueCost", {
      required: true,
      valueAsNumber: true,
      min: 0
    }), "$")}


    <h3>
      Total Closing: {totalClosing}
    </h3>

    {inputField("Loan Rate", register("loanRatePtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}

    {inputField("Loan Rate", register("loanTerm", {
      required: true,
      valueAsNumber: true,
      min: 0,
    }), "months")}

    {inputField("Rent Income", register("rentIncome", {
      required: true,
      valueAsNumber: true,
      min: 0,
    }), "$", errors.rentIncome)}

    {inputField("Management Fee", register("managementFeePtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}

    {inputField("Maintenance Cost", register("maintenanceCostPtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}

    {inputField("Tax Rate", register("taxRatePtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}

    {inputField("Property Tax", register("propertyTaxPtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}

    {inputField("Vacancy rate", register("vacancyRatePtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}

    {inputField("Annual rent increase", register("annualRentIncreasePtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}

    {inputField("Annual utilities", register("annualUtilities", {
      required: true,
      valueAsNumber: true,
      min: 0,
    }), "$")}

    {inputField("Annual insurance", register("annualInsurance", {
      required: true,
      valueAsNumber: true,
      min: 0,
    }), "$")}

    {inputField("Annual other costs", register("annualOtherCosts", {
      required: true,
      valueAsNumber: true,
      min: 0,
    }), "$")}

    {inputField("Sales Fee", register("salesFeesPtc", {
      required: true,
      valueAsNumber: true,
      min: 0,
      max: 100,
    }), "%")}


    <input type="submit" />
  </form>
);
};
