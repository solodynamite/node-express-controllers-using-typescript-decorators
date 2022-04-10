import _ from 'lodash'
import { Request, Response, NextFunction } from 'express'

export default (request: Request, response: Response, next: NextFunction) => {

    // permitted to pass through without inspection
    // --------------------------------------------------------------------------------------------

    if (_.some(['/credential', '/assets'], i => { return request.path.startsWith(i); })) {

        return next()
    }

    const { path, method } = request

    // const exempted = 

    next()
}