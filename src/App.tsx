import React, { useState, useEffect, useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';
import axios from 'axios'
import { config } from './config'
import { TextField, Box, Paper, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

const widgetTypes = [
  {
    variant: 'blocks',
    title: 'Blocks',
  },
  {
    variant: 'rpcGetInfo',
    title: 'Network Info',
  },
]

const initialState = {
  emit: [],
  widgets: []
}

interface Event {
  id: number;
  type: string;
  payload: any;
}
type Reducer = (state: any, event: Event) => any;

interface WidgetConfiguration {
  variant: string;
  display: string;
}
interface Widget {
  id: number;
  configuration: WidgetConfiguration;
  data: any;
}

const commonLanguage = {
  commands: {
    Connect: 'CONNECT',

    Widgets: {
      Add: 'WIDGETS:ADD',
      Remove: 'WIDGETS:REMOVE',
      Emit: 'WIDGETS:EMIT'
    },
  },
  events: {
    Widgets: {
      Initialized: 'INTIALIZED', // This event is called by all widgets and contain their initial state

      Emitted: 'WIDGETS:EMITTED',
      Removed: 'WIDGETS:REMOVED',
    }
  }
}

const withWidgetEvent = (state: any, event: Event) => {
  const { type, id, payload } = event;

  switch (type) {
    case commonLanguage.events.Widgets.Initialized:
      // When widgets are initialized they're added to the state widgets with the provided payload
      return {
        ...state,
        widgets: [
          ...state.widgets,
          { id, ...payload }
        ]
      }
  }
  return state

}

const reducer: Reducer = (state, event) => {
  const { type, payload } = event;

  switch (type) {
    case commonLanguage.events.Widgets.Emitted:
      return withWidgetEvent(state, payload);
    case commonLanguage.events.Widgets.Removed:
      const { id } = payload; // id of widget to remove
      return {
        ...state,
        widgets: state.widgets.filter((widget: any) => widget.id !== id)
      }

  }
  return state
}

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

      socket.on('connect', (test: any) => {
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

    const getTableDisplay = (widget: Widget) => {
      const rows = widget.data;

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
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
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
          </Table>
        </TableContainer>
      </Box>
    }

    const getKeyValueDisplay = (widget: Widget) => {
      const keys = Object.entries(widget.data);

      return keys.map(([key, value]) => {
        return <Box>
          <Box display="inline" fontWeight="fontWeightBold">{key}</Box>: {value}
        </Box>
      });
    }

    const getWidgetDetails = (widget: Widget) => {

      switch (widget.configuration.display) {
        case 'table':
          return getTableDisplay(widget)
        case 'keyValue':
          return getKeyValueDisplay(widget)

      }

    }

    return state.widgets.map((widget: Widget) => {
      console.log('***widget:', widget);




      return (
        <Paper>
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
              <Button variant="contained" onClick={() => addWidget('networkInfo')}>
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
