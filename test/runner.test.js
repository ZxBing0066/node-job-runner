let chai = require('chai');
chai.use(require("chai-as-promised"));
let assert = require('assert');
let expect = require('chai').expect;

let Runner = require('../index').default
let source = require('./source')
let sourceData = source.map(d => d.data)

describe('Runner group', function () {
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

    it('shoult the result equal to source data', () => {
        console.log('result: ', result)
        assert.deepEqual(result, sourceData)
    })

    it('shoult block the queue when some runner blocked', () => {
        console.log('order: ', order)
        assert.equal(order[1], 0)
    })

})

describe('Runner without group', function () {
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

    it('shoult the result equal to source data', () => {
        console.log('result: ', result)
        assert.deepEqual(result, sourceData)
    })

    it('shoult not block the queue when some runner blocked', () => {
        console.log('order: ', order)
        assert.equal(order[order.length - 1], 0)
    })

})