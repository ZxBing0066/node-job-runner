interface Options {
    source: Array<any>;
    step: Number;
    runner: Function;
    timeout?: Number;
}

function Runner(options:Options) {
    this.options = options
}

const proto = Runner.prototype;

proto.setOptions = function(options:Options) {
    return this.options = Object.assign(this.options, options)
}
proto.run = async function() {
    let { source, step, runner } = this.options;
    let i = 0, l = source.length;
    for(; i < l; i += step) {
        let promises = [];
        let _source = source.slice(i, i + step);
        _source.forEach(sourceData => {
            promises.push(runner(sourceData))
        });
        await Promise.all(promises);
    }
}

const create = function(options:Options) {
    return new Runner(options)
}

export default Runner

export {
    create
}