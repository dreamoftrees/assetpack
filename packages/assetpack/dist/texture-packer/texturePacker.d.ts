import type { AssetPipe, PluginOptions } from '../core/index.js';
import type { PackTexturesOptions } from './packer/packTextures.js';
export interface TexturePackerOptions extends PluginOptions {
    texturePacker?: Partial<PackTexturesOptions>;
    resolutionOptions?: {
        /** A template for denoting the resolution of the images. */
        template?: string;
        /** An object containing the resolutions that the images will be resized to. */
        resolutions?: Record<string, number>;
        /** A resolution used if the fixed tag is applied. Resolution must match one found in resolutions. */
        fixedResolution?: string;
        /** The maximum size a sprite sheet can be before its split out */
        maximumTextureSize?: number;
    };
    /** If true, the frame names for the sprite sheet will be added to the asset meta data. */
    addFrameNames?: boolean;
}
export declare function texturePacker(_options?: TexturePackerOptions): AssetPipe<TexturePackerOptions, 'tps' | 'fix' | 'jpg'>;
