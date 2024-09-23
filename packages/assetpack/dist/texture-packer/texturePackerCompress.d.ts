import type { AssetPipe } from '../core/index.js';
import type { CompressOptions } from '../image/compress.js';
export type TexturePackerCompressOptions = Omit<CompressOptions, 'jpg'>;
export declare function texturePackerCompress(_options?: TexturePackerCompressOptions): AssetPipe<TexturePackerCompressOptions, 'tps' | 'nc'>;
