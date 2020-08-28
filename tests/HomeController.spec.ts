import { HomeController } from '../controllers/HomeController'
import { expect } from 'chai'

describe('HomeController', () => {

    describe('sayHello()', () => {

        it('should pass when it returns a message', () => {

            const controller = new HomeController()

            const result = controller.sayHello({ firstName: 'mark', id: 123 })

            expect(result).to.equal('Hello mark with id 123')
        })
    })

    describe('postHello()', () => {

        it('should pass when name is provided', () => {

            const controller = new HomeController()

            const result = controller.postHello({ name: 'mark' })

            expect(result).to.eql({ name: 'mark' })
        })
    })
})
