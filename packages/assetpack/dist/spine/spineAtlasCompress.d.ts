import type { AssetPipe } from '../core/index.js';
import type { CompressOptions } from '../image/index.js';
export type SpineAtlasCompressOptions = Omit<CompressOptions, 'jpg'>;
export declare function spineAtlasCompress(_options?: SpineAtlasCompressOptions): AssetPipe<SpineAtlasCompressOptions, 'nc'>;
