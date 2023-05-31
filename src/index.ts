require("dotenv").config();

import express, { Request, Response } from "express";
import { compressImage } from "./imageCompressor";
import { authenticate } from "./authentication";
import { extractCompressionRequest } from "./compressionRequest";
import { ERROR_COMPRESSION } from "./config";

/**
 * The port number for the compressor server.
 */
const COMPRESSOR_PORT: number = process.env.COMPRESSOR_PORT ? parseInt(process.env.COMPRESSOR_PORT) : 3000;

/**
 * The route for uploading and compressing images.
 */
const COMPRESSOR_ROUTE: string = process.env.COMPRESSOR_ROUTE || "/upload";


const app = express();

// Middleware for parsing JSON and limiting body size
app.use(express.json({
	verify: (request: Request, response: Response, buffer: Buffer, encoding: string) => {
		try {
			JSON.parse(buffer.toString('utf-8'));
		}
		catch (error: any) {
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
app.post(COMPRESSOR_ROUTE, async (request: Request, response: Response) => {

	/* if (!authenticate(request, response))
		return; */

	const compressionRequest = extractCompressionRequest(request, response);

	if (typeof compressionRequest === 'boolean')
		return ;

	compressImage(compressionRequest).then(result => {
		if (result === undefined)
			return response.status(500).send(ERROR_COMPRESSION);

		return response.send(result);
	}).catch((error: any) => {
		return response.status(500).send((error as Error).message);
	});

});

/**
 * Starts the compressor server.
 */
app.listen(COMPRESSOR_PORT, () => {
	console.log(`Server started on port ${COMPRESSOR_PORT}`);
});

module.exports = app;
