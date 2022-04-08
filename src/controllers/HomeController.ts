import { controller, get, post } from "../middleware/decorators"
import RuleViolationException from '../types/RuleViolationException'

@controller()
export class HomeController {

    @get()
    async home() {

        throw new RuleViolationException ([

             { fieldName: 'firstName', message: 'Required'}
        ])
        // return { message: 'Hello world!'}
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