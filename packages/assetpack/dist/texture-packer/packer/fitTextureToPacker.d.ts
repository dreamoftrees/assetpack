import type { PackTexturesOptions, PixiPacker } from './packTextures.js';
export declare function fitTextureToPacker(bin: PixiPacker, { width, height, fixedSize, padding }: PackTexturesOptions): {
    width: number;
    height: number;
};
