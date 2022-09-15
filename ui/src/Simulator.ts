import { ppmt, ipmt, pmt } from 'financial';
import { FormText } from 'react-bootstrap';

const DepreciationOverYears: number = 27.5;

export let runSimulation = (input: ISettings, simulateYears: number): ISimulationResult => {
    console.log('Running calculation');
    let months: IMonthResult[] = [];
    let years: IYearResult[] = [];
    let fixedCosts = getFixedCosts(input);
    let currentRemainingLoan = fixedCosts.totalLoanAtPurchase;
    let currentRent = input.RentIncome;
    let currentHousePrice = input.PurchasePrice + input.RemodelValueIncrease;
    let taxCredit = 0;
    let totalCashFlowPostTax = 0;

    let lastDepreciationMonth = DepreciationOverYears * 12;
    for (let currentMonth = 1; currentMonth <= simulateYears * 12; currentMonth++) {
        if (currentMonth % 12 === 0 && currentMonth !== 0) {
            currentRent *= 1 + input.AnnualAppreciationPtc;
        }

        let depreciation = 0;
        if (currentMonth <= lastDepreciationMonth) {
            depreciation = fixedCosts.monthlyDepreciation;
        }

        let principal = -ppmt(input.LoanPtc / 12, currentMonth, input.LoanTerms, fixedCosts.totalLoanAtPurchase);
        let intrest = -ipmt(input.LoanPtc / 12, currentMonth, input.LoanTerms, fixedCosts.totalLoanAtPurchase);

        let propertyTax = (input.PurchasePrice * input.PropertyTaxPtc) / 12;
        let operatingExpenses =
            (input.AnnualInsurance + input.AnnualUtilities + input.AnnualOtherCost) / 12 +
            currentRent * input.MaintenanceCostPtc +
            currentRent * input.ManagementFeePtc +
            propertyTax;
        let netOperationalIncome = currentRent - operatingExpenses;
        let operatingIncome = currentRent - operatingExpenses - currentRent * input.VacancyRatePtc;
        let taxableIncome = operatingIncome - intrest;
        let taxCalculation = calculateTex(taxableIncome, depreciation, input.TaxRatePtc, taxCredit);
        taxCredit = taxCalculation.taxCredit;
        let totalExpenses = operatingExpenses + currentRent * input.VacancyRatePtc + intrest + taxCalculation.tax;

        // Operatring expenses is already subtracted from operationg income and added totalExpenses, we should only count that once
        let netIncome = operatingIncome - totalExpenses + operatingExpenses;
        let cashFlow = netIncome - principal;
        let cashFlowPreTax = cashFlow + taxCalculation.tax;

        totalCashFlowPostTax += cashFlow;
        currentRemainingLoan -= principal;

        let propertySalesFees = currentHousePrice * input.SalesFeesPtc;
        let cashAtSalePreTax = currentHousePrice - propertySalesFees - fixedCosts.downPayment - currentRemainingLoan;
        let taxableAtSale = cashAtSalePreTax - taxCredit;
        if (taxableAtSale < 0) {
            taxableAtSale = 0;
        }

        let taxAtSale = calculateLongTermCapitalGainsTax(taxableAtSale);
        // Todo: Do we not need to pay depriciation back if we sale at a profit?
        let cashAfterPropertySale = cashAtSalePreTax - taxAtSale - input.RemodelCost - fixedCosts.closingCost;

        months.push({
            month: currentMonth,
            year: Math.floor(currentMonth / 12),
            principalPaid: principal,
            intrestPaid: intrest,
            propertyTax: propertyTax,
            operatingExpenses: operatingExpenses,
            netOperationalIncome: netOperationalIncome,
            operatingIncome: operatingIncome,
            tax: taxCalculation.tax,
            totalExpenses: totalExpenses,
            netIncome: netIncome,
            cashFlowPreTax: cashFlowPreTax,
            cashFlow: cashFlow,
            cashAfterPropertySale: cashAfterPropertySale,
            totalCashFlowPostTax: totalCashFlowPostTax,
            houseValue: currentHousePrice,
        });

        if (currentMonth % 12 === 0) {
            years.push(aggregateYear(currentMonth, months, years, fixedCosts));
        }

        // incroment values
        currentHousePrice *= 1 + input.AnnualAppreciationPtc / 12;
    }
    return {
        fixedCosts: fixedCosts,
        months: months,
        years: years,
    };
};

let calculateTex = (income: number, depreciation: number, taxRatePtc: number, taxCredit: number) => {
    let tax = 0;
    if (income > 0) {
        let taxableIncome = income - depreciation;
        if (taxableIncome > 0) {
            if (taxCredit > taxableIncome) {
                taxCredit -= taxableIncome;
                taxableIncome = 0;
            } else {
                taxableIncome -= taxCredit;
                taxCredit = 0;
            }
            tax = taxableIncome * taxRatePtc;
        } else {
            taxCredit += -taxableIncome;
            tax = 0;
        }
    } else {
        tax = 0;
        taxCredit += -income + depreciation;
    }
    return {
        tax: tax,
        taxCredit: taxCredit,
    };
};

