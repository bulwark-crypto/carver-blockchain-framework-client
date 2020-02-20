import { Reducer, Event, Widget } from "../../interfaces";

const reducer: Reducer = (state, event) => {
    const { type, payload } = event; // payload will be array

    return payload.reduce((state: any, actionPayload: any) => {
        const { id, parent } = actionPayload;

        switch (type) {
            case commonLanguage.events.Pushed:
                return {
                    ...state,
                    objects: {
                        ...state.objects,
                        [id]: actionPayload
                    },
                    children: {
                        [parent]: (state.children[parent] ? [...state.children[parent], id] : [id])
                    },
                    rootId: (!parent ? id : state.rootId)
                }
            case commonLanguage.events.Reduced:
                return {
                    ...state,
                    objects: {
                        ...state.objects,
                        [id]: {
                            ...state.objects[id],
                            ...actionPayload
                        }
                    }
                }
        }
        return state
    }, state)

}
// Alternative is to nest children inside object:
/*objects: {
    ...state.objects,
    [id]: payload,
    [parent]: {
        ...state.objects[parent],
        children: [
            ...(state.objects[parent] && state.objects[parent].children ? [...state.objects[parent].children] : []),
            id
        ]
    }
},*/

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
        Pages: {
            Navigate: 'NAVIGATE'
        },
    },

    events: {
        Pushed: 'PUSHED',
        Reduced: 'REDUCED'
    }
}
const initialState = {
    objects: {},
    children: {},
    root: null
}

export {
    initialState,
    reducer,
    commonLanguage
}