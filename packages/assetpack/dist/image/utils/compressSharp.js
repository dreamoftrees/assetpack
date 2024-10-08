export async function compressSharp(image, options) {
    const compressed = [];
    const sharpImage = image.sharpImage;
    if (image.format === '.png' && options.png) {
        compressed.push({
            format: '.png',
            resolution: image.resolution,
            sharpImage: sharpImage.clone().png({ ...options.png, force: true }),
        });
    }
    if (options.webp) {
        compressed.push({
            format: '.webp',
            resolution: image.resolution,
            sharpImage: sharpImage.clone().webp(options.webp)
        });
    }
    if (((image.format === '.jpg') || (image.format === '.jpeg')) && options.jpg) {
        compressed.push({
            format: '.jpg',
            resolution: image.resolution,
            sharpImage: sharpImage.clone().jpeg(options.jpg)
        });
    }
    if (options.avif) {
        compressed.push({
            format: '.avif',
            resolution: image.resolution,
            sharpImage: sharpImage.clone().avif(options.avif)
        });
    }
    const results = await Promise.all(compressed.map(async (result) => ({
        ...result,
        buffer: await result.sharpImage.toBuffer()
    })));
    return results;
}
//# sourceMappingURL=compressSharp.js.map