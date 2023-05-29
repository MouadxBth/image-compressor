import { Request, Response } from "express"
import { INVALID_BODY } from "./config";

/**
 * Represents the file data containing the file name and content.
 */
interface CompressionRequest {
	fileName: string,
	fileContent: string,
	quality: number
}

export function defaultCompressionRequest(): CompressionRequest {
	return {
		fileName: "",
		fileContent: "",
		quality: 1,
	};
}

export function extractCompressionRequest(request: Request, response: Response): CompressionRequest | boolean {
	const fileName: string | null = request.body['fileName'];
	const fileContent: string | null = request.body['fileContent'];
	const quality: number | null = request.body['quality'];

	if (fileName == null
		|| fileContent == null
		|| quality == null
		|| fileName.length == 0
		|| fileContent.length == 0
		|| !Number.isInteger(quality)) {
		return (response.status(400).send(INVALID_BODY), false);
	}

	const result = defaultCompressionRequest();
	result.fileName = fileName;
	result.fileContent = fileContent;
	result.quality = quality;

	return (result);
}

export { type CompressionRequest };
