const INVALID_BODY: string = "Error! fileName, fileContent and quality are either missing or empty, or invalid quality number!";

const MISSING_AUTH_TOKEN: string = "Error! AuthorizationToken header is either missing or empty!";

const UNAUTHORIZED: string = "Error! You are not authorized to use this application!";

const EXPIRED_AUTH_TOKEN: string = "Error! Token has expired!";

const INVALID_AUTH_TOKEN: string = "Error! AuthorizationToken header is invalid, provide a valid JWT value!";

const INVALID_COMPRESSION: string = "Error! Invalid compression request!";

const ERROR_COMPRESSION: string = "Error! Unable to compress image!";

export { INVALID_BODY, MISSING_AUTH_TOKEN, UNAUTHORIZED, EXPIRED_AUTH_TOKEN, INVALID_AUTH_TOKEN, INVALID_COMPRESSION, ERROR_COMPRESSION };
