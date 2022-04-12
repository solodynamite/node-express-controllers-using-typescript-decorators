import { controllerFactory } from './server.controller';
import { Request, Response, NextFunction } from 'express'
import LogService from './services/LogService'
import express from 'express'
import 'dotenv/config'
import path from 'path'
import fs from 'fs'

const { NODE_ENV, TOKEN_KEY } = process.env
const port = process.env.PORT || 3000
const sourceDir = './dist/controllers'

const server: any = express()

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

    controllerFactory().validateAndClear()
}

function registerControllerToExpressEndpoints(controllerDir: any) {

    for (let controller of Object.values(controllerDir)) {

        const ctlName = (<any>controller).name;

        for (let { path, controllerFunction, httpVerb } of controllerFactory().getEndpoints(ctlName)) {

            // this is where endpoint calls are invoked at run-time
            server[httpVerb](path, controllerFunction);
        }
    }
}

server.use(express.json())

if (NODE_ENV === 'development') {

    server.use(LogService);
}

recurseAndRegisterControllers(sourceDir)

server

    .use((request: Request, response: Response, next: NextFunction) => {

        const headers: { [header: string]: string | undefined } = {

            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE",
            "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Content-Length, " + TOKEN_KEY,
            "Access-Control-Expose-Headers": TOKEN_KEY,
            "Content-Type": "application/json; charset=utf-8"
        };

        Object.keys(headers).forEach(key => {

            const x = <any>headers[key]

            response.setHeader(key, x)
        });

        if (request.method === 'OPTIONS') {

            response.status(204).setHeader('Content-Length', 0);

            return response.end();
        }
        next();
    })

    .use((err: any, request: any, response: any, next: any) => {

        if (!err) { next(); }

        const { status, data, message, statusText, errno } = err.response || err;

        if (status === 401) {

            response.clearCookie(TOKEN_KEY);
        }

        else if (errno === "ECONNREFUSED") {

            return response.status(503).render('pages/error', {

                data: {

                    items: [
                        'The service is unavailable at the moment.',
                        'Bear with us while we get it back online as soon as we can.'
                    ]
                }
            });
        }

        const packet = data || { message: message || statusText };

        response.status(status || 500).send(packet);
    })

    .listen(port, () => {

        if (process.env.NODE_ENV !== 'production') {

            const items = (() => {

                const result: any = {};

                [
                    'NODE_ENV',
                    'BASE_URL',
                    'TOKEN_KEY',
                    'DB_HOST',
                    'DISABLE_EMAIL',
                    'TASK_SCHEDULER_ENABLED'
                ]
                    .forEach(i => {

                        result[i] = process.env[i]
                    })

                return result

            })()

            console.table(items)
        }

        console.log(`server running at port ${port}`)
    })