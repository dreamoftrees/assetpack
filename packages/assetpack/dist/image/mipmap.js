import sharp from 'sharp';
import { checkExt, createNewAssetAt } from '../core/index.js';
import { mipmapSharp } from './utils/mipmapSharp.js';
import { resolveOptions } from './utils/resolveOptions.js';
const defaultMipmapOptions = {
    template: '@%%x',
    resolutions: { default: 1, low: 0.5 },
    fixedResolution: 'default',
};
export function mipmap(_options = {}) {
    const mipmap = resolveOptions(_options, defaultMipmapOptions);
    return {
        folder: true,
        name: 'mipmap',
        defaultOptions: {
            ...mipmap,
        },
        tags: {
            fix: 'fix',
        },
        test(asset, options) {
            return options && checkExt(asset.path, '.png', '.jpg', '.jpeg');
        },
        async transform(asset, options) {
            const shouldMipmap = mipmap && !asset.metaData[this.tags.fix];
            let processedImages;
            const image = {
                format: asset.extension,
                resolution: 1,
                sharpImage: sharp(asset.buffer),
            };
            try {
                if (shouldMipmap) {
                    const { resolutions, fixedResolution } = options
                        || this.defaultOptions;
                    const fixedResolutions = {};
                    fixedResolutions[fixedResolution] = resolutions[fixedResolution];
                    const resolutionHash = asset.allMetaData[this.tags.fix]
                        ? fixedResolutions
                        : resolutions;
                    const largestResolution = Math.max(...Object.values(resolutionHash));
                    image.resolution = largestResolution;
                    processedImages = shouldMipmap ? await mipmapSharp(image, resolutionHash, largestResolution) : [image];
                }
                else {
                    processedImages = [image];
                }
            }
            catch (error) {
                throw new Error(`[AssetPack][mipmap] Failed to mipmap image: ${asset.path} - ${error}`);
            }
            // now create our new assets
            const newAssets = processedImages.map((data) => {
                let resolution = '';
                if (options) {
                    resolution = options.template.replace('%%', `${data.resolution}`);
                    resolution = data.resolution === 1 ? '' : resolution;
                }
                const end = `${resolution}${data.format}`;
                const filename = asset.filename
                    .replace(/\.[^/.]+$/, end);
                const newAsset = createNewAssetAt(asset, filename);
                return newAsset;
            });
            const promises = processedImages.map((image, i) => image.sharpImage.toBuffer().then((buffer) => {
                newAssets[i].buffer = buffer;
            }));
            await Promise.all(promises);
            return newAssets;
        },
    };
}
//# sourceMappingURL=mipmap.js.map