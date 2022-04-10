import { controllerServiceFactory } from "../services/ControllerService";
import { ExpressParams } from "./params";

const ctrlSvcFactory = controllerServiceFactory()

function registerPathMethodToControllerServiceFactory(httpMethod: string, target: any, functionName: string, funcDescriptor: PropertyDescriptor, path: string) {

    const { name: className } = target.constructor;

    ctrlSvcFactory.registerPathMethodToController({ className, httpMethod, functionName, func: funcDescriptor.value, path });
}

function registerRulesToControllerServiceFactory(target: any, functionName: string, funcDescriptor: PropertyDescriptor, path: string) {

    const { name: className } = target.constructor;

    // ctrlSvcFactory.registerRulesToController({ className, functionName, func: funcDescriptor.value, path });
}

export function controller(path: string = '/') {

    return function (target: Function) {

        const { name: className } = target;

        ctrlSvcFactory.registerController(className, path)
    };
}

export const get = (path: string = '/') => (target: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    registerPathMethodToControllerServiceFactory('get', target, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const post = (path: string = '/') => (target: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    registerPathMethodToControllerServiceFactory('post', target, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const put = (path: string = '/') => (target: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    registerPathMethodToControllerServiceFactory('put', target, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const del = (path: string = '/') => (target: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    registerPathMethodToControllerServiceFactory('delete', target, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const rules = (...funcs: Function[]) => (target:any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    // registerRulesToControllerServiceFactory()
}