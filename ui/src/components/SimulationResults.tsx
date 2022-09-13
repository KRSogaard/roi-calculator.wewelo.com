import React, { useState, useEffect, FunctionComponent } from 'react';
import { ISimulationResult, IYearResult } from '../Simulator';
import CurrencyFormat from 'react-currency-format';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface SimulationResultsProps {
    result: ISimulationResult | undefined;
}

function SimulationResults(props: SimulationResultsProps) {
    let years: IYearResult[] = [];
    if (props.result !== undefined) {
        years = props.result.years;
    }

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

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell align="right" title="Pre-tax casflow devided by the total acquisition cost">
                            Cash on Cash Return
                        </TableCell>
                        <TableCell align="right" title="Post-tax casflow devided by the total acquisition cost">
                            Cash on Cash Return (Post-Tax)
                        </TableCell>
                        <TableCell align="right" title="Total cashflow before tax">
                            Cashflow (Pre-Tax)
                        </TableCell>
                        <TableCell align="right" title="Total cashflow after tax">
                            Cashflow (Post-Tax)
                        </TableCell>
                        <TableCell title="Net operational Income / Total acquisition cost, this dose not include mortages and taxes">CapRate</TableCell>
                        <TableCell title="The annual return based sale of the property plus post tax cash flow devided by the total acquisition cost">
                            Property Sale Return
                        </TableCell>
                        <TableCell title="Net operational income: Rent income minus operation expenses such as insurance, utilites, maintenance, management fee and property tax">
                            NOI
                        </TableCell>
                        <TableCell title="Rent income minus vacancy and operation expenses such as insurance, utilites, maintenance, management fee and property tax">
                            Operating Income
                        </TableCell>
                        <TableCell title="Cash left after sale, and all expenses has been paid">Cash after property sale</TableCell>
                        <TableCell title="all expenses, including taxes">Total expenses</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {years &&
                        years.map((year) => (
                            <StyledTableRow key={'SimulationYear' + year.year} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <StyledTableCell component="th" scope="row" align="right">
                                    {year.year}
                                </StyledTableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.cashOnCashReturn * 100}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'%'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.cashFlowReturn * 100}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'%'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.cashFlowPreTax}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.cashFlow}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.capRate * 100}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'%'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.propertySaleReturn * 100}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'%'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.netOperationalIncome}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.operatingIncome}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.cashAfterPropertySale}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyFormat
                                        value={year.totalExpenses}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </TableCell>
                            </StyledTableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default SimulationResults;
