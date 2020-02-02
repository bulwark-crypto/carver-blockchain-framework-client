import { Reducer, Event } from "../../interfaces";

const withWidgetEvent = (state: any, event: Event) => {
    const { type, id, payload } = event;

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
            Initialized: 'INTIALIZED', // This event is called by all widgets and contain their initial state

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