import { IYearResult } from '../Simulator';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Currency from './Currency';

interface SimulationResultRowProps {
    year: IYearResult;
}

function SimulationResultRow(props: SimulationResultRowProps) {
    let { year } = props;
    let [showDetails, setShowDetails] = useState(false);
    let [devider, setDevider] = useState(1);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const round = (x: number): number => {
        return Math.round(x * 100) / 100;
    };

    return (
        <>
            <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <StyledTableCell component="th" scope="row" align="right">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowDetails(!showDetails);
                        }}>
                        <span style={{ marginRight: '5px' }}>{year.year}</span>
                        <SearchIcon />
                    </a>
                </StyledTableCell>
                <TableCell align="right">
                    <Currency value={year.cashOnCashReturn * 100} suffix={'%'} />
                </TableCell>
                <TableCell align="right">
                    <Currency value={year.cashFlowReturn * 100} suffix={'%'} />
                </TableCell>
                <TableCell align="right">
                    <Currency value={year.cashFlowPreTax} prefix={'$'} />
                </TableCell>
                <TableCell align="right">
                    <Currency value={year.cashFlow} prefix={'$'} />
                </TableCell>
                <TableCell align="right">
                    <Currency value={year.capRate * 100} suffix={'%'} />
                </TableCell>
                <TableCell align="right">
                    <Currency value={year.propertySaleReturn * 100} suffix={'%'} />
                </TableCell>
                <TableCell align="right">
                    <Currency value={year.netOperationalIncome} prefix={'$'} />
                </TableCell>
                <TableCell align="right">
                    <Currency value={year.operatingIncome} prefix={'$'} />
                </TableCell>
                <TableCell align="right">
                    <Currency value={year.cashAfterPropertySale} prefix={'$'} />
                </TableCell>
                <TableCell align="right">
                    <Currency value={year.totalExpenses} prefix={'$'} />
                </TableCell>
            </StyledTableRow>
            {showDetails && (
                <TableRow>
                    <TableCell colSpan={11}>
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={devider}
                                    exclusive
                                    onChange={(event: React.MouseEvent<HTMLElement>, newValue: number | null) => {
                                        console.log('New: ', newValue);
                                        if (!newValue) {
                                            return;
                                        }
                                        setDevider(newValue);
                                    }}
                                    aria-label="text alignment">
                                    <ToggleButton value={1} aria-label="centered">
                                        Year
                                    </ToggleButton>
                                    <ToggleButton value={12} aria-label="centered">
                                        Month
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid xs={4}>
                                <b>Principal:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.principalPaid / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Intrest:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.intrestPaid / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Property Tax:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.propertyTax / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Operating Expenses:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.operatingExpenses / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Net Operational Income:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.netOperationalIncome / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Operating Income:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.operatingIncome / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Tax:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.tax / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Total Expenses:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.totalExpenses / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Net Income:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.netIncome / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Cash Flow Pre Tax:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.cashFlowPreTax / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Cash Flow:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.cashFlow / devider)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>House value:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.houseValue)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Cash After Property Sale:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.cashAfterPropertySale)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Total Cash Flow Post Tax:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.totalCashFlowPostTax)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Total profit:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.totalProfit)} prefix={'$'} />
                            </Grid>
                            <Grid xs={4}>
                                <b>Remaining loan:</b>
                                <Currency style={{ marginLeft: '5px' }} value={round(year.remainingLoan)} prefix={'$'} />
                            </Grid>
                        </Grid>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

export default SimulationResultRow;
