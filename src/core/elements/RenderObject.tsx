import React, { useState, useEffect, useReducer, useContext } from 'react';

import WidgetsContainerElement from '../../variants/widgetsContainer'
import BlocksElement from '../../variants/blocks'

import { Reducer, Event, Widget } from "../interfaces";
import { Box } from '@material-ui/core';

import { CarverUserContext } from '../reactContexts/carverUser'
import { SocketContext, useSocket } from '../reactContexts/socket';

export interface VariantProps {
    object: any;
    childrenIds: string[];
}
export interface Configuration {
    variant: string;
    title: string;
    description?: string;
    element: React.FC<VariantProps>;
    options?: any;
}
export interface RenderObjectParams {
    objectId: string;
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

const RenderObject: React.FC<RenderObjectParams> = ({ objectId }) => {
    const { state } = useContext(CarverUserContext);


    const childrenIds = state.children[objectId];
    const object = state.objects[objectId];

    const variantConfiguration = (variantConfigurations as any)[object.variant] as Configuration;
    if (!variantConfiguration) {
        return <Box>Unable to find variant: {object.variant}</Box>
    }

    return <variantConfiguration.element object={object} childrenIds={childrenIds} />
}

export {
    variantConfigurations,
    RenderObject
}