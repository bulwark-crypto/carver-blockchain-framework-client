import React, { useState, useEffect, useReducer } from 'react';


export interface SocketContextValue {
    emit: (type: string, payload: any) => void;
}

const SocketContext = React.createContext<SocketContextValue>(null as any);

export { SocketContext }