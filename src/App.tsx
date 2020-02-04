import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';
import axios from 'axios'
import { config } from './config'
import { TextField, Box, Paper, Grid } from '@material-ui/core';

import { reducer, initialState, commonLanguage } from './core/contexts/carverUser/context'
import { Widget } from './core/interfaces';

import { widgetConfigurations } from './widgets/configurations'

const App: React.FC = () => {
  const [logs, setLog] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [socket, setSocket] = useState<SocketIOClient.Socket>();


  const addLog = (log: string) => {
    const timePrefix = new Date().toISOString()
    setLog(logs => logs + `${timePrefix}: ${log}\n`);
  }

  const initConnection = async () => {
    try {
      addLog('Reserving socket connection...');
      const api = axios.create({
        baseURL: config.reservations.endpoint,
        timeout: 1000,
        headers: { 'X-Carver-Framework-Version': config.version }
      });

      const reservationRequest = await api.post('/users/login')

      const id = reservationRequest.data.id;
      addLog(`Connecting to socket server with reservation id: ${id}...`);

      const newReservation = reservationRequest.data.reservation;
      const { websocketEndpoint } = newReservation
      const socket = io(websocketEndpoint, {
        query: { id }
      });
      setSocket(socket);

      socket.on('connect', () => {
        addLog(`Socket connection established successfuly. Welcome to Carver Blockchain Framework!`);

        addLog(`Initializing session...`);
        socket.emit('emit', {
          type: commonLanguage.commands.Connect
        })
      });
      socket.on('disconnect', () => {
        addLog(`Socket disconnected...`);
      });


      socket.on('emit', (event: any) => {
        dispatch(event);
        addLog(`Event: ${JSON.stringify(event)}`);
      });
    } catch (err) {
      // @todo Proper error handling. World's greatest error handling right here.
      console.log(err);
      addLog('Error connecting!');
      alert('Error connecting!')
    }
  }

  const emit = (type: string, payload: any) => {
    if (!socket) {
      return;
    }

    socket.emit('emit', { type, payload })
  }

  const addWidget = (variant: string) => {
    emit(commonLanguage.commands.Widgets.Add, {
      variant
    });
  }
  const removeWidget = (id: number) => {
    emit(commonLanguage.commands.Widgets.Remove, { id });
  }

  useEffect(() => {
    addLog(`Starting Carver Blockchain Framework (Version ${config.version})...`);
    initConnection();
  }, [])

  const getWidgets = () => {


    //@todo move to widgets/display/keyValue
    /*const getKeyValueDisplay = (widget: Widget) => {
      const keys = Object.entries(widget.data);

      return keys.map(([key, value]) => {
        return <Box>
          <Box display="inline" fontWeight="fontWeightBold">{key}</Box>: {value}
        </Box>
      });
    }*/

    const getWidgetDetails = (widget: Widget) => {

      const matchingConfiguration = widgetConfigurations.find(widgetConfiguration => widgetConfiguration.variant === widget.configuration.variant);
      if (!matchingConfiguration) {
        addLog(`Unable to find widget configuration ${widget.configuration.variant}`);

        return null;
      }

      const matchingDisplay = matchingConfiguration.displays.find(widgetDisplay => widgetDisplay.display === widget.configuration.display);
      if (!matchingDisplay) {
        addLog(`Unable to find widget display ${widget.configuration.display} for variant ${widget.configuration.variant}`);

        return null;
      }

      return <matchingDisplay.Element widget={widget as any} emit={emit} />;
    }

    return state.widgets.map((widget: Widget) => {
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
        value={logs}
        InputProps={{
          readOnly: true,
        }}
      />
    </Box>
  );
}

export default App;
