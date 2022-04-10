import { controller, get, post, rules } from "../middleware/decorators"
import repeat_passwords_must_match from "../services/rules/repeat_passwords_must_match"
import RuleViolationException from '../types/RuleViolationException'

@controller()
export class HomeController {

    @get()
    @rules(repeat_passwords_must_match)
    async home() {

        // throw new RuleViolationException ([

        //      { fieldName: 'firstName', message: 'Required'}
        // ])
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