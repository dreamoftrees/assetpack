import type { AssetPipe, PluginOptions } from '../core/index.js';
export interface MipmapOptions extends PluginOptions {
    /** A template for denoting the resolution of the images. */
    template?: string;
    /** An object containing the resolutions that the images will be resized to. */
    resolutions?: {
        [x: string]: number;
    };
    /** A resolution used if the fixed tag is applied. Resolution must match one found in resolutions. */
    fixedResolution?: string;
}
export declare function mipmap(_options?: MipmapOptions): AssetPipe<MipmapOptions, 'fix'>;
