"use strict";
//require("dotenv").config();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageCompressor_1 = require("./imageCompressor");
const authentication_1 = require("./authentication");
const compressionRequest_1 = require("./compressionRequest");
const config_1 = require("./config");
/**
 * The port number for the compressor server.
 */
const COMPRESSOR_PORT = process.env.COMPRESSOR_PORT ? parseInt(process.env.COMPRESSOR_PORT) : 3000;
/**
 * The route for uploading and compressing images.
 */
const COMPRESSOR_ROUTE = process.env.COMPRESSOR_ROUTE || "/upload";
const app = (0, express_1.default)();
// Middleware for parsing JSON and limiting body size
app.use(express_1.default.json({
    verify: (request, response, buffer, encoding) => {
        try {
            JSON.parse(buffer.toString('utf-8'));
        }
        catch (error) {
            response.status(400).send("Invalid JSON body!\n \
			an example of a valid Request:\n{ \"fileName\": \"test.txt\", \"fileContent\": \"content in base64\",\"quality\": \"[1-100]\", }");
            throw Error("Invalid request body!");
        }
    },
    limit: "20mb"
}));
/**
 * Handles the upload request to compress an image.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
app.post(COMPRESSOR_ROUTE, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, authentication_1.authenticate)(request, response))
        return;
    const compressionRequest = (0, compressionRequest_1.extractCompressionRequest)(request, response);
    if (typeof compressionRequest === 'boolean')
        return;
    (0, imageCompressor_1.compressImage)(compressionRequest).then(result => {
        if (result === undefined)
            return response.status(500).send(config_1.ERROR_COMPRESSION);
        return response.send(result);
    }).catch((error) => {
        return response.status(500).send(error.message);
    });
}));
/**
 * Starts the compressor server.
 */
app.listen(COMPRESSOR_PORT, () => {
    console.log(`Server started on port ${COMPRESSOR_PORT}`);
});
module.exports = app;
