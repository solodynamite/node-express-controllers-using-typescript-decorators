# Controllers using Typescript decorators in Node and Express

With this sandbox starter, instead of writing endpoints like this:

```javascript
import express from 'express'

function sayHelloWorld() {

    return new Promise((resolve, reject) => { resolve('Hello world!') })
}
	
express()
     .get('/', async (request, response) => { // http://localhost:3000

          const result = await sayHelloWorld()
     
          response.send(result)
     })
     .get('/say-hello/:name', (request, response) => { // http://localhost:3000/say-hello/johnmarsha/id=123
     
          const { name } = request.params
     
          const { id } = request.query
	
          response.send(`Hello ${name} with id ${id}`)
     })
     .post('/', (request, response) => { // POST http://localhost:3000
     
          response.send(body)
     })
     .get('/test', (request, response) => { // http://localhost:3000/test
     
          response.send({ message: 'test' })
     })
     .get('/test/say-hello/:firstName', (request, response, next) => {

          const { firstName } = request.params

          response.send(`Hello ${firstName}`)
     })
     .listen(process.env.PORT || 3000)
```

You can now write controllers like this:

```ts
import { controller, get, post } from "../../middleware/decorators";

@controller()
export class HomeController {
     
     @get() // http://localhost:3000
     async home() { 

          return await sayHelloWorld()
     }
     
     @get('/say-hello/:name') // http://localhost:3000/say-hello/johnmarsha?id=123
     sayHello({ name, id }: any) {
     
          return `Hello ${name} with id ${id}`
     }

     @post() // POST http://localhost:3000
     postHello(body: any) {
     
         return body
     }
     
     /* @put() and @del() are also available */
}

@controller("/test")
export class TestController {

     @get() // http://localhost:3000/test
     test() {
     
          return { message: 'test' }
     }

     @get('/say-hello/:firstName') // http://localhost:3000/test/say-hello/martha
     sayHello({ firstName }: any) {

          return { message: `Hello ${firstName}`}
     }
}
```

# Write your own Controller classes

...with this source code at `/controllers` in Typescript (using the same decorators like HomeController in the source code) to make it work.


# Getting Started

Pre-requisite installs (presuming you already installed these on your machine):

* Node https://nodejs.org
* Visual Studio Code https://code.visualstudio.com
* Git https://git-scm.com/

Execute these terminal commands:

```
git clone https://github.com/solodynamite/node-express-controllers-using-typescript-decorators ./*your-new-project-name
cd *your-new-project-name
npm i
code .
```

**To auto-transpile your code every time you save your work**

The recommended way is to open Terminal outside Visual Studio Code (preferably Powershell in Windows) and execute:

```
npm i -g typescript // Just run this one once if you haven't yet.  This is a one-time global install of typescript in your machine
tsc -w
```

Keep this terminal open and running while you're coding.

The other option is within Visual Studio Code, press ⇧⌘B in MacOS or Ctrl+Shift+B in Windows then select `tsc: watch - tsconfig.json`.

Your auto-transpiling progress will appear in Visual Studio Code's Terminal window instead.

**That's it.  Your new project is ready for coding.**

To verify the clone is working, execute `npm test` on the Terminal.  You should see a test report thereafter.

If command `code .` from Terminal doesn't launch Visual Studio Code on your Mac, follow instructions from https://code.visualstudio.com/docs/setup/mac to configure it.


**To launch Express under Debug mode**

In Visual Studio Code, press `F5` - debugging comes complete with breakpointing, Watch, Call stack etc.

Open Debug Console (the tab alongside Terminal) and wait until it prints 'Server running at port 3000'.

Then go to http://localhost:3000 in your browser.  It should display a simple message, 'Hello world!';

http://localhost:3000/test would display a simple JSON object, { "message": "test" };

http://localhost:3000/say-hello/johnmarsha?id=123 would display a message, 'Hello johnmarsha with id 123'


# Note

The entry point of your build is at `/server.ts` that gets transpiled to and executed from `/dist/server.js`.

Your coding work should always be written in the .ts files outside the `/dist` folder.

The transpiled (.js) files end up at the `/dist` folder.  The ts compiler (tsc) will overwrite the corresponding js files in there.  So best not to write any code on them.
