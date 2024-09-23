import type { Asset } from './Asset.js';
import type { AssetPackConfig } from './config.js';
export declare class AssetPack {
    private _defaultConfig;
    readonly config: AssetPackConfig;
    private _pipeSystem;
    private _assetWatcher;
    private _entryPath;
    private _outputPath;
    constructor(config?: AssetPackConfig);
    /**
     * Run the asset pack, this will transform all the assets and resolve when it's done
     */
    run(): Promise<void>;
    /**
     * Watch the asset pack, this will watch the file system for changes and transform the assets.
     * you can enable this when in development mode
     */
    watch(): Promise<void>;
    stop(): Promise<void>;
    private _transform;
    private deleteAndCollectAssetsToTransform;
}
export declare function deleteAssetFiles(asset: Asset): Promise<void>;
