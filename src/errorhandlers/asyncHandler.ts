import { NextFunction, Request, RequestHandler, Response } from "express"
import { AsyncRequestHandler } from "src/types/types"

const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
      return Promise
                  .resolve(fn(req, res, next))
                  .catch(next);
    }
}
  
export default asyncHandler