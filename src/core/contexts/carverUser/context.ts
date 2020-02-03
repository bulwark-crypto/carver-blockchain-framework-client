import { Reducer, Event, Widget } from "../../interfaces";

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

}

const reducer: Reducer = (state, event) => {
    const { type, payload } = event;

    switch (type) {
        case commonLanguage.events.Widgets.Emitted:
            return withWidgetEvent(state, payload);
        case commonLanguage.events.Widgets.Removed:
            const { id } = payload; // id of widget to remove
            return {
                ...state,
                widgets: state.widgets.filter((widget: any) => widget.id !== id)
            }

    }
    return state
}

const commonLanguage = {
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
        Widgets: {
            Initialized: 'INTIALIZED', // This event is emitted by all widgets and contain their initial state
            StateUpdated: 'STATE_UPDATED', // This event is emitted when a widget state changes. It will contain a new state for the widget (this can only contain a few keys)

            Emitted: 'WIDGETS:EMITTED',
            Removed: 'WIDGETS:REMOVED',
        }
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