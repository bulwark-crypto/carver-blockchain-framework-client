
import WidgetTableDisplay from './display/table'

const widgetConfigurations = [
    {
        variant: 'blocks',
        title: 'Blocks',

        displays: [
            {
                display: 'table',
                Element: WidgetTableDisplay
            }
        ]
    },
    {
        variant: 'txs',
        title: 'Txs',

        displays: [
            {
                display: 'table',
                Element: WidgetTableDisplay
            }
        ]
    },
    /* {
         variant: 'rpcGetInfo',
         title: 'Network Info',
     },*/
]


export { widgetConfigurations }