import React, { useState } from 'react';
import './App.css';
import { Box } from '@material-ui/core';

import { SocketContext } from './core/reactContexts/socket';
import CarverUserProvider from './core/react/elements/CarverUserProvider';

const App: React.FC = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  return (
    <Box p={2}>
      <SocketContext.Provider value={{ socket, setSocket } as any}>
        <CarverUserProvider />
      </SocketContext.Provider>
    </Box>
  );
}

export default App;
