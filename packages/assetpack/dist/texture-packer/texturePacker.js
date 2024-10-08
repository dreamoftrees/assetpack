import fs from 'fs-extra';
import { glob } from 'glob';
import { createNewAssetAt, Logger, path, stripTags } from '../core/index.js';
import { packTextures } from './packer/packTextures.js';
function checkForTexturePackerShortcutClashes(frames, shortcutClash) {
    const clashes = [];
    for (const i in frames) {
        if (!shortcutClash[i]) {
            shortcutClash[i] = true;
        }
        else {
            clashes.push(i);
        }
    }
    if (clashes.length > 0) {
        // eslint-disable-next-line max-len
        Logger.warn(`[AssetPack][texturePacker] Texture Packer Shortcut clash detected for between ${clashes.join(', ')}. This means that 'nameStyle' is set to 'short' and different sprite sheets have frames that share the same name. Please either rename the files or set 'nameStyle' in the texture packer options to 'relative'`);
    }
}
export function texturePacker(_options = {}) {
    let shortcutClash = {};
    return {
        folder: true,
        name: 'texture-packer',
        defaultOptions: {
            resolutionOptions: {
                template: '@%%x',
                resolutions: { default: 1, low: 0.5 },
                fixedResolution: 'default',
                maximumTextureSize: 4096,
                ..._options.resolutionOptions,
            },
            texturePacker: {
                padding: 2,
                nameStyle: 'relative',
                ..._options.texturePacker,
            },
            addFrameNames: _options.addFrameNames ?? false,
        },
        tags: {
            tps: 'tps',
            fix: 'fix',
            jpg: 'jpg',
        },
        test(asset) {
            return asset.isFolder && asset.metaData[this.tags.tps];
        },
        async start() {
            // restart the clashes!
            shortcutClash = {};
        },
        async transform(asset, options) {
            const { resolutionOptions, texturePacker } = options;
            const fixedResolutions = {};
            // eslint-disable-next-line max-len
            fixedResolutions[resolutionOptions.fixedResolution] = resolutionOptions.resolutions[resolutionOptions.fixedResolution];
            // skip the children so that they do not get processed!
            asset.skipChildren();
            const largestResolution = Math.max(...Object.values(resolutionOptions.resolutions));
            const resolutionHash = asset.allMetaData[this.tags.fix] ? fixedResolutions : resolutionOptions.resolutions;
            const globPath = `${asset.path}/**/*.{jpg,png,gif}`;
            const files = await glob(globPath);
            if (files.length === 0) {
                return [];
            }
            const texturesToPack = await Promise.all(files.map(async (f) => {
                const contents = await fs.readFile(f);
                return { path: stripTags(path.relative(asset.path, f)), contents };
            }));
            const textureFormat = (asset.metaData[this.tags.jpg] ? 'jpg' : 'png');
            const texturePackerOptions = {
                ...texturePacker,
                ...{
                    width: resolutionOptions?.maximumTextureSize,
                    height: resolutionOptions?.maximumTextureSize,
                },
                textureFormat,
            };
            const promises = [];
            const assets = [];
            let checkedForClashes = false;
            const imageNames = new Set();
            Object.values(resolutionHash).sort((a, b) => b - a).forEach((resolution) => {
                const scale = resolution / largestResolution;
                promises.push((async () => {
                    const textureName = texturePackerOptions.textureName ?? stripTags(asset.filename);
                    const out = await packTextures({
                        ...texturePackerOptions,
                        textureName,
                        texturesToPack,
                        scale,
                        resolution,
                    });
                    if (options.addFrameNames) {
                        out.jsons.forEach(({ json }) => {
                            Object.keys(json.frames).forEach((frame) => imageNames.add(frame));
                        });
                    }
                    const outPromises = [];
                    for (let i = 0; i < out.textures.length; i++) {
                        const { buffer, name } = out.textures[i];
                        const textureAsset = createNewAssetAt(asset, name);
                        textureAsset.buffer = buffer;
                        textureAsset.metaData.mIgnore = true;
                        const { json, name: jsonName } = out.jsons[i];
                        const jsonAsset = createNewAssetAt(asset, jsonName);
                        if (!checkedForClashes) {
                            checkedForClashes = true;
                            // check for shortcut clashes..
                            checkForTexturePackerShortcutClashes(json.frames, shortcutClash);
                        }
                        jsonAsset.buffer = Buffer.from(JSON.stringify(json, null, 2));
                        textureAsset.metaData[this.tags.fix] = true;
                        jsonAsset.transformData.page = i;
                        assets.push(textureAsset, jsonAsset);
                    }
                    await Promise.all(outPromises);
                })());
            });
            await Promise.all(promises);
            if (options.addFrameNames) {
                asset.metaData.frameNames = Array.from(imageNames);
            }
            return assets;
        },
    };
}
//# sourceMappingURL=texturePacker.js.map