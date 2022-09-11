import { ppmt, ipmt, pmt } from 'financial';
import { FormText } from 'react-bootstrap';

const DepreciationOverYears: number = 27.5;

export let runSimulation = (input: ISettings, simulateYears: number): ISimulationResult => {
    let months: IMonthResult[] = [];
    let years: IYearResult[] = [];
    let fixedCosts = getFixedCosts(input);

    let currentRemainingLoan = fixedCosts.totalLoanAtPurchase;
    let currentRent = input.RentIncome;
    let currentHousePrice = input.PurchasePrice + input.RemodelValueIncrease;
    let taxCredit = 0;
    let totalProfit = 0;

    let lastDepreciationMonth = DepreciationOverYears * 12;
    for (let currentMonth = 1; currentMonth <= simulateYears * 12; currentMonth++) {
        let month: IMonthResult = <any>{};

        let principal = -ppmt(input.LoanPtc / 12, currentMonth, input.LoanTerms, fixedCosts.totalLoanAtPurchase);
        let intrest = -ipmt(input.LoanPtc / 12, currentMonth, input.LoanTerms, fixedCosts.totalLoanAtPurchase);
        month.PrincipalPaid = principal;
        month.IntrestPaid = intrest;

        let fixedMonthlyExpenses = (input.AnnualInsurance + input.AnnualUtilities + input.AnnualOtherCost) / 12;
        let monthlyMaintenance = input.MaintenanceCostPtc * currentRent;
        let monthlyManagement = input.ManagementFeePtc * currentRent;
        let monthlyExpensesTotal = intrest + fixedMonthlyExpenses + monthlyMaintenance + monthlyManagement + fixedCosts.monthlyPropertyTax;

        month.PropertyTax = fixedCosts.monthlyPropertyTax;
        month.Expenses = monthlyExpensesTotal;
        month.OutOfPocket = principal + monthlyExpensesTotal;
        month.RentIncome = currentRent;

        let monthlyProfit = currentRent * (1 - input.VacancyRatePtc) - monthlyExpensesTotal;
        totalProfit += monthlyProfit;

        let depreciation = 0;
        if (currentMonth <= lastDepreciationMonth) {
            depreciation = fixedCosts.monthlyDepreciation;
        }

        month.NetIncome = monthlyProfit;
        let tax = 0;
        if (monthlyProfit > 0) {
            let taxableIncome = monthlyProfit - depreciation;
            if (taxableIncome > 0) {
                if (taxCredit > taxableIncome) {
                    taxCredit -= taxableIncome;
                    taxableIncome = 0;
                } else {
                    taxableIncome -= taxCredit;
                    taxCredit = 0;
                }
                month.TaxableIncome = taxableIncome;
                tax = taxableIncome * input.TaxRatePtc;
            } else {
                taxCredit += -taxableIncome;
                tax = 0;
            }
        } else {
            tax = 0;
            taxCredit += -monthlyProfit + depreciation;
            month.TaxableIncome = 0;
        }
        month.Tax = tax;
        month.TaxCredit = taxCredit;

        let cashInHand = (currentRent - monthlyExpensesTotal) * (1 - input.VacancyRatePtc) - principal - tax;
        let valueGain = monthlyProfit - tax;

        month.CashInHand = cashInHand;
        month.ValueGain = valueGain;

        currentRemainingLoan -= principal;

        currentHousePrice *= 1 + input.AnnualAppreciationPtc / 12;

        let costAtSale = currentHousePrice * input.SalesFeesPtc;
        let cashAtSalePreTax = currentHousePrice - costAtSale - fixedCosts.downPayment - currentRemainingLoan;
        let taxableAtSale = cashAtSalePreTax - taxCredit;
        if (taxableAtSale < 0) {
            taxableAtSale = 0;
        }

        let taxAtSale = calculateLongTermCapitalGainsTax(taxableAtSale);
        let cashAtSale = cashAtSalePreTax - taxAtSale - input.RemodelCost - fixedCosts.closingCost;
        let valueAtSale = cashAtSale + totalProfit;

        month.CashAtSale = cashAtSale;
        month.ValueAtSale = valueAtSale;

        if (currentMonth % 12 == 0) {
            currentRent *= 1 + input.AnnualAppreciationPtc;
        }
        month.Month = currentMonth;
        month.Year = Math.floor(currentMonth / 12);

        months.push(month);

        if (currentMonth % 12 == 0) {
            years.push(aggregateYear(currentMonth, months, years));
        }
    }
    return {
        fixedCosts: fixedCosts,
        months: months,
        years: years,
    };
};

let aggregateYear = (currentMonth: number, months: IMonthResult[], years: IYearResult[]): IYearResult => {
    let yearlyCashInHand = 0;
    let yearlyNetIncome = 0;
    let yearlyTaxPaid = 0;
    let yearlyValueGain = 0;
    let yearlyIntrestPaid = 0;
    let yearlyPrincipalPaid = 0;
    let yearlyPropertyTax = 0;

    // Todo: Is this right? should we not remove 13 for the starting index?
    for (let q = months.length - 12; q < months.length; q++) {
        yearlyCashInHand += months[q].CashInHand;
        yearlyNetIncome += months[q].NetIncome;
        yearlyTaxPaid += months[q].Tax;
        yearlyValueGain += months[q].ValueGain;
        yearlyIntrestPaid += months[q].IntrestPaid;
        yearlyPrincipalPaid += months[q].PrincipalPaid;
        yearlyPropertyTax += months[q].PropertyTax;
    }
    return {
        Year: Math.floor(currentMonth / 12.0),
        CashInHand: yearlyCashInHand,
        ValueAtSale: months[months.length - 1].ValueAtSale,
        NetIncome: yearlyNetIncome,
        TotalNetIncome: years.length == 0 ? yearlyNetIncome : years[years.length - 1].TotalNetIncome + yearlyNetIncome,
        TaxPaid: yearlyTaxPaid,
        ValueGain: yearlyValueGain,
        TotalValueGain: years.length == 0 ? yearlyValueGain : years[years.length - 1].TotalValueGain + yearlyValueGain,
        IntrestPaid: yearlyIntrestPaid,
        PrincipalPaid: yearlyPrincipalPaid,
        PropertyTax: yearlyPropertyTax,
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

let round = (number: number): number => {
    return Math.round(number * 100) / 100;
};

let getFixedCosts = (input: ISettings): IFixedCosts => {
    let fixedCosts: IFixedCosts = <any>{};
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
    Month: number;
    Year: number;
    OutOfPocket: number;
    PrincipalPaid: number;
    IntrestPaid: number;
    RentIncome: number;
    Expenses: number;
    NetIncome: number;
    CashInHand: number;
    ValueGain: number;
    TaxableIncome: number;
    PropertyTax: number;
    Tax: number;
    TaxCredit: number;
    ValueAtSale: number;
    CashAtSale: number;
}

export interface IYearResult {
    Year: number;
    CashInHand: number;
    ValueAtSale: number;
    NetIncome: number;
    TaxPaid: number;
    ValueGain: number;
    IntrestPaid: number;
    PrincipalPaid: number;
    PropertyTax: number;
    TotalNetIncome: number;
    TotalValueGain: number;
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
