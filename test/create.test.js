let Runner = require('../index').default

let source = require('./source.json')

let runner = new Runner({
    source,
    step: 2,
    runner: (sourceData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('sourceData:', sourceData)
                reject(sourceData)
            }, Math.random() * 1000 + 1000)
        })
    }
})

runner.run().then(() => {
    console.log(123)
}).catch(e => {
    console.error(e)
})