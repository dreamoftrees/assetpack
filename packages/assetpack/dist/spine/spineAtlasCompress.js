import { checkExt, createNewAssetAt, swapExt } from '../core/index.js';
import { AtlasView } from './AtlasView.js';
export function spineAtlasCompress(_options) {
    return {
        name: 'spine-atlas-compress',
        defaultOptions: {
            ...{
                png: true,
                webp: true,
                avif: false,
                astc: false,
                bc7: false,
                basis: false
            },
            ..._options,
        },
        tags: {
            nc: 'nc',
        },
        test(asset) {
            return !asset.allMetaData[this.tags.nc]
                && checkExt(asset.path, '.atlas');
        },
        async transform(asset, options) {
            const formats = [];
            if (options.avif)
                formats.push(['avif', '.avif']);
            if (options.png)
                formats.push(['png', '.png']);
            if (options.webp)
                formats.push(['webp', '.webp']);
            if (options.astc)
                formats.push(['astc', '.astc.ktx']);
            if (options.bc7)
                formats.push(['bc7', '.bc7.dds']);
            if (options.basis)
                formats.push(['basis', '.basis.ktx2']);
            const atlas = new AtlasView(asset.buffer);
            const textures = atlas.getTextures();
            const assets = formats.map(([format, extension]) => {
                const newAtlas = new AtlasView(asset.buffer);
                const newFileName = swapExt(asset.filename, `.${format}.atlas`);
                textures.forEach((texture) => {
                    newAtlas.replaceTexture(texture, swapExt(texture, extension));
                });
                const newAsset = createNewAssetAt(asset, newFileName);
                newAsset.buffer = newAtlas.buffer;
                return newAsset;
            });
            return assets;
        },
    };
}
//# sourceMappingURL=spineAtlasCompress.js.map