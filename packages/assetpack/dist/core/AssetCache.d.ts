import type { Asset } from './Asset.js';
export interface AssetCacheOptions {
    cacheName?: string;
}
export declare class AssetCache {
    static location: string;
    private _assetCacheData;
    private _cacheName;
    constructor({ cacheName }?: AssetCacheOptions);
    read(): Record<string, CachedAsset> | null;
    write(asset: Asset): void;
    private _serializeAsset;
}
export interface CachedAsset {
    isFolder: boolean;
    hash?: string;
    parent: string | undefined;
    metaData: Record<string, any>;
    transformData: Record<string, any>;
    transformParent: string | undefined;
}
