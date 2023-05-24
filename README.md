# Image Compression API

This is an Express.js server application built using TypeScript that allows users to upload image files and receive them back compressed in Base64 format.

## Prerequisites

- Node.js (v12 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```
git clone https://github.com/MouadxBth/image-compressor.git
```

2. Install dependencies:

```
cd image-compressor
npm install
```

3. Configure the server:

> You can configure various aspects of this server by modifying the values in the ```.env``` file.
Make sure to copy the ```.env.example``` file to ```.env``` and tailor it to fit your needs.

4. Start the server:

```
npm run start
```

5. The server is now running on http://localhost:{COMPRESSOR_PORT}.

## Usage

1. To compress an image, send a POST request to the endpoint `http://localhost:{COMPRESSOR_PORT}/{COMPRESSOR_ROUTE}` with the image's content encoded in Base64 in the body in the following format:

```
{
    "fileName": "example", // the image's output name, this will be prefixed with the image's type
    "quality": 50, // the quality reduced to
    "fileContent": "image content in here" // the image's content in Base64 encoding
}
```

2. The server will receive the sent body and attempt to compress the image using the given quality, if it succeeds it will send the compressed image's name with extension, content, size before, size after and the compression ration.

> An example:

```
{
    "fileData": {
        "fileName": "test.jpeg",
        "fileContent": "compressed image's content encoded in base64"
    },
    "sizeBefore": 2048000,
    "sizeAfter": 204800,
    "ratio": 1000.00
}
```
