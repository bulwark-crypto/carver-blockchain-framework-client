import React, { useState, useEffect, useReducer, useContext } from 'react';

import { VariantProps } from './configurations';

import { VariantCommonTable, VariantCommonTableOptions, commonLanguage } from './common/table'

import { SocketContext, SocketContextValue } from '../core/reactContexts/socket'

const VariantBlocks: React.FC<VariantProps> = React.memo(({ object }) => {
    const { emit } = useContext(SocketContext)

    const options: VariantCommonTableOptions = {
        columns: [
            {
                key: 'height',
                title: 'Block #'
            },
            {
                key: 'date',
                title: 'Date'
            },
            {
                key: 'hash',
                title: 'Hash'
            },
            {
                key: 'txsCount',
                title: 'Txs'
            },
            {
                key: 'moneysupply',
                title: 'Supply'
            },
        ],
        clickable: true
    }


    return <VariantCommonTable object={object} options={options} />
})

export default VariantBlocks