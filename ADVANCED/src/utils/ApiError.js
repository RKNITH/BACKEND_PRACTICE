class ApiError extends Error {
    constructor(
        strtusCode,
        message = "Something went wrong",
        error = [],
        stack = ""
    ) {
        super(message)
        this.strtusCode = strtusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export { ApiError }