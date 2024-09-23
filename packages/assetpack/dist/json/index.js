import { checkExt, createNewAssetAt, Logger } from '../core/index.js';
export function json() {
    return {
        name: 'json',
        folder: false,
        defaultOptions: null,
        tags: {
            nc: 'nc',
        },
        test(asset) {
            return !asset.metaData[this.tags.nc] && checkExt(asset.path, '.json');
        },
        async transform(asset) {
            try {
                const json = JSON.parse(asset.buffer.toString());
                const compressedJsonAsset = createNewAssetAt(asset, asset.filename);
                compressedJsonAsset.buffer = Buffer.from(JSON.stringify(json));
                return [compressedJsonAsset];
            }
            catch (e) {
                Logger.warn(`[AssetPack][json] Failed to compress json file: ${asset.path}`);
                return [asset];
            }
        }
    };
}
//# sourceMappingURL=index.js.map