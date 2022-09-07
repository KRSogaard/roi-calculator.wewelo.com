import React, { useState, useEffect } from "react";
import EditTaskModal from "./EditTaskModal";
import { useForm } from "react-hook-form";

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

  const { register, handleSubmit, watch } = useForm({
    shouldUseNativeValidation: true,
    reValidateMode: "onChange",
  });

  const watchDownpayment = watch(["purchasePrice", "downPaymentPtc"]);
  React.useEffect(() => {
    setDownPaymentValue(
      (parseFloat(watchDownpayment[0]) * parseFloat(watchDownpayment[1])) /
        100.0
    );
  });
  const onSubmit = async (data: any) => {
    console.log("Test:", data);
  };

  const onDownPaymentChanged = async (test: any) => {
    console.log("OnChanged:", test);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="purchasePrice">Purchase Price:</label>
          <input
            type="text"
            className="form-control"
            id="purchasePrice"
            {...register("purchasePrice", {
              required: true,
              valueAsNumber: true,
              min: 0,
            })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="landValue">Land value:</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                %
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              {...register("landValue", {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 100,
              })}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="downPayment">Down payment:</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                %
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              {...register("downPaymentPtc", {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 100,
              })}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="landValue">Down payment value:</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                $
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              value={downPaymentValue.toFixed(2)}
              readOnly
            />
          </div>
        </div>
      </div>
      <input type="submit" />
    </form>
  );
};
