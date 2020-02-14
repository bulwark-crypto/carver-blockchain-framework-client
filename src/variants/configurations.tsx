import React, { useState, useEffect, useReducer } from 'react';

import WidgetsContainerElement from '../variants/widgetsContainer'
import BlocksElement from '../variants/blocks'

import { Reducer, Event, Widget } from "../core/interfaces";
import { Box } from '@material-ui/core';

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
    emit: (type: string, payload: any) => void;
}

export interface VariantProps {
    object: any;
    state: any;
    emit: (type: string, payload: any) => void;
}

const variantConfigurations = {
    widgetsContainer: {
        title: 'Widgets Container',
        description: 'This variant contains a set of widgets. Children of this object are further rendered as variants',

        element: WidgetsContainerElement,
    } as Configuration,
    blocks: {
        title: 'Blocks',

        element: BlocksElement
    } as Configuration,
}

const renderObject = ({ object, state, emit }: RenderObjectParams) => {
    const variantConfiguration = (variantConfigurations as any)[object.variant] as Configuration;
    if (!variantConfiguration) {
        return <Box>Unable to find variant: {object.variant}</Box>
    }

    return <variantConfiguration.element object={object} state={state} emit={emit} />
}


export {
    variantConfigurations,
    renderObject
}