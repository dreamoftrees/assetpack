import { Asset } from './Asset.js';
import type { CachedAsset } from './AssetCache.js';
import type { AssetSettings } from './pipes/PipeSystem.js';
export interface AssetWatcherOptions {
    entryPath: string;
    assetCacheData?: Record<string, CachedAsset> | null;
    assetSettingsData?: AssetSettings[];
    ignore?: string | string[];
    onUpdate: (root: Asset) => Promise<void>;
    onComplete: (root: Asset) => Promise<void>;
}
export declare class AssetWatcher {
    private _watcher;
    private _assetHash;
    private _changes;
    private _entryPath;
    private _root;
    private _timeoutId;
    private _onUpdate;
    private _updatingPromise;
    private _onComplete;
    private _ignore;
    private _assetSettingsData;
    private _assetCacheData;
    private _initialised;
    constructor(options: AssetWatcherOptions);
    private _init;
    run(): Promise<void>;
    watch(): Promise<void>;
    stop(): Promise<void>;
    private _runUpdate;
    private _updateAssets;
    private _applyChangeToAssets;
    private _cleanAssets;
    private _cleanAssetsRec;
    private _collectAssets;
    private _ensureDirectory;
}
