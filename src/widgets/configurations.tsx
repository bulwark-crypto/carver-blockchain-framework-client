
import { WidgetTableDisplay, TableDisplayOptions } from './display/table'

export interface Configuration {
    variant: string;
    title: string;
    element: React.FC<any>;
    options: any;
}

const widgetConfigurations: Configuration[] = [
    {
        variant: 'blocks',
        title: 'Blocks',

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
    },
    {
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
    },
    /* {
         variant: 'rpcGetInfo',
         title: 'Network Info',
     },*/
]


export { widgetConfigurations }