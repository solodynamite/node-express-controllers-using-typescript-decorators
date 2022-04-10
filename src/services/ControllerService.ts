import { toSafePath, cleanPath } from './Utils'
import { Request, Response, NextFunction } from 'express'
import RuleViolationException from '../types/RuleViolationException'

class ControllerItem {

    public path?: string
    public httpMethodPaths: ControllerHttpMethodPath[] = []
}

class ControllerHttpMethodPath {

    public path?: string
    public httpMethod!: string
    public functionName!: string
    public fn!: Function
}

class PathMethodToControllerParams {

    public className!: string
    public httpMethod!: string
    public functionName!: string
    public func!: Function
    public path?: string
}

let factory: ControllerService;

export function controllerServiceFactory(store?: { [className: string]: ControllerItem }): ControllerService {

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

    store: { [className: string]: ControllerItem }

    constructor(store: { [className: string]: ControllerItem }) {

        this.store = store
    }

    registerController(className: string, path: string = '/') {

        path = cleanPath(path)

        if (!this.store[className]) {

            return this.store[className] = { path, httpMethodPaths: [] }
        }

        this.store[className].path = path;
    }

    registerRulesToController({ className, httpMethod, functionName, func: fn, path = '/' }: PathMethodToControllerParams) {

        this.registerController(className, path)

        this.registerPathMethodToController({ className, httpMethod, functionName, func: fn, path })

        const targetMethod = this.store[className].httpMethodPaths.find(i => i.path === path && i.httpMethod === httpMethod)

        debugger
    }

    registerPathMethodToController({ className, httpMethod, functionName, func: fn, path = '/' }: PathMethodToControllerParams) {

        this.registerController(className, path)

        if (this.store[className].httpMethodPaths.some(i => i.path === path && i.httpMethod === httpMethod) === false) {

            this.store[className].httpMethodPaths.push({ path, httpMethod, functionName, fn: fn })
        }
    }

    private static getControllers(source: Array<[string, ControllerItem]>) {

        return source.map(entry => {

            let { path, httpMethodPaths } = entry[1]

            const result = Object.values(httpMethodPaths || []).map((item: any) => {

                const { httpMethod, path: _path, fn } = item

                return {

                    path: toSafePath([path, _path]),

                    fn: async ({ params, query, body }: Request, response: Response, next: NextFunction) => {

                        try {

                            const result = await fn({ ...params, ...query, ...body })

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

                    httpMethod
                }
            })

            return result
        })
    }

    getEndpoints(controllerName: string): { path: string, fn: Function, httpMethod: string }[] {

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

            const endpointInfos = controllerItem.httpMethodPaths.map(({ path, httpMethod, functionName }) => { return { path, httpMethod, functionName } })

            endpointInfos.forEach(i => {

                const _ = endpointInfos.filter(x => i.httpMethod === x.httpMethod && i.path === x.path && i.functionName !== x.functionName)[0]

                if (_)

                    throw new Error(`duplicate path '${i.path}' to ${controllerName}.${i.functionName}; already given to function, ${controllerName}.${_.functionName}`)
            })
        })

        this.store = {}
    }
}