import events from 'events'

const em = new events.EventEmitter()

export default {

    publish: (event: string, payload?: any) => {

        em.emit(event, payload)
    },

    subscribe: (event: string, payload?: any) => {

        em.on(event, payload)
    }
}

