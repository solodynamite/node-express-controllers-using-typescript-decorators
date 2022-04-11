import morgan, { token } from 'morgan'

export default morgan((tokens: any, request: any, response: any) => {

    const status = parseInt(tokens.status(request, response))

    const i = [

        tokens.method(request, response),

        request.get('host') + tokens.url(request, response),

        status,

        tokens.res(request, response, 'content-length'), '-',

        tokens['response-time'](request, response), 'ms'

    ].join(' ');

    const fn = status >= 200 && status <= 299 ? 'log' : 'error'

    console[fn](i);

    return i;
})