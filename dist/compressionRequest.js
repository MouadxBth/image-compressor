"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCompressionRequest = exports.defaultCompressionRequest = void 0;
const config_1 = require("./config");
function defaultCompressionRequest() {
    return {
        fileName: "",
        fileContent: "",
        quality: 1,
    };
}
exports.defaultCompressionRequest = defaultCompressionRequest;
function extractCompressionRequest(request, response) {
    const fileName = request.body['fileName'];
    const fileContent = request.body['fileContent'];
    const quality = request.body['quality'];
    if (fileName == null
        || fileContent == null
        || quality == null
        || fileName.length == 0
        || fileContent.length == 0
        || !Number.isInteger(quality)) {
        return (response.status(400).send(config_1.INVALID_BODY), false);
    }
    const result = defaultCompressionRequest();
    result.fileName = fileName;
    result.fileContent = fileContent;
    result.quality = quality;
    return (result);
}
exports.extractCompressionRequest = extractCompressionRequest;
