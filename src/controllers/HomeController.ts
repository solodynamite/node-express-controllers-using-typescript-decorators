import { controller, get, post } from "../middleware/decorators"
import { HelloService } from "../services/HelloService";
import { SayService } from "../services/SayService";

@controller()
export class HomeController {

    constructor(private helloService: HelloService, private sayService: SayService) {}

    @get()
    async home() {

        const message = this.helloService.sayHello() + this.sayService.saySomething()

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