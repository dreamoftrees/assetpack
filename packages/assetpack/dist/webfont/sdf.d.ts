import type { BitmapFontOptions } from 'msdf-bmfont-xml';
import type { AssetPipe, PluginOptions } from '../core/index.js';
export interface SDFFontOptions extends PluginOptions {
    name: string;
    type: BitmapFontOptions['fieldType'];
    font?: Omit<BitmapFontOptions, 'outputType' | 'fieldType'>;
}
export declare function sdfFont(options?: Partial<SDFFontOptions>): AssetPipe<SDFFontOptions, "nc" | "fix" | "font", string>;
export declare function msdfFont(options?: Partial<SDFFontOptions>): AssetPipe<SDFFontOptions, "nc" | "fix" | "font", string>;
