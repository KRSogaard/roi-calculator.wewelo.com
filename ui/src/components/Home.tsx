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
                                        <th scope="col">Monthly CIH</th>
                                        <th scope="col">CIH %</th>
                                        <th scope="col">ROI at Sale %</th>
                                        <th scope="col">Value gain at sale</th>
                                        <th scope="col">Year net income</th>
                                        <th scope="col">Year tax paid</th>
                                        <th scope="col">Year value gain</th>
                                        <th scope="col">Total value gain</th>
                                        <th scope="col">Total net income</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {years &&
                                        years.map((year) => (
                                            <tr key={'SimulationYear' + year.Year}>
                                                <td>{year.Year}</td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.CashInHand / 12}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={(year.CashInHand / outOfPocket) * 100}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'%'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={((year.ValueAtSale / outOfPocket) * 100) / year.Year}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'%'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.ValueAtSale}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.NetIncome}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.TaxPaid}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.ValueGain}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.TotalValueGain}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={year.TotalNetIncome}
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
