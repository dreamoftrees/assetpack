import type { AssetPipe, PluginOptions } from '../core/index.js';
export interface PixiBundle {
    name: string;
    assets: PixiManifestEntry[];
}
export interface PixiManifest {
    bundles: PixiBundle[];
}
export interface PixiManifestEntry {
    alias: string | string[];
    src: string | string[];
    data?: {
        [x: string]: any;
    };
}
export interface PixiManifestOptions extends PluginOptions {
    /**
     * The output location for the manifest file.
     */
    output?: string;
    /**
     * if true, the alias will be created with the basename of the file.
     */
    createShortcuts?: boolean;
    /**
     * if true, the extensions will be removed from the alias names.
     */
    trimExtensions?: boolean;
    /**
     * if true, the metaData will be outputted in the data field of the manifest.
     */
    includeMetaData?: boolean;
    /**
     * if true, the all tags will be outputted in the data.tags field of the manifest.
     * If false, only internal tags will be outputted to the data.tags field. All other tags will be outputted to the data field directly.
     * @example
     * ```json
     * {
     *   "bundles": [
     *     {
     *       "name": "default",
     *       "assets": [
     *         {
     *           "alias": ["test"],
     *           "src": ["test.png"],
     *           "data": {
     *             "tags": {
     *               "nc": true,
     *               "customTag": true // this tag will be outputted to the data field directly instead of the data.tags field
     *             }
     *           }
     *         }
     *       ]
     *     }
     *   ]
     * }
     * @default true
     */
    legacyMetaDataOutput?: boolean;
    /**
     * A prefix to be added to the src asset paths.
     */
    prefix?: string;
}
export declare function pixiManifest(_options?: PixiManifestOptions): AssetPipe<PixiManifestOptions, 'manifest' | 'mIgnore'>;
