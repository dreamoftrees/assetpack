import fs from 'fs-extra';
import generateBMFont from 'msdf-bmfont-xml';
import { checkExt, createNewAssetAt, path, stripTags } from '../core/index.js';
function signedFont(defaultOptions) {
    return {
        folder: false,
        name: defaultOptions.name,
        defaultOptions,
        tags: {
            font: 'font',
            nc: 'nc',
            fix: 'fix',
        },
        test(asset) {
            return asset.allMetaData[this.tags.font] && checkExt(asset.path, '.ttf');
        },
        async transform(asset, options) {
            const newFileName = stripTags(asset.filename.replace(/\.(ttf)$/i, ''));
            // set the family name to the filename if it doesn't exist
            asset.metaData.family ??= path.trimExt(asset.filename);
            const { font, textures } = await GenerateFont(asset.path, {
                ...options.font,
                filename: newFileName,
                fieldType: options.type,
                outputType: 'xml',
            });
            const assets = [];
            const promises = [];
            textures.forEach(({ filename, texture }) => {
                const newTextureName = `${filename}.png`;
                const newTextureAsset = createNewAssetAt(asset, newTextureName);
                // don't compress!
                newTextureAsset.metaData[this.tags.nc] = true;
                newTextureAsset.metaData[this.tags.fix] = true;
                newTextureAsset.metaData.mIgnore = true;
                assets.push(newTextureAsset);
                newTextureAsset.buffer = texture;
            });
            const newFontAsset = createNewAssetAt(asset, font.filename);
            assets.push(newFontAsset);
            newFontAsset.buffer = Buffer.from(font.data);
            await Promise.all(promises);
            return assets;
        }
    };
}
export function sdfFont(options = {}) {
    const signed = signedFont({
        name: 'sdf-font',
        type: 'sdf',
        ...options,
    });
    signed.tags.font = 'sdf';
    return signed;
}
export function msdfFont(options = {}) {
    const signed = signedFont({
        name: 'msdf-font',
        type: 'msdf',
        ...options,
    });
    signed.tags.font = 'msdf';
    return signed;
}
async function GenerateFont(input, params) {
    return new Promise(async (resolve, reject) => {
        const fontBuffer = await fs.readFile(input);
        generateBMFont(fontBuffer, params, (err, textures, font) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({ textures, font });
            }
        });
    });
}
//# sourceMappingURL=sdf.js.map