import { CompressionRequest } from "./compressionRequest"

/**
 * Represents the result of image compression.
 */
interface CompressionResult {
	fileData: CompressionRequest,
	sizeBefore: number,
	sizeAfter: number,
	ratio: number
}

export function defaultCompressionResult(): CompressionResult {
	return {
		fileData: {
			fileName: "",
			fileContent: "",
			quality: 1,
		},
		sizeBefore: -1,
		sizeAfter: -1,
		ratio: -1,
	};
}

export { type CompressionResult };
