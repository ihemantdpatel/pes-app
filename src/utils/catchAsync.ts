import { Response, Request, NextFunction } from 'express'

const catchAsync = (fn: Function) => {
    const errorHandler = (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((error: any) => {

            next(error)
        })
    }
    return errorHandler
}

export default catchAsync