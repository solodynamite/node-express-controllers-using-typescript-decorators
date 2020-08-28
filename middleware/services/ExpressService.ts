import fs from 'fs'
import path from 'path'
import { controllerServiceFactory } from './ControllerService';
import express from 'express'

export module ExpressService {
    
    export function start(port: string | number, sourceDir: string) {
        
        let _express: any;

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

                    _express[method](path, fn);
                }
            }
        }

        
        _express = express()
        
        _express.use(express.json())
        
        recurseAndRegisterControllers(sourceDir)

        _express.listen(port, () => {

            console.log(`server running at port ${port}`)

        })

        return _express
    }
}