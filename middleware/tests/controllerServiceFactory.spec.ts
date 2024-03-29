import { expect } from 'chai'
import 'mocha'
import { controllerServiceFactory } from '../services/ControllerService'

describe('controllerServiceFactory', () => {

    describe('validate', () => {

        it('should fail validation when controllers\' paths are duplicated', () => {

            const store = {

                "HomeController": {

                    path: '/',
                    methodPaths: []
                },

                "TestController": {

                    path: '/',
                    methodPaths: []
                }
            }

            expect(() => controllerServiceFactory(store).validateAndClear()).to.throw()
        })

        it('should pass validation when controllers have no duplicate paths', () => {

            const store = {

                "HomeController": {

                    path: '/',
                    methodPaths: []
                },

                "TestController": {

                    path: '/test',
                    methodPaths: []
                }

            }

            expect(() => controllerServiceFactory(store).validateAndClear()).to.not.throw()
        })

        it('should fail validation when paths to endpoints of a controller are duplicated', () => {

            const store = {

                "HomeController": {

                    path: '/',
                    methodPaths: [
                        {
                            path: '/',
                            method: 'get',
                            functionName: 'home',
                            fn: () => { }
                        },
                        {
                            path: '/',
                            method: 'get',
                            functionName: 'home2',
                            fn: () => { }
                        }
                    ]
                },
            }

            expect(() => controllerServiceFactory(store).validateAndClear()).to.throw()
        })

        it('should pass validation when paths to endpoints of a controller are not duplicated', () => {

            const store = {

                "HomeController": {

                    path: '/',
                    methodPaths: [
                        {
                            path: '/',
                            method: 'get',
                            functionName: 'home',
                            fn: () => { }
                        },
                        {
                            path: '/say-hello/:name',
                            method: 'get',
                            functionName: 'home2',
                            fn: () => { }
                        }
                    ]
                },
            }

            expect(() => controllerServiceFactory(store).validateAndClear()).to.not.throw()
        })
    })

    describe('resolveControllerItem', () => {

        it('passes when adding a new controller with no duplicate path', () => {

            const actual = {

                "TestController": { path: "/xxx", methodPaths: [] }
            }

            controllerServiceFactory(actual).resolveControllerItem('HomeController', '/home')

            const expected = {

                TestController: { path: '/xxx', methodPaths: [] },
                HomeController: { path: '/home', methodPaths: [] }
            }

            expect(actual).to.eql(expected)
        })
    })

    it('resolvePathMethodToController', () => {

        const actual: any = {}

        controllerServiceFactory(actual).resolvePathMethodToController({

            className: "HomeController", method: "get", functionName: "home", func: () => { }
        })

        delete actual["HomeController"].methodPaths[0].fn

        delete actual["HomeController"].methodPaths[0].path

        const expected = {

            "HomeController": {

                "path": "/",
                "methodPaths": [{ "method": "get", functionName: "home" }]
            }
        }

        expect(actual).to.eql(expected)
    })

    it('getEndpoints', () => {

        const expected = [
            {
                path: "/test/xxx/:name",
                method: "get",
                // fn: () => { }
            },

            {
                path: "/test/open",
                method: "post",
                // fn: () => { }
            }
        ]

        const actual =

            controllerServiceFactory({

                "HelloWorldController": {

                    path: "/test",

                    methodPaths: [
                        {
                            path: "/xxx/:name",
                            method: "get",
                            functionName: 'home1',
                            fn: () => { }
                        },
                        {
                            path: "/open",
                            method: "post",
                            functionName: 'home2',
                            fn: () => { }
                        }
                    ]
                }

            }).getEndpoints("HelloWorldController")

        // delete actual[0].fn

        // delete actual[1].fn

        expect(actual).to.eql(expected)
    })
})