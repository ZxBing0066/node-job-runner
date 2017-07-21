// runner fun receive an item from the source array, and return a promise
interface RunnerFun {
    (any): Promise<any>;
}

// interface of options, must have a source array, and the step number which the running runner of one time, and the runner fun to run
interface Options {
    source: Array<any>;
    step: number;
    runner: RunnerFun;
    group?: boolean;
    timeout?: number;
}

function Runner(options: Options) {
    this.options = options
}

const proto = Runner.prototype;

// update options
proto.setOptions = function (options: Options) {
    return this.options = Object.assign(this.options, options)
}

proto.run = async function () {
    let { source, step, runner, group } = this.options;
    let result = [];
    let i = 0, l = source.length;
    if (group) {
        // if group, then the runner will run count equal to step option of the runner, and when the group all processed will run the next group
        for (; i < l; i += step) {
            let promises = [];
            let _source = source.slice(i, i + step);
            _source.forEach((sourceData, index) => {
                promises.push(runner(sourceData, i + index))
            });
            await Promise.all(promises).then(res => result = result.concat(res));
        }
    } else {
        // if not group, there will be step count runner in running by one finish there will push a new one 
        let handleResult = (res, index, i): number => {
            // save the result of runner
            result[i] = res;
            // index in the promise queue
            return index;
        }

        type RunnerPromise = Promise<number>;
        type RunnerPromises = Array<RunnerPromise>;

        let promises: Array<Promise<number>> = [];
        // init the first queue
        let _firstQueue = source.slice(i, i + step);
        // init the first promise queue
        _firstQueue.forEach((sourceData: any, index: number) => {
            promises.push(runner(sourceData, index).then(res => handleResult(res, index, index)))
        });

        async function iterator(promises: RunnerPromises, i: number) {
            let resolvedPromiseIndex: number = await Promise.race(promises)
            let sourceData = source[i];
            await (async (index: number) => {
                promises[index] = runner(sourceData, i).then(res => handleResult(res, index, i))
                if (i + 1 < l) {
                    await iterator(promises, i + 1)
                } else {
                    await Promise.all(promises)
                }
            })(resolvedPromiseIndex)
        }
        await iterator(promises, i + step)
    }
    return result;
}

const create = function (options: Options) {
    return new Runner(options)
}

export default Runner

export {
    create
}