import { controllerFactory } from "../server.controller";

const ctlrFactory = controllerFactory()

function registerPathMethodToControllerServiceFactory(httpVerb: string, controller: any, functionName: string, funcDescriptor: PropertyDescriptor, path: string) {

    const { name: className } = controller.constructor;

    ctlrFactory.registerPathMethodToController({ className, controller, httpVerb, functionName, path });
}

export function controller(path: string = '/') {

    return function (controller: any) {

        const { name: className } = controller;

        ctlrFactory.registerController(className, path, controller)
    };
}

export const get = (path: string = '/') => (controller: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    registerPathMethodToControllerServiceFactory('get', controller, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const post = (path: string = '/') => (controller: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    registerPathMethodToControllerServiceFactory('post', controller, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const put = (path: string = '/') => (controller: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    registerPathMethodToControllerServiceFactory('put', controller, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const del = (path: string = '/') => (controller: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    registerPathMethodToControllerServiceFactory('delete', controller, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const rules = (...funcs: Function[]) => (target:any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    // registerRulesToControllerServiceFactory()
}