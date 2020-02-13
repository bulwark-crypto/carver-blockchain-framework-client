import { Reducer, Event, Widget } from "../../interfaces";

const reducer: Reducer = (state, event) => {
    const { type, payload } = event;
    const { id, parent } = payload;

    switch (type) {
        case commonLanguage.events.Pushed:
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [id]: payload
                },
                root: (!parent ? payload : state.root)
            }
        case commonLanguage.events.Reduced:
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [id]: payload
                }
            }
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
        Pushed: 'PUSHED',
        Reduced: 'REDUCED'
    }
}
const initialState = {
    objects: {},
    root: null
}

export {
    initialState,
    reducer,
    commonLanguage
}