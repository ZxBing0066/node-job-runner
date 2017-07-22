let chai = require('chai');
chai.use(require("chai-as-promised"));
let assert = require('assert');

let jobRunner = require('../index')
let Runner = jobRunner.default;
let source = require('./source')
let sourceData = source.map(d => d.data)

describe('Runner group test', function () {
    this.timeout(1000 * 60 * 5);

    let result;
    let order = [];

    let runner = new Runner({
        source,
        step: 2,
        group: true,
        runner: (sourceData, index) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(sourceData)
                    order.push(sourceData.data)
                    console.log(`do ${sourceData.data} now, source index: ${index}`)
                }, sourceData.time)
            })
        }
    })

    before(() => {
        return runner.run().then(res => result = res.map(d => d.data))
    })

    it('should result length equal to source length', () => {
        assert.equal(result.length, source.length)
    })

    it('should the result equal to source data', () => {
        console.log('result: ', result)
        assert.deepEqual(result, sourceData)
    })

    it('should block the queue when some runner blocked', () => {
        console.log('order: ', order)
        assert.equal(order[1], 0)
    })

})

describe('Runner without group test', function () {
    this.timeout(1000 * 60 * 5);

    let result;
    let order = [];

    let runner = new Runner({
        source,
        step: 2,
        runner: (sourceData, index) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(sourceData)
                    order.push(sourceData.data)
                    console.log(`do ${sourceData.data} now, source index: ${index}`)
                }, sourceData.time)
            })
        }
    })

    before(() => {
        return runner.run().then(res => result = res.map(d => d.data))
    })

    it('should result length equal to source length', () => {
        assert.equal(result.length, source.length)
    })

    it('should the result equal to source data', () => {
        console.log('result: ', result)
        assert.deepEqual(result, sourceData)
    })

    it('should not block the queue when some runner blocked', () => {
        console.log('order: ', order)
        assert.equal(order[order.length - 1], 0)
    })

})

describe('Create test', function () {
    this.timeout(1000 * 60 * 5);

    let result;
    let order = [];

    let runner = jobRunner.create({
        source,
        step: 2,
        runner: (sourceData, index) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(sourceData)
                    order.push(sourceData.data)
                    console.log(`do ${sourceData.data} now, source index: ${index}`)
                }, sourceData.time)
            })
        }
    })

    before(() => {
        return runner.run().then(res => result = res.map(d => d.data))
    })

    it('should result length equal to source length', () => {
        assert.equal(result.length, source.length)
    })

    it('should the result equal to source data', () => {
        console.log('result: ', result)
        assert.deepEqual(result, sourceData)
    })

    it('should not block the queue when some runner blocked', () => {
        console.log('order: ', order)
        assert.equal(order[order.length - 1], 0)
    })

})


describe('SetOption test', function () {
    this.timeout(1000 * 60 * 5);

    let result;
    let order = [];

    let runner = jobRunner.create({
        source,
        step: 2,
        runner: (sourceData, index) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(sourceData)
                    order.push(sourceData.data)
                    console.log(`do ${sourceData.data} now, source index: ${index}`)
                }, sourceData.time)
            })
        }
    })

    it('should options update', () => {
        let options = runner.options;
        assert.equal(options.step, 2)
        runner.setOptions({ step: 3 })
        assert.equal(options.step, 3)
        assert.equal(options.group, undefined)
        runner.setOptions({ group: true })
        assert.equal(options.group, true)
    })

})