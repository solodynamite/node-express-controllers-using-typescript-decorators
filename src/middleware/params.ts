import { Request, Response, NextFunction} from 'express'

export class ExpressParams {

    public request!: Request;
    public response!: Response;
    public next: any;
}
