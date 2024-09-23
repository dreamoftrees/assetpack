import chokidar from 'chokidar';
import fs from 'fs-extra';
import { Asset } from './Asset.js';
import { AssetIgnore } from './AssetIgnore.js';
import { deleteAssetFiles } from './AssetPack.js';
import { Logger } from './logger/Logger.js';
import { applySettingToAsset } from './utils/applySettingToAsset.js';
import { path } from './utils/path.js';
import { syncAssetsWithCache } from './utils/syncAssetsWithCache.js';
export class AssetWatcher {
    _watcher;
    _assetHash = {};
    _changes = [];
    _entryPath = '';
    _root = new Asset({ path: 'noop', isFolder: true });
    _timeoutId;
    _onUpdate;
    _updatingPromise = Promise.resolve();
    _onComplete;
    _ignore;
    _assetSettingsData;
    _assetCacheData;
    _initialised = false;
    constructor(options) {
        const entryPath = options.entryPath;
        this._onUpdate = options.onUpdate;
        this._onComplete = options.onComplete;
        this._entryPath = entryPath;
        this._ignore = new AssetIgnore({
            ignore: options.ignore ?? [],
            entryPath
        });
        this._assetCacheData = options.assetCacheData;
        this._assetSettingsData = options.assetSettingsData ?? [];
    }
    _init() {
        if (this._initialised)
            return;
        this._initialised = true;
        Logger.report({
            type: 'buildStart',
            message: this._entryPath,
        });
        const asset = new Asset({
            path: this._entryPath,
            isFolder: true,
        });
        this._assetHash[asset.path] = asset;
        this._root = asset;
        this._collectAssets(asset);
        if (this._assetCacheData) {
            // now compare the cached asset with the current asset
            syncAssetsWithCache(this._assetHash, this._assetCacheData);
        }
    }
    async run() {
        this._init();
        return this._runUpdate();
    }
    async watch() {
        let firstRun = !this._initialised;
        this._init();
        return new Promise((resolve) => {
            this._watcher = chokidar.watch(this._entryPath, {
                // should we ignore the file based on the ignore rules provided (if any)
                // ignored: this.config.ignore,
                ignored: [(s) => s.includes('DS_Store')],
            });
            this._watcher.on('all', (type, file) => {
                if (!file || this._ignore.shouldIgnore(file))
                    return;
                this._changes.push({
                    type,
                    file,
                });
                if (this._timeoutId) {
                    clearTimeout(this._timeoutId);
                }
                this._timeoutId = setTimeout(() => {
                    this._updateAssets();
                    this._timeoutId = undefined;
                    if (firstRun) {
                        firstRun = false;
                        this._updatingPromise.then(() => {
                            resolve();
                        });
                    }
                }, 500);
            });
        });
    }
    async stop() {
        if (this._watcher) {
            this._watcher.close();
        }
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._updateAssets();
            this._timeoutId = undefined;
        }
        await this._updatingPromise;
    }
    async _runUpdate() {
        return this._onUpdate(this._root).then(() => {
            this._cleanAssets(this._root);
            this._onComplete(this._root);
        });
    }
    async _updateAssets(force = false) {
        // wait for current thing to finish..
        await this._updatingPromise;
        if (force || this._changes.length === 0)
            return;
        this._applyChangeToAssets(this._changes);
        this._changes = [];
        //  logAssetGraph(this._root);
        this._updatingPromise = this._runUpdate();
    }
    _applyChangeToAssets(changes) {
        changes.forEach(({ type, file }) => {
            let asset = this._assetHash[file];
            if (type === 'unlink' || type === 'unlinkDir') {
                asset.state = 'deleted';
            }
            else if (type === 'addDir' || type === 'add') {
                if (this._assetHash[file]) {
                    return;
                }
                // ensure folders...
                this._ensureDirectory(file);
                asset = new Asset({
                    path: file,
                    isFolder: type === 'addDir'
                });
                asset.state = 'added';
                // if asset is added...
                applySettingToAsset(asset, this._assetSettingsData, this._entryPath);
                this._assetHash[file] = asset;
                const parentAsset = this._assetHash[path.dirname(file)];
                parentAsset.addChild(asset);
            }
            else if (asset.state === 'normal') {
                asset.state = 'modified';
                deleteAssetFiles(asset);
            }
            // flag all folders as modified..
            asset.markParentAsModified(asset);
        });
    }
    _cleanAssets(asset) {
        const toDelete = [];
        this._cleanAssetsRec(asset, toDelete);
        toDelete.forEach((asset) => {
            asset.parent?.removeChild(asset);
        });
    }
    _cleanAssetsRec(asset, toDelete) {
        if (asset.state === 'normal')
            return;
        // TODO is slice a good thing here?
        asset.children.forEach((child) => {
            this._cleanAssetsRec(child, toDelete);
        });
        if (asset.state === 'deleted') {
            toDelete.push(asset);
            delete this._assetHash[asset.path];
        }
        else {
            asset.state = 'normal';
        }
    }
    _collectAssets(asset) {
        // loop through and turn each file and folder into an asset
        const files = fs.readdirSync(asset.path);
        files.forEach((file) => {
            const fullPath = path.joinSafe(asset.path, file);
            if (fullPath.includes('DS_Store'))
                return;
            const stat = fs.statSync(fullPath);
            const childAsset = new Asset({
                path: fullPath,
                isFolder: stat.isDirectory()
            });
            if (!childAsset.metaData.ignore && this._ignore.shouldInclude(childAsset.path)) {
                this._assetHash[childAsset.path] = childAsset;
                // if asset is added...
                applySettingToAsset(childAsset, this._assetSettingsData, this._entryPath);
                asset.addChild(childAsset);
                if (childAsset.isFolder) {
                    this._collectAssets(childAsset);
                }
            }
        });
    }
    _ensureDirectory(dirPath) {
        const parentPath = path.dirname(dirPath);
        if (parentPath === this._entryPath || parentPath === '.' || parentPath === '/') {
            return;
        }
        this._ensureDirectory(parentPath);
        if (this._assetHash[parentPath]) {
            return;
        }
        const asset = new Asset({
            path: parentPath,
            isFolder: true
        });
        asset.state = 'added';
        const parentAsset = this._assetHash[path.dirname(parentPath)];
        parentAsset.addChild(asset);
        this._assetHash[parentPath] = asset;
    }
}
//# sourceMappingURL=AssetWatcher.js.map