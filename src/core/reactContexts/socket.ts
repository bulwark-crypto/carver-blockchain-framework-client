import React, { useState, useEffect, useReducer } from 'react';

export interface SocketContextValue {
    socket: SocketIOClient.Socket;
}

const SocketContext = React.createContext<SocketContextValue>(null as any);

const useSocket = (socket: any) => {
    const emit = (type: string, payload: any) => {
        if (!socket) {
            return;
        }

        socket.emit('emit', { type, payload })
    }

    return {
        emit
    }
}

export { SocketContext, useSocket }