import sharp from 'sharp';
import type { AstcOptions, BasisOptions, BcOptions } from 'gpu-tex-enc';
import type { AvifOptions, JpegOptions, PngOptions, WebpOptions } from 'sharp';
import type { AssetPipe, PluginOptions } from '../core/index.js';
type CompressJpgOptions = Omit<JpegOptions, 'force'>;
type CompressWebpOptions = Omit<WebpOptions, 'force'>;
type CompressAvifOptions = Omit<AvifOptions, 'force'>;
type CompressPngOptions = Omit<PngOptions, 'force'>;
type CompressBc7Options = BcOptions;
type CompressAstcOptions = AstcOptions;
type CompressBasisOptions = BasisOptions;
export interface CompressOptions extends PluginOptions {
    png?: CompressPngOptions | boolean;
    webp?: CompressWebpOptions | boolean;
    avif?: CompressAvifOptions | boolean;
    jpg?: CompressJpgOptions | boolean;
    bc7?: CompressBc7Options | boolean;
    astc?: CompressAstcOptions | boolean;
    basis?: CompressBasisOptions | boolean;
}
export interface CompressImageData {
    format: '.avif' | '.png' | '.webp' | '.jpg' | '.jpeg';
    resolution: number;
    sharpImage: sharp.Sharp;
}
export interface CompressImageDataResult {
    format: CompressImageData['format'] | '.bc7.dds' | '.astc.ktx' | '.basis.ktx2';
    resolution: number;
    buffer: Buffer;
}
export declare function compress(options?: CompressOptions): AssetPipe<CompressOptions, 'nc'>;
export {};
