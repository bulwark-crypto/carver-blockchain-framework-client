
import WidgetsContainerElement from './widgetsContainer'
import BlocksElement from './blocks'

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

export { variantConfigurations }