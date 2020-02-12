import { Reducer, Event, Widget } from "../../interfaces";
/*
const withWidgetEvent = (state: any, event: Event) => {
    const { type, id, payload } = event;

    console.log('*Widget Event:', event);
    switch (type) {
        case commonLanguage.events.Widgets.Initialized:
            // When widgets are initialized they're added to the state widgets with the provided payload
            return {
                ...state,
                widgets: [
                    ...state.widgets,
                    { id, ...payload }
                ]
            }
            break;
        case commonLanguage.events.Widgets.StateUpdated:
            // Find widget we're trying to update and change it's state
            const widgets = state.widgets.map((widget: Widget) => {
                if (widget.id === id) {
                    return {
                        ...widget,
                        ...event.payload
                    }
                }

                return widget;
            })

            return {
                ...state,
                widgets
            }

            break;

    }
    return state

}*/

const reducer: Reducer = (state, event) => {
    const { type, payload } = event;

    switch (type) {
        case commonLanguage.events.Reset:
            console.log('** state Reset:', state, event);
            return state;
        case commonLanguage.events.Appended:
            console.log('** state appended:', state, event);
            return state;

    }
    return state
}

const commonLanguage = {
    //@todo move commands to carverUser context
    commands: {
        Connect: 'CONNECT',

        Widgets: {
            Add: 'WIDGETS:ADD',
            Remove: 'WIDGETS:REMOVE',
            Emit: 'WIDGETS:EMIT',
            Command: 'WIDGETS:COMMAND',
        },
    },
    events: {
        Reset: 'RESET',
        Appended: 'APPENDED'
    }
}
const initialState = {
    emit: [],
    widgets: []
}

export {
    initialState,
    reducer,
    commonLanguage
}