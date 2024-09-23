import type { CompressImageData } from '../compress.js';
export declare function mipmapSharp(image: CompressImageData, resolutionHash: {
    [x: string]: number;
}, largestResolution: number): Promise<CompressImageData[]>;
