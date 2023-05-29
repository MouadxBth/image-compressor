"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCompressionResult = void 0;
function defaultCompressionResult() {
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
exports.defaultCompressionResult = defaultCompressionResult;
