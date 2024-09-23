export function promiseAllConcurrent(promisesFunctions, concurrency) {
    return new Promise((resolve, reject) => {
        let currentIndex = 0;
        let concurrentCount = 0;
        let completedCount = 0;
        function next() {
            // Check if all promises are completed
            if (completedCount === promisesFunctions.length) {
                resolve();
                return;
            }
            while (concurrentCount < concurrency && currentIndex < promisesFunctions.length) {
                concurrentCount++;
                const currentPromise = promisesFunctions[currentIndex]();
                currentIndex++;
                // eslint-disable-next-line no-loop-func
                currentPromise.then(() => {
                    concurrentCount--;
                    completedCount++;
                    next();
                }).catch((error) => {
                    reject(error);
                });
            }
        }
        next();
    });
}
//# sourceMappingURL=promiseAllConcurrent.js.map