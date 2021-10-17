import { controller, get, post } from "../../middleware/decorators"

function sayHelloWorld() {

    return new Promise((resolve, reject) => {

        resolve('Hello world!')
    })
}

@controller()
export class HomeController {

    @get()
    async home() {

        return await sayHelloWorld()
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