import React, { useState, useEffect, useReducer } from 'react';
import { TableCell, Box, TableContainer, TableHead, TablePagination, TableRow, Table, TableBody, TableFooter } from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

import { commonLanguage as carverUserCommonLanguage } from '../../core/contexts/carverUser/context'
import { Widget } from '../../core/interfaces';

interface PageQuery {
    page: number;
    limit: number;
}
interface WidgetWithTableDisplay extends Widget {
    page: number;
    count: number; // Total number of records
    pageQuery: PageQuery;
    rows: any[];
}
interface Props {
    emit: (type: string, payload: any) => void;
    widget: WidgetWithTableDisplay;
}
const commonLanguage = {
    commands: {
        UpdatePage: 'UPDATE_PAGE',
        UpdateLimit: 'UPDATE_LIMIT'
    }
}
const WidgetTableDisplay: React.FC<Props> = ({ emit, widget }) => {


    const { id, rows } = widget;
    const { variant } = widget.configuration;

    const onChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        emit(carverUserCommonLanguage.commands.Widgets.Command, {
            id,
            type: commonLanguage.commands.UpdatePage,
            payload: {
                page
            }
        })
    }

    const onChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
        const limit = event.target.value
        emit(carverUserCommonLanguage.commands.Widgets.Command, {
            id,
            type: commonLanguage.commands.UpdateLimit,
            payload: {
                limit
            }
        })
    }

    const tableRows = rows.map((row: any) => {
        //@todo this is just tempoary until we go through each key to display
        if (variant === 'txs') {
            return (<TableRow key={row.id}>
                <TableCell component="th" scope="row">
                    {row.height}
                </TableCell>
                <TableCell align="right">{row.txid}</TableCell>
            </TableRow>)

        }
        return (<TableRow key={row.id}>
            <TableCell component="th" scope="row">
                {row.height}
            </TableCell>
            <TableCell align="right">{row.date}</TableCell>
            <TableCell align="right">{row.hash}</TableCell>
            <TableCell align="right">{row.txsCount}</TableCell>
            <TableCell align="right">{row.moneysupply}</TableCell>
        </TableRow>)
    });

    const getTableHead = () => {
        //@todo this is just tempoary until we go through each key to display
        if (variant === 'txs') {
            return (<TableRow>
                <TableCell>Block #</TableCell>
                <TableCell align="right">Transaction</TableCell>
            </TableRow>)
        }
        return (<TableRow>
            <TableCell>Block #</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Hash</TableCell>
            <TableCell align="right">Txs</TableCell>
            <TableCell align="right">Supply</TableCell>
        </TableRow>)
    }

    return <Box>
        <TableContainer>
            <Table aria-label="simple table" size={'small'}>
                <TableHead>
                    {getTableHead()}
                </TableHead>
                <TableBody>
                    {tableRows}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={widget.count}
                            rowsPerPage={widget.pageQuery.limit}
                            page={widget.pageQuery.page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: false,
                            }}

                            onChangePage={onChangePage}
                            onChangeRowsPerPage={onChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </Box>

}

export default WidgetTableDisplay;