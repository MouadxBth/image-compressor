"use strict";
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
exports.compressImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
/**
 * Compresses an image file using the specified quality.
 * The lower the quality the smaller result size.
 *
 * @param file The file data to be compressed.
 * @param quality The compression quality value.
 * @returns A Promise that resolves to the CompressionResult.
 */
function compressImage(file, quality) {
    return __awaiter(this, void 0, void 0, function* () {
        let sharpInstance = (0, sharp_1.default)(Buffer.from(file.fileContent, 'base64'));
        const metadata = yield sharpInstance.metadata();
        const result = {
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
        const buffer = yield sharpInstance.toBuffer();
        result.fileData.fileName += "." + format;
        result.fileData.fileContent = buffer.toString('base64');
        result.sizeBefore = metadata.size;
        result.sizeAfter = buffer.length;
        result.ratio = Number(((metadata.size / buffer.byteLength) * 100).toFixed(2));
        return (result);
    });
}
exports.compressImage = compressImage;
