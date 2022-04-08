import fs from 'fs'
import path from 'path'
import { controllerServiceFactory } from './ControllerService';
import express from 'express'
import EventService from './EventService';
import LogService from './LogService'

const { NODE_ENV} = process.env

export module ApplicationService {
    
    export function start(port: string | number, sourceDir: string) {
        
        let _server: any;

        function recurseAndRegisterControllers(dir: string): void {

            for (var item of fs.readdirSync(dir).filter(i => path.extname(i).toLowerCase() !== '.map')) {

                const p = path.join(dir, item);

                if (fs.lstatSync(p).isDirectory()) {

                    return recurseAndRegisterControllers(p);
                }

                if (!path.extname(p)) { return; }

                const fileName = p.replace(/\\/g, '/');

                const controller = require(path.resolve(fileName));

                registerControllerToExpressEndpoints(controller);
            }

            controllerServiceFactory().validateAndClear()
        }

        function registerControllerToExpressEndpoints(controllerDir: any) {

            for (let item of Object.values(controllerDir)) {

                const ctlName = (<any>item).name;

                for (let { path, fn, method } of controllerServiceFactory().getEndpoints(ctlName)) {

                    _server[method](path, fn);
                }
            }
        }
        
        _server = express()
        
        _server.use(express.json())

        if (NODE_ENV === 'development') {

            _server.use(LogService);
        }
        
        recurseAndRegisterControllers(sourceDir)

        _server.listen(port, () => {

            EventService.publish('server-init')

            console.log(`server running at port ${port}`)

        })

        return _server
    }
}