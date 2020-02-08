import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import { config } from './config'
import { TextField, Box, Paper, Grid } from '@material-ui/core';

import { reducer as carverUserReducer, initialState as carverUserInitialState, commonLanguage as carverUserCommonLanguage } from './core/contexts/carverUser/context'
import { reducer as loggerReducer, initialState as loggerInitialState, commonLanguage as loggerCommonLanguage } from './core/contexts/logger/context'
import { Widget } from './core/interfaces';

import { widgetConfigurations } from './widgets/configurations'

import { initReservationService } from './core/reservations'

const App: React.FC = () => {
  const [carverUserState, carverUserDispatch] = useReducer(carverUserReducer, carverUserInitialState);
  const [loggerState, loggerDispatch] = useReducer(loggerReducer, loggerInitialState);
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  const addLog = (...args: any) => {
    loggerDispatch({ type: loggerCommonLanguage.commands.Add, payload: args });
  }

  const initConnection = async () => {
    try {
      //@todo we don't need this initializer. We need to create contextStore and then access these contexts internally
      //For now this is a decent shortcut until we figure out what other contexts there are on frontend
      const reservationService = initReservationService({
        loggerDispatch,
        carverUserDispatch
      })

      const reservationResponse = await reservationService.getNewReservation()

      const socket = reservationService.getSocket(reservationResponse);

      setSocket(socket);

      reservationService.bindReservation(socket);
    } catch (err) {
      // @todo Proper error handling. World's greatest error handling right here.
      console.log(err);
      addLog(err);
    }
  }

  const emit = (type: string, payload: any) => {
    if (!socket) {
      return;
    }

    socket.emit('emit', { type, payload })
  }

  const addWidget = (variant: string) => {
    emit(carverUserCommonLanguage.commands.Widgets.Add, {
      variant
    });
  }
  const removeWidget = (id: number) => {
    emit(carverUserCommonLanguage.commands.Widgets.Remove, { id });
  }

  useEffect(() => {
    addLog(`Starting Carver Blockchain Framework (Version ${config.version})...`);
    initConnection();
  }, [])

  const getWidgets = () => {

    const getWidgetDetails = (widget: Widget) => {

      const configuration = widgetConfigurations.find(widgetConfiguration => widgetConfiguration.variant === widget.configuration.variant);
      if (!configuration) {
        addLog(`Unable to find widget configuration ${widget.configuration.variant}`);

        return null;
      }

      const { element: Element } = configuration

      return <Element widget={widget as any} emit={emit} configuration={configuration} />;
    }

    return carverUserState.widgets.map((widget: Widget) => {
      return (
        <Paper key={widget.id}>
          <Box p={1} m={1}>
            <Button variant="contained" onClick={() => removeWidget(widget.id)}>
              Remove
            </Button>

            {getWidgetDetails(widget)}
          </Box>
        </Paper >)
    });
  }

  return (
    <Box p={2}>
      {/*@todo convert these buttons to dropdown menu*/}
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
      {getWidgets()}
      <TextField
        label="Debug Log"
        fullWidth={true}
        multiline={true}
        value={loggerState.textLog}
        InputProps={{
          readOnly: true,
        }}
      />
    </Box>
  );
}

export default App;
