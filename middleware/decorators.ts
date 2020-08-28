import { controllerServiceFactory } from "./services/ControllerService";
import { ExpressParams } from "./params";

const ctrlSvcFactory = controllerServiceFactory()

function resolve(method: string, target: any, functionName: string, funcDescriptor: PropertyDescriptor, path: string) {

    const { name: className } = target.constructor;

    ctrlSvcFactory.resolvePathMethodToController({ className, method, functionName, func: funcDescriptor.value, path });
}

export function controller(path: string = '/') {

    return function (target: Function) {

        const { name: className } = target;

        ctrlSvcFactory.resolveControllerItem(className, path)
    };
}

export const get = (path: string = '/') => (target: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    resolve('get', target, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const post = (path: string = '/') => (target: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    resolve('post', target, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const put = (path: string = '/') => (target: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    resolve('put', target, functionName, funcDescriptor, path);

    return funcDescriptor;
}

export const del = (path: string = '/') => (target: any, functionName: string, funcDescriptor: PropertyDescriptor) => {

    resolve('delete', target, functionName, funcDescriptor, path);

    return funcDescriptor;
}