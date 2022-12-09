// add this to workerExample.js file.
const { workerData, parentPort } = require('worker_threads')
parentPort.postMessage({ welcome: workerData })