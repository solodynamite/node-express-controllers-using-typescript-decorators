import { toSafePath, cleanPath } from './services/Utils'
import { Request, Response, NextFunction } from 'express'
import 'reflect-metadata'
import RuleViolationException from './types/RuleViolationException'

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

let factory: ControllerServer;

export function controllerServiceFactory(store?: { [className: string]: ControllerInfo }): ControllerServer {

    if (store) {

        factory = new ControllerServer(store)

        return factory
    }

    if (!factory) {

        factory = new ControllerServer({})
    }

    return factory
}

export class ControllerServer {

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

        const constructorArgTypes = Reflect.getMetadata('design:paramtypes', controller);

        const args = constructorArgTypes?.map((i: any) => { return new i() }) || []

        this.store[className].controller = new controller(...args)
    }

    registerPathMethodToController({ className, controller, httpVerb, functionName, path = '/' }: PathMethodToControllerParams) {

        this.registerController(className, path, controller)

        if (this.store[className].httpVerbPaths.some(i => i.path === path && i.httpVerb === httpVerb) === false) {

            this.store[className].httpVerbPaths.push({ path, httpVerb, functionName })
        }
    }

    private static getControllers(source: Array<[string, ControllerInfo]>) {

        const result = source.map(entry => {

            let { path, httpVerbPaths, controller } = entry[1]

            const items = Object.values(httpVerbPaths || []).map((item: any) => {

                const { httpVerb, path: _path, functionName } = item
                
                return {
                    
                    path: toSafePath([path, _path]),
                    
                    httpVerb,

                    controllerFunction: async ({ params, query, body }: Request, response: Response, next: NextFunction) => {

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
                    }
                }
            })

            return items
        })

        return result
    }

    getEndpoints(controllerName: string): { path: string, controllerFunction: Function, httpVerb: string }[] {

        let result: any = ControllerServer.getControllers(Object.entries(this.store).filter(i => i[0] === controllerName))

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