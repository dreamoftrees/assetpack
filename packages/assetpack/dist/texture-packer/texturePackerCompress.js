import { checkExt, createNewAssetAt, swapExt } from '../core/index.js';
export function texturePackerCompress(_options) {
    return {
        name: 'texture-packer-compress',
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
            tps: 'tps',
            nc: 'nc',
        },
        test(asset) {
            return (asset.allMetaData[this.tags.tps]
                && !asset.allMetaData[this.tags.nc]
                && checkExt(asset.path, '.json'));
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
            const json = JSON.parse(asset.buffer.toString());
            const assets = formats.map(([format, extension]) => {
                const newFileName = swapExt(asset.filename, `.${format}.json`);
                const newAsset = createNewAssetAt(asset, newFileName);
                const newJson = JSON.parse(JSON.stringify(json));
                newJson.meta.image = swapExt(newJson.meta.image, extension);
                if (newJson.meta.related_multi_packs) {
                    newJson.meta.related_multi_packs = newJson.meta.related_multi_packs.map((pack) => swapExt(pack, `.${format}.json`));
                }
                newAsset.buffer = Buffer.from(JSON.stringify(newJson, null, 2));
                if (!newJson.meta.related_multi_packs) {
                    newAsset.metaData.mIgnore = true;
                }
                return newAsset;
            });
            return assets;
        },
    };
}
//# sourceMappingURL=texturePackerCompress.js.map