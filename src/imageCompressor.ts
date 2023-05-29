import sharp from 'sharp';
import { CompressionRequest } from './compressionRequest';
import { CompressionResult, defaultCompressionResult } from './compressionResult';

async function imageOptions(sharpInstance: sharp.Sharp | undefined, format: keyof sharp.FormatEnum, quality: number) : Promise<sharp.Sharp | undefined> {
	// Adjust compression settings based on the image format
	if (sharpInstance === undefined)
		return undefined;

	if (format === 'jpeg' || format === 'png')
		sharpInstance = sharpInstance.jpeg({ quality: quality });
	else if (format === 'webp')
		sharpInstance = sharpInstance.webp({ quality: quality });
	else if (format === 'tiff')
		sharpInstance = sharpInstance.tiff({ quality: quality });

	return sharpInstance;
}

/**
 * Compresses an image file using the specified quality.
 * The lower the quality the smaller result size.
 *
 * @param file The file data to be compressed.
 * @param quality The compression quality value.
 * @returns A Promise that resolves to the CompressionResult.
 */
export async function compressImage(file: CompressionRequest): Promise<CompressionResult | undefined> {
	let sharpInstance: sharp.Sharp | undefined = await sharp(Buffer.from(file.fileContent, 'base64'));

	const metadata = await sharpInstance.metadata();

	// Check if metadata or format information is missing
	if (!metadata || !metadata.format || !metadata.size)
		return undefined;

	const format = metadata.format;
	const result: CompressionResult = defaultCompressionResult();

	sharpInstance = await imageOptions(sharpInstance, format, file.quality);

	if (sharpInstance === undefined)
		return result;

	const buffer = await sharpInstance.toBuffer();

	result.fileData.fileName += "." + format;
	result.fileData.fileContent = buffer.toString('base64');
	result.fileData.quality = file.quality;
	result.sizeBefore = metadata.size;
	result.sizeAfter = buffer.length;
	result.ratio = Number(((metadata.size / buffer.byteLength) * 100).toFixed(2));

	return (result);
}
