class CustomError extends Error {
    statusCode = 400;
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    
}

export default CustomError