import morgan from 'morgan'

export default morgan((tokens: any, request: any, response: any) => {

    const i = [

        tokens.method(request, response),

        request.get('host') + tokens.url(request, response),

        tokens.status(request, response),

        tokens.res(request, response, 'content-length'), '-',

        tokens['response-time'](request, response), 'ms'

    ].join(' ');

    console.log(i);

    return i;
})