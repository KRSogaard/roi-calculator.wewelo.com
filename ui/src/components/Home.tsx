import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Header from './Header';
import { SaveService } from '../services/SaveService';
import { Settings } from './Settings';
import { ISettings, IYearResult, runSimulation } from '../Simulator';
import CurrencyFormat from 'react-currency-format';

function Home() {
    // const [tasks, setTasks] = useState([])
    // const [numberOfTasks, setNumberOfTasks] = useState<number>(0)
    const [settings, setSetSettings] = useState<ISettings | undefined>();
    const [years, setYears] = useState<IYearResult[]>();
    const [outOfPocket, setOutOfPocket] = useState<number>(0);

    const saveService = new SaveService();

    useEffect(() => {
        if (!settings) return;
        let simulator = runSimulation(settings, 30);
        console.log('Result: ', simulator);
        setOutOfPocket(simulator.fixedCosts.purchaseTotalOutOfPocket);
        setYears(simulator.years);
    }, [settings]);

    let onSettingsChange = (input: ISettings) => {
        setSetSettings(input);
    };

    let round = (x: number): number => {
        return Math.round(x * 100) / 100;
    };

    return (
        <div className="App">
            <Header></Header>
            <div className="container mrgnbtm">
                <div className="row">
                    <div className="col-md-3">
                        <Settings onSettingsChange={onSettingsChange} />
                    </div>
                    <div className="col-md-9">
                        {settings && (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Year</th>
                                        <th scope="col" title="Pre-tax casflow devided by the total acquisition cost">
                                            Cash on Cash Return
                                        </th>
                                        <th scope="col" title="Post-tax casflow devided by the total acquisition cost">
                                            Cash on Cash Return (Post-Tax)
                                        </th>
                                        <th scope="col" title="Total cashflow before tax">
                                            Cashflow (Pre-Tax)
                                        </th>
                                        <th scope="col" title="Total cashflow after tax">
                                            Cashflow (Post-Tax)
                                        </th>
                                        <th scope="col" title="Net operational Income / Total acquisition cost, this dose not include mortages and taxes">
                                            CapRate
                                        </th>
                                        <th
                                            scope="col"
                                            title="The annual return based sale of the property plus post tax cash flow devided by the total acquisition cost">
                                            Property Sale Return
                                        </th>
                                        <th
                                            scope="col"
                                            title="Net operational income: Rent income minus operation expenses such as insurance, utilites, maintenance, management fee and property tax">
                                            NOI
                                        </th>
                                        <th
                                            scope="col"
                                            title="Rent income minus vacancy and operation expenses such as insurance, utilites, maintenance, management fee and property tax">
                                            Operating Income
                                        </th>
                                        <th scope="col" title="Cash left after sale, and all expenses has been paid">
                                            Cash after property sale
                                        </th>
                                        <th scope="col" title="all expenses, including taxes">
                                            Total expenses
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {years &&
                                        years.map((year) => (
                                            <tr key={'SimulationYear' + year.year}>
                                                <td>{year.year}</td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.cashOnCashReturn * 100}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'%'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.cashFlowReturn * 100}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'%'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.cashFlowPreTax}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.cashFlow}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.capRate * 100}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'%'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.propertySaleReturn * 100}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'%'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.netOperationalIncome}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.operatingIncome}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.cashAfterPropertySale}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.totalExpenses}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
