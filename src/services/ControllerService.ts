import { toSafePath, cleanPath } from './Utils'
import RuleViolationException from '../types/RuleViolationException'

class ControllerItem {

    public path?: string
    public methodPaths: ControllerMethodPath[] = []
}

class ControllerMethodPath {

    public path?: string
    public method!: string
    public functionName!: string
    public fn!: Function
}

class PathMethodToControllerParams {

    public className!: string
    public method!: string
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

    resolveControllerItem(className: string, path: string = '/') {

        path = cleanPath(path)

        if (!this.store[className]) {

            return this.store[className] = { path, methodPaths: [] }
        }

        this.store[className].path = path;
    }

    resolvePathMethodToController({ className, method, functionName, func: fn, path = '/' }: PathMethodToControllerParams) {

        this.resolveControllerItem(className, path)

        this.store[className].methodPaths.push({ path, method, functionName, fn: fn })
    }

    private static getControllers(source: Array<[string, ControllerItem]>) {

        return source.map(entry => {

            let { path, methodPaths } = entry[1]

            const result = Object.values(methodPaths || []).map((item: any) => {

                const { method, path: _path, fn } = item

                return {

                    path: toSafePath([path, _path]),

                    fn: async ({ params, query, body }: any, response: any, next: any) => {

                        try {

                            const result = await fn({ ...params, ...query, ...body })

                            if (!result) return;

                            response.send(result)
                        }
                        catch (err) {

                            if (err instanceof RuleViolationException) {

                                return response.status(422).send({ violations: err.violationInfos })
                            }

                            response.status(500).send({ message: (<any>err).message })
                        }
                    },

                    method
                }
            })

            return result
        })
    }

    getEndpoints(controllerName: string): { path: string, fn: Function, method: string }[] {

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

            const endpointInfos = controllerItem.methodPaths.map(({ path, method, functionName }) => { return { path, method, functionName } })

            endpointInfos.forEach(i => {

                const _ = endpointInfos.filter(x => i.method === x.method && i.path === x.path && i.functionName !== x.functionName)[0]

                if (_)

                    throw new Error(`duplicate path '${i.path}' to ${controllerName}.${i.functionName}; already given to function, ${controllerName}.${_.functionName}`)
            })
        })

        this.store = {}
    }
}