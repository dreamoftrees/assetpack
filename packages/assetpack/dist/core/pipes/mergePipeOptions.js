import { merge } from '../utils/merge.js';
export function mergePipeOptions(pipe, asset) {
    if (!asset.settings)
        return pipe.defaultOptions;
    const pipeSettings = asset.settings[pipe.name];
    if (pipeSettings === false)
        return false;
    return merge.recursive(pipe.defaultOptions, pipeSettings ?? {});
}
//# sourceMappingURL=mergePipeOptions.js.map