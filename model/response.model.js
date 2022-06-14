export default class Response {
    constructor(statusCode, status, message, result) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.result = result;
    }
}