let aggregateYear = (currentMonth: number, months: IMonthResult[], years: IYearResult[], fixedCosts: IFixedCosts): IYearResult => {
    let aggrogatedYear: IMonthResult = {
        year: 0,
        month: 0,
        principalPaid: 0,
        intrestPaid: 0,
        propertyTax: 0,
        operatingExpenses: 0,
        netOperationalIncome: 0,
        operatingIncome: 0,
        tax: 0,
        totalExpenses: 0,
        netIncome: 0,
        cashFlowPreTax: 0,
        cashFlow: 0,
        cashAfterPropertySale: 0,
        totalCashFlowPostTax: 0,
        houseValue: 0,
    };

    // Todo: Is this right? should we not remove 13 for the starting index?
    for (let q = months.length - 12; q < months.length; q++) {
        aggrogatedYear.principalPaid += months[q].principalPaid;
        aggrogatedYear.intrestPaid += months[q].intrestPaid;
        aggrogatedYear.propertyTax += months[q].propertyTax;
        aggrogatedYear.operatingExpenses += months[q].operatingExpenses;
        aggrogatedYear.netOperationalIncome += months[q].netOperationalIncome;
        aggrogatedYear.operatingIncome += months[q].operatingIncome;
        aggrogatedYear.tax += months[q].tax;
        aggrogatedYear.totalExpenses += months[q].totalExpenses;
        aggrogatedYear.netIncome += months[q].netIncome;
        aggrogatedYear.cashFlowPreTax += months[q].cashFlowPreTax;
        aggrogatedYear.cashFlow += months[q].cashFlow;
    }
    aggrogatedYear.cashAfterPropertySale += months[months.length - 1].cashAfterPropertySale;
    aggrogatedYear.totalCashFlowPostTax += months[months.length - 1].totalCashFlowPostTax;
    aggrogatedYear.houseValue += months[months.length - 1].houseValue;

    let year = Math.floor(currentMonth / 12.0);
    return {
        ...aggrogatedYear,
        year: year,
        month: 12,
        capRate: aggrogatedYear.netOperationalIncome / fixedCosts.totalAcquisitionCost,
        cashOnCashReturn: aggrogatedYear.cashFlowPreTax / fixedCosts.purchaseTotalOutOfPocket,
        cashFlowReturn: aggrogatedYear.cashFlow / fixedCosts.purchaseTotalOutOfPocket,
        propertySaleReturn: (aggrogatedYear.cashAfterPropertySale + aggrogatedYear.totalCashFlowPostTax) / year / fixedCosts.totalAcquisitionCost,
    };
};

let calculateLongTermCapitalGainsTax = (valueGain: number): number => {
    // Long - term capital gains tax rate    Your income
    // 0 %  $0 to $53,600
    // 15 % $53,601 to $469,050
    // 20 % $469,051 or more
    let b1Value = 53600 * 2; // *2 for married
    let b2Value = 469050 * 2; // *2 for married

    let bracker1 = valueGain > b1Value ? b1Value : valueGain;
    let bracker2 = valueGain > b2Value ? b2Value - b1Value : valueGain > b1Value ? valueGain - b1Value : 0;
    let bracker3 = valueGain > b2Value ? valueGain - b2Value - b1Value : 0;

    return bracker1 * 0.0 + bracker2 * 0.15 + bracker3 * 0.2;
};

let getFixedCosts = (input: ISettings): IFixedCosts => {
    let fixedCosts: IFixedCosts = {} as any;
    fixedCosts.totalLoanAtPurchase = input.PurchasePrice * (1 - input.DownPaymentPtc);
    fixedCosts.downPayment = input.PurchasePrice * input.DownPaymentPtc;
    fixedCosts.closingCost = input.LoanFee + input.PurchasePrice * input.EscrowPtc;
    fixedCosts.purchaseTotalOutOfPocket = fixedCosts.downPayment + fixedCosts.closingCost + input.RemodelCost;
    fixedCosts.totalAcquisitionCost = input.PurchasePrice + input.LoanFee + input.PurchasePrice * input.EscrowPtc;
    // Land value dose not change during the ownership
    fixedCosts.landValue = input.PurchasePrice * input.LandValuePtc;
    fixedCosts.buildingCostAtAcquisition = fixedCosts.totalAcquisitionCost - fixedCosts.landValue + input.RemodelCost;
    fixedCosts.monthlyDepreciation = fixedCosts.buildingCostAtAcquisition / (DepreciationOverYears * 12);
    fixedCosts.monthlyPropertyTax = input.PurchasePrice * (input.PropertyTaxPtc / 12);
    return fixedCosts;
};

export interface ISimulationResult {
    fixedCosts: IFixedCosts;
    months: IMonthResult[];
    years: IYearResult[];
}

interface IFixedCosts {
    totalLoanAtPurchase: number;
    downPayment: number;
    closingCost: number;
    purchaseTotalOutOfPocket: number;
    totalAcquisitionCost: number;
    landValue: number;
    buildingCostAtAcquisition: number;
    monthlyDepreciation: number;
    monthlyPropertyTax: number;
}

export interface IMonthResult {
    month: number;
    year: number;
    principalPaid: number;
    intrestPaid: number;
    propertyTax: number;
    operatingExpenses: number;
    netOperationalIncome: number;
    operatingIncome: number;
    tax: number;
    totalExpenses: number;
    netIncome: number;
    cashFlowPreTax: number;
    cashFlow: number;
    cashAfterPropertySale: number;
    totalCashFlowPostTax: number;
    houseValue: number;
}

export interface IYearResult extends IMonthResult {
    capRate: number;
    cashOnCashReturn: number;
    cashFlowReturn: number;
    propertySaleReturn: number;
}

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
    SalesFeesPtc: number;
}
