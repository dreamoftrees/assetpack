export declare const fonts: {
    ttf: {
        to: {
            woff2: (inFile: string | Buffer) => Buffer;
        };
    };
    svg: {
        to: {
            ttf: (inFile: string) => Buffer;
            woff2: (inFile: string) => Buffer;
        };
    };
    otf: {
        to: {
            svg: (inFile: string) => string;
            ttf: (inFile: string) => Buffer;
            woff2: (inFile: string) => Buffer;
        };
    };
};
