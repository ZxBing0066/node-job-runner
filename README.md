# JOB RUNNER

[![Build Status](https://travis-ci.org/ZxBing0066/node-job-runner.svg?branch=master)](https://travis-ci.org/ZxBing0066/node-job-runner)
[![codecov](https://codecov.io/gh/ZxBing0066/node-job-runner/branch/master/graph/badge.svg)](https://codecov.io/gh/ZxBing0066/node-job-runner)
[![npm version](https://badge.fury.io/js/job-runner.svg)](https://badge.fury.io/js/job-runner)

[![NPM](https://nodei.co/npm/job-runner.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/job-runner/)
[![NPM](https://nodei.co/npm-dl/job-runner.png?months=3&height=2)](https://nodei.co/npm/job-runner)

## For What 

When you have to many jobs to run, but there is a limit of async jobs, you can try this, this runner can easily make jobs run of the max async number.

## How to use

### Create runner

there are two method to create a runner, use a constractor:

```js
let Runner = jobRunner.default;
let runner = new Runner({
    source: [1,2,3],
    step: 2,
    runner: (sourceData, index) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(sourceData)
            }, Math.random())
        })
    }
})
```

or use the create function:

```js
let Runner = jobRunner.default;
let runner = new Runner({
    source: [1,2,3],
    step: 2,
    runner: (sourceData, index) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(sourceData)
            }, Math.random())
        })
    }
})
```

### Just run

When you created a runner, you can just call the run of the runner to start you jobs.

```js
console.log('jobs start to run')
runner.run().then((res) => {
    console.log('now jobs run finished')
    console.log('the result of jobs is: ', res)
})
```

## Options

### source

this is the data source of you jobs, must be an array.

### step

this is the number of you parallel jobs

### runner

this is you job, for how to run

### group

if the group is true, you jobs will run with group one by one. Otherwise, if one of the running jobs finished, there will fill another, until there was no left.

### update options

you can update options of exist runners with the setOptions function

```js
runner.setOptions({
    step: 5
})
```