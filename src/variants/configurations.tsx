import React, { useState, useEffect, useReducer } from 'react';

import WidgetsContainerElement from '../variants/widgetsContainer'

import { Reducer, Event, Widget } from "../core/interfaces";

export interface Configuration {
    variant: string;
    title: string;
    description?: string;
    element: React.FC<any>;
    options?: any;
}
export interface RenderObjectParams {
    object: any;
    state: any;
    dispatch: React.Dispatch<Event>;
}

const variantConfigurations = {
    widgetsContainer: {
        title: 'Widgets Container',
        description: 'This variant contains a set of widgets. Children of this object are further rendered as variants',

        element: WidgetsContainerElement,
        /*options: {
            columns: [
                {
                    key: 'page',
                    title: 'Page',
                    sortable: true
                }
            ]
        } as TableDisplayOptions*/
    } as Configuration,
    /*{
        variant: 'txs',
        title: 'Txs',

        element: WidgetTableDisplay,
        options: {
            columns: [
                {
                    key: 'page',
                    title: 'Page',
                    sortable: true
                }
            ]
        } as TableDisplayOptions
    },*/
    /* {
         variant: 'rpcGetInfo',
         title: 'Network Info',
     },*/
}

const renderObject = ({ object, state, dispatch }: RenderObjectParams) => {
    const variantConfiguration = (variantConfigurations as any)[object.variant] as Configuration;

    return <variantConfiguration.element object={object} state={state} dispatch={dispatch} />
}


export { variantConfigurations, renderObject }