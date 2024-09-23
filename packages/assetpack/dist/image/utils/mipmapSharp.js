export async function mipmapSharp(image, resolutionHash, largestResolution) {
    const sharpImage = image.sharpImage;
    const metadata = await sharpImage.metadata();
    const { width, height } = metadata;
    const output = [];
    if (width && height) {
        for (const i in resolutionHash) {
            const scale = resolutionHash[i] / largestResolution;
            if (scale === 1) {
                image.resolution = resolutionHash[i];
                output.push(image);
                continue;
            }
            output.push({
                format: image.format,
                resolution: resolutionHash[i],
                sharpImage: sharpImage.clone().resize({
                    width: Math.round(width * scale),
                    height: Math.round(height * scale)
                })
            });
        }
    }
    return output;
}
//# sourceMappingURL=mipmapSharp.js.map