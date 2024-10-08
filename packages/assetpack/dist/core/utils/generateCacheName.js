import objectHash from 'object-hash';
/**
 * Returns a unique name based on the hash generated from the config
 * this takes into account the following:
 * - pipes and their options,
 * - entry and output paths.
 * - assetSettings options
 * - ignore options
 *
 * @param options - The asset pack config
 * @returns - A unique name based on the hash generated from the config
 */
export function generateCacheName(options) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pipes, cache, logLevel, ...configWithoutPlugins } = options;
    const optionsToHash = {
        ...configWithoutPlugins,
    };
    // get pipes
    pipes?.flat().forEach((pipe) => {
        optionsToHash[pipe.name] = pipe.defaultOptions;
    });
    // make a hash..
    return objectHash(optionsToHash);
}
//# sourceMappingURL=generateCacheName.js.map