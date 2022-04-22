import {  ErrorRequestHandler } from "express"
import { StatusCodes } from "http-status-codes"

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
    console.log(err.stack)
    
    let customError = {
      // set default
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || 'Something went wrong try again later',
    }
  
    return res.status(customError.statusCode).json({ errorMsg: customError.msg })
}
  
export default errorHandler