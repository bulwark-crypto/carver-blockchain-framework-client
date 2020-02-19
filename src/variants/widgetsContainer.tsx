import React, { useContext } from 'react';
import { RenderObject } from '../core/react/elements/RenderObject';
import { VariantProps } from './configuration'
import { Box, Grid, Button, Paper } from '@material-ui/core';

import { commonLanguage as carverUserCommonLanguage } from '../core/carver/contexts/publicState/context'
import { CarverUserContext, CarverUserContextValue } from '../core/react/contexts/CarverUser'
import { SocketContext, SocketContextValue, useSocket } from '../core/react/contexts/Socket'

const WidgetTableDisplay: React.FC<VariantProps> = ({ object, childrenIds }) => {
    const { socket } = useContext(SocketContext)
    const { emit } = useSocket(socket);

    const addWidget = (variant: string) => {
        emit(carverUserCommonLanguage.commands.Widgets.Add, {
            variant
        });
    }
    const removeWidget = (id: number) => {
        emit(carverUserCommonLanguage.commands.Widgets.Remove, { id });
    }

    const renderWidgets = () => {
        if (!childrenIds) {
            return null;
        }

        return childrenIds.map((childId: any) => {
            return <Paper key={childId}>
                <Box p={1} m={1}>
                    <Button variant="contained" onClick={() => removeWidget(childId)}>
                        Remove
                    </Button>
                    <RenderObject objectId={childId} />
                </Box>
            </Paper>
        })
    }

    return <div>
        <Box mb={3}>
            <Grid container>
                <Grid item>
                    <Button variant="contained" onClick={() => addWidget('blocks')}>
                        Add Blocks Widget
                     </Button>
                </Grid>
                <Grid item>
                    <Box mx={3}>
                        <Button variant="contained" onClick={() => addWidget('txs')}>
                            Add Network Info Widget
                      </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        {renderWidgets()}
    </div>

}

export default WidgetTableDisplay