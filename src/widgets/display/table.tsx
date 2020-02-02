import React, { useState, useEffect, useReducer } from 'react';
import { TableCell, Box, TableContainer, TableHead, TablePagination, TableRow, Table, TableBody, TableFooter } from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

import { commonLanguage } from '../../core/contexts/carverUser/context'
import { Widget } from '../../core/interfaces';


interface Props {
    emit: (type: string, payload: any) => void;
}
const WidgetTableDisplay: React.FC<Props> = ({ emit }) => {

    const getTableDisplay = (widget: Widget) => {
        const { id } = widget;
        const rows = widget.data;

        const onChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
            emit(commonLanguage.commands.Widgets.Command, {
                id,
                type: 'UPDATE_PAGE', //@todo move to blocks commonLanguage
                payload: {
                    page
                }
            })
        }

        const onChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
            console.log('rows per page:', event.target.value);
        }

        const tableRows = rows.map((row: any) => (
            <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                    {row.height}
                </TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.hash}</TableCell>
                <TableCell align="right">{row.txsCount}</TableCell>
                <TableCell align="right">{row.moneysupply}</TableCell>
            </TableRow>
        ));

        return <Box>
            <TableContainer>
                <Table aria-label="simple table" size={'small'}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Block #</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Hash</TableCell>
                            <TableCell align="right">Txs</TableCell>
                            <TableCell align="right">Supply</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRows}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                count={25}
                                rowsPerPage={5}
                                page={1}
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

    return <div>Test</div>
}

export default WidgetTableDisplay;