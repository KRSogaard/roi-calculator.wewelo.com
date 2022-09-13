import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Header from './Header';
import { SaveService } from '../services/SaveService';
import { Settings } from './Settings';
import { ISettings, ISimulationResult, IYearResult, runSimulation } from '../Simulator';
import SimulationResults from './SimulationResults';
import Grid from '@mui/material/Unstable_Grid2';

function Home() {
    // const [tasks, setTasks] = useState([])
    // const [numberOfTasks, setNumberOfTasks] = useState<number>(0)
    const [settings, setSetSettings] = useState<ISettings | undefined>();
    const [result, setResult] = useState<ISimulationResult>();
    const [outOfPocket, setOutOfPocket] = useState<number>(0);

    const saveService = new SaveService();

    useEffect(() => {
        if (!settings) return;
        let simulator = runSimulation(settings, 30);
        setResult(simulator);
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
            <Grid container spacing={2} margin={2}>
                <Grid xs={12} md={3}>
                    <Settings onSettingsChange={onSettingsChange} />
                </Grid>
                <Grid xs={12} md={9}>
                    <SimulationResults result={result} />
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;
