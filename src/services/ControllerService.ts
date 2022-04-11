import { toSafePath, cleanPath } from './Utils'
import { Request, Response, NextFunction } from 'express'
import RuleViolationException from '../types/RuleViolationException'

class ControllerInfo {

    public path?: string
    public httpVerbPaths: ControllerHttpMethodPath[] = []
    public controller?: any
}

class ControllerHttpMethodPath {

    public path?: string
    public httpVerb!: string
    public functionName!: string
}

class PathMethodToControllerParams {

    public className!: string
    public httpVerb!: string
    public functionName!: string
    public path?: string
    public controller: any
}

export interface IController { }

let factory: ControllerService;

export function controllerServiceFactory(store?: { [className: string]: ControllerInfo }): ControllerService {

    if (store) {

        factory = new ControllerService(store)

        return factory
    }

    if (!factory) {

        factory = new ControllerService({})
    }

    return factory
}

export class ControllerService {

    store: { [className: string]: ControllerInfo }

    constructor(store: { [className: string]: ControllerInfo }) {

        this.store = store
    }

    registerController(className: string, path: string = '/', controller: any) {

        path = cleanPath(path)

        if (!this.store[className]) {

            this.store[className] = { path, httpVerbPaths: [] }
        }

        this.store[className].path = path

        if (!controller.prototype) return

        console.log(controller.constructor)

        this.store[className].controller = new controller()
    }

    registerPathMethodToController({ className, controller, httpVerb, functionName, path = '/' }: PathMethodToControllerParams) {

        this.registerController(className, path, controller)

        if (this.store[className].httpVerbPaths.some(i => i.path === path && i.httpVerb === httpVerb) === false) {

            this.store[className].httpVerbPaths.push({ path, httpVerb, functionName })
        }
    }

    private static getControllers(source: Array<[string, ControllerInfo]>) {

        return source.map(entry => {

            let { path, httpVerbPaths, controller } = entry[1]

            const result = Object.values(httpVerbPaths || []).map((item: any) => {

                const { httpVerb, path: _path, functionName } = item

                return {

                    path: toSafePath([path, _path]),

                    fn: async ({ params, query, body }: Request, response: Response, next: NextFunction) => {

                        try {

                            const result = await controller[functionName]({ ...params, ...query, ...body })

                            if (!result) return;

                            response.send(result)
                        }
                        catch (err) {

                            if (err instanceof RuleViolationException) {

                                return response.status(422).send({ violationInfos: err.violationInfos })
                            }

                            response.status(500).send({ message: (<any>err).message })
                        }
                    },

                    httpVerb
                }
            })

            return result
        })
    }

    getEndpoints(controllerName: string): { path: string, fn: Function, httpVerb: string }[] {

        let result: any = ControllerService.getControllers(Object.entries(this.store).filter(i => i[0] === controllerName))

        result = [].concat.apply([], result)

        return result;
    }

    validateAndClear() {

        const controllerNamesWithPaths = Object.entries(this.store).map(item => {

            return {

                name: item[0], path: item[1].path
            }
        })

        controllerNamesWithPaths.forEach(i => {

            const _ = controllerNamesWithPaths.filter(x => i.name !== x.name && i.path === x.path)[0];

            if (_)

                throw new Error(`duplicate controller path '${_.path}' to ${_.name}; already given to ${i.name}`)
        })

        Object.entries(this.store).forEach(item => {

            const controllerName = item[0]

            const controllerItem = item[1]

            const endpointInfos = controllerItem.httpVerbPaths.map(({ path, httpVerb, functionName }) => { return { path, httpVerb, functionName } })

            endpointInfos.forEach(i => {

                const _ = endpointInfos.filter(x => i.httpVerb === x.httpVerb && i.path === x.path && i.functionName !== x.functionName)[0]

                if (_)

                    throw new Error(`duplicate path '${i.path}' to ${controllerName}.${i.functionName}; already given to function, ${controllerName}.${_.functionName}`)
            })
        })

        this.store = {}
    }
}