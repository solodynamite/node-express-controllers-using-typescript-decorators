import { controller, get } from "../middleware/decorators";
import { ExpressParams } from "../middleware/params";

@controller("/test")
export class TestController {

    @get()
    test() {

        return { message: 'test' };
    }

    @get('/say-hello/:firstName')
    sayHello({ request, response, next }: ExpressParams) {

        const { firstName } = request.params

        response.send(`Hello ${firstName}`)
    }
}