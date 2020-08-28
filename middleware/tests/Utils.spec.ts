import { cleanPath, toSafePath } from '../services/Utils'
import { expect } from 'chai'
import 'mocha'

describe("Utils", () => {
    
    it('toSafePath', () => {
        
        const result = toSafePath(['/', 'HellO-2\\', '//XxX'])
        
        expect(result).to.equal('/HellO-2/XxX')
    })

    describe('cleanPath', () => {
  
        it('should correct backslashes to forward slashes', () => {
            
            const result = cleanPath('\\test\\xxx')
            
            expect(result).to.equal('/test/xxx')
        })

        it('should correct double forward slahes to single forward slashes', () => {
            
            const result = cleanPath('//test//xxx')
            
            expect(result).to.equal('/test/xxx')
        })

        it('should leave a well-formed path as is', () => {

            const result = cleanPath('/TeSt/xXx?iD=111')

            expect(result).to.equal('/TeSt/xXx?iD=111')
        })

        it('should add a prefix forward slash if missing', () => {

            const result = cleanPath('test/xxx?id=111')

            expect(result).to.equal('/test/xxx?id=111')
        })

        it('should remove a suffix forwward slash if present', () => {

            const result = cleanPath('/test/xxx?id=111/')

            expect(result).to.equal('/test/xxx?id=111')
        })
    })
})