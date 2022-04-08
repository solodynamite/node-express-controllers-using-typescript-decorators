import 'dotenv/config'
import { ApplicationService } from './services/ApplicationService'
import EventService from './services/EventService'

const { NODE_ENV, TOKEN_KEY } = process.env
const port = process.env.PORT || 3000

const server = ApplicationService.start(port, './dist/controllers');

server

    .use((request: any, response: any, next: any) => {

        const headers: any = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE",
            "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Content-Length, " + TOKEN_KEY,
            "Access-Control-Expose-Headers": TOKEN_KEY,
            "Content-Type": "application/json; charset=utf-8"
        };

        Object.keys(headers).forEach(key => {

            const x = headers[key]

            response.setHeader(key, x)
        });

        if (request.method === 'OPTIONS') {

            response.status = 204;
            response.setHeader('Content-Length', 0);
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

EventService.subscribe('server-init', () => {

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
})