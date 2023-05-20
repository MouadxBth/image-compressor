import sharp from 'sharp';


/**
 * Represents the file data containing the file name and content.
 */
interface FileData {
	fileName: string,
	fileContent: string;
}

/**
 * Represents the result of image compression.
 */
interface CompressionResult {
	fileData: FileData,
	sizeBefore: number,
	sizeAfter: number,
	ratio: number
}

/**
 * Compresses an image file using the specified quality.
 * The lower the quality the smaller result size.
 *
 * @param file The file data to be compressed.
 * @param quality The compression quality value.
 * @returns A Promise that resolves to the CompressionResult.
 */
export async function compressImage(file: FileData, quality: number): Promise<CompressionResult> {
	let sharpInstance = sharp(Buffer.from(file.fileContent, 'base64'));

	const metadata = await sharpInstance.metadata();

	const result: CompressionResult = {
		fileData: {
			fileName: file.fileName,
			fileContent: ""
		},
		sizeBefore: -1,
		sizeAfter: -1,
		ratio: -1
	};

	// Check if metadata or format information is missing
	if (!metadata || !metadata.format || !metadata.size)
		return result;

	const format = metadata.format;

	// Adjust compression settings based on the image format
	if (format === 'jpeg' || format === 'png')
		sharpInstance = sharpInstance.jpeg({ quality: quality });
	else if (format === 'webp')
		sharpInstance = sharpInstance.webp({ quality: quality });
	else if (format === 'tiff')
		sharpInstance = sharpInstance.tiff({ quality: quality });

	const buffer = await sharpInstance.toBuffer();

	result.fileData.fileName += "." + format;
	result.fileData.fileContent = buffer.toString('base64');
	result.sizeBefore = metadata.size;
	result.sizeAfter = buffer.length;
	result.ratio = Number(((metadata.size / buffer.byteLength) * 100).toFixed(2));

	return (result);
}
