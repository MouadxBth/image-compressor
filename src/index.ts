require("dotenv").config();

import express, { Request, Response } from "express";
import { compressImage } from "./imageCompressor";

/**
 * The port number for the compressor server.
 */
const COMPRESSOR_PORT: number = process.env.COMPRESSOR_PORT ? parseInt(process.env.COMPRESSOR_PORT) : 3000;

/**
 * The route for uploading and compressing images.
 */
const COMPRESSOR_ROUTE: string = process.env.COMPRESSOR_ROUTE || "/upload";


/**
 * Formats the size in bytes to a human-readable format.
 * @param sizeInBytes The size in bytes.
 * @returns The formatted size string.
 */
function formatSize(sizeInBytes: number): string {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let size = sizeInBytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	const roundedSize = Number(size.toFixed(2));
	return `${roundedSize} ${units[unitIndex]}`;
}

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

	try {
		const fileName: string | null = request.body['fileName'];
		const fileContentString: string | null = request.body['fileContent'];
		const quality: number | null = request.body['quality'];

		if (fileName == null
			|| fileContentString == null
			|| quality == null
			|| fileName.length == 0
			|| fileContentString.length == 0
			|| !Number.isInteger(quality)) {
			return response.status(400).send("Error! fileName, fileContent and quality are either missing or empty, or invalid quality number!");
		}

		compressImage({
			fileName: request.body['fileName'],
			fileContent: request.body['fileContent']
		}, quality)
			.then((result) => {
				console.log(`\nimage: ${result.fileData.fileName}\nBefore: ${formatSize(result.sizeBefore)}\nAfter: ${formatSize(result.sizeAfter)}\nRatio: ${result.ratio}%\n`);

				return response.send(result);
			})
			.catch((error: any) => {
				return response.status(500).send((error as Error).message);
			});

	} catch (decompressionError) {
		return response.status(500).send(decompressionError);
	}

});

/**
 * Starts the compressor server.
 */
app.listen(COMPRESSOR_PORT, () => {
	console.log(`Server started on port ${COMPRESSOR_PORT}`);
});

module.exports = app;
