import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import { config } from './config'
import { TextField, Box } from '@material-ui/core';

import { reducer as carverUserReducer, initialState as carverUserInitialState } from './core/contexts/publicState/context'
import { reducer as loggerReducer, initialState as loggerInitialState, commonLanguage as loggerCommonLanguage } from './core/contexts/logger/context'

import { renderObject } from './variants/configurations'

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

  useEffect(() => {
    addLog(`Starting Carver Blockchain Framework (Version ${config.version})...`);
    initConnection();
  }, [])

  const renderRootObject = () => {
    const rootObject = carverUserState.root;

    if (!rootObject) {
      return <Box>Loading...</Box>
    }
    return renderObject({
      object: rootObject,
      state: carverUserState,
      emit
    });
  }

  return (
    <Box p={2}>
      {renderRootObject()}
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
