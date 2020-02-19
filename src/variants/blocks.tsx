import React from 'react';
import { VariantProps } from '../core/elements/RenderObject';
import { VariantCommonTable, VariantCommonTableOptions } from './common/table'

const VariantBlocks: React.FC<VariantProps> = React.memo(({ object, childrenIds }) => {
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


    return <VariantCommonTable object={object} childrenIds={childrenIds} options={options} />
})

export default VariantBlocks