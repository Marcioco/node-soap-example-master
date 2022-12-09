const { Worker, isMainThread, parentPort } = require('worker_threads')

parentPort.once('message', (message) => {
    console.log(message, `thead acessada`);
}
)