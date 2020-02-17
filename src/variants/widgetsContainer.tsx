import React, { useContext } from 'react';
import { VariantProps, renderObject } from './configurations';
import { Box, Grid, Button, Paper } from '@material-ui/core';

import { commonLanguage as carverUserCommonLanguage } from '../core/contexts/publicState/context'
import { CarverUserContext, CarverUserContextValue } from '../core/reactContexts/carverUser'
import { SocketContext, SocketContextValue } from '../core/reactContexts/socket'

const WidgetTableDisplay: React.FC<VariantProps> = ({ object }) => {
    const { state } = useContext(CarverUserContext)
    const { emit } = useContext(SocketContext)

    const addWidget = (variant: string) => {
        emit(carverUserCommonLanguage.commands.Widgets.Add, {
            variant
        });
    }
    const removeWidget = (id: number) => {
        emit(carverUserCommonLanguage.commands.Widgets.Remove, { id });
    }

    const renderWidgets = () => {
        const widgetObjectIds = state.children[object.id]
        if (!widgetObjectIds) {
            return null;
        }

        return widgetObjectIds.map((widgetObjectId: any) => {
            return <Paper key={widgetObjectId}>
                <Box p={1} m={1}>
                    <Button variant="contained" onClick={() => removeWidget(widgetObjectId)}>
                        Remove
                    </Button>
                    {renderObject({
                        object: state.objects[widgetObjectId]
                    })}

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