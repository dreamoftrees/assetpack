import fs from 'fs-extra';
import { path } from './utils/path.js';
export class AssetCache {
    static location = '.assetpack';
    _assetCacheData;
    _cacheName;
    constructor({ cacheName } = {}) {
        this._cacheName = cacheName ?? 'assets';
    }
    // save a file to disk
    read() {
        if (this._assetCacheData)
            return this._assetCacheData.assets;
        try {
            this._assetCacheData = fs.readJSONSync(`${AssetCache.location}/${this._cacheName}.json`);
            return this._assetCacheData.assets;
        }
        catch (e) {
            return null;
        }
    }
    write(asset) {
        const schema = {
            assets: {}
        };
        this._serializeAsset(asset, schema.assets, true);
        // get root dir in node
        fs.ensureDirSync(path.joinSafe(AssetCache.location));
        fs.writeJSONSync(`${AssetCache.location}/${this._cacheName}.json`, schema, { spaces: 4 });
    }
    _serializeAsset(asset, schema, saveHash = false) {
        const serializeAsset = {
            isFolder: asset.isFolder,
            parent: asset.parent?.path,
            transformParent: asset.transformParent?.path,
            metaData: asset.metaData,
            transformData: asset.transformData
        };
        if (!asset.isFolder && saveHash) {
            serializeAsset.hash = asset.hash;
        }
        schema[asset.path] = serializeAsset;
        asset.children.forEach((child) => {
            this._serializeAsset(child, schema, true);
        });
        asset.transformChildren.forEach((child) => {
            // we don't care about hashes for transformed children!
            this._serializeAsset(child, schema);
        });
    }
}
//# sourceMappingURL=AssetCache.js.map