import { controller, get, post } from "../middleware/decorators"

@controller()
export class HomeController {

    @get()
    async home() {

        return { message: 'Hello world!'}
    }

    @get('/say-hello/:firstName')
    sayHello({ firstName, id }: any) {

        return `Hello ${firstName} with id ${id}`
    }

    @post()
    postHello(body: any) {

        return body
    }
}