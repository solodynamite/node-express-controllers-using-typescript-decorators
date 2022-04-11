import { controller, get, post, rules } from "../middleware/decorators"
import { HelloService } from "../services/HelloService";

@controller()
export class HomeController {

    constructor(private readonly helloService: HelloService) {
        // this.helloService = new HelloService()
    }

    @get()
    async home() {

        const message = this.helloService.sayHello()

        return { message }
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