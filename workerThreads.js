var express = require('express');
const { Worker, isMainThread } = require('worker_threads')
// if (isMainThread) {

const worker = new Worker('./worker1.js', 'ola');
worker.on('error', console.error)
worker.on('exit', () => { console.log('fim') });
worker.postMessage('thread: ' + worker.threadId);


var app = express();
// root handler
app.get('/', function (req, res) {
    res.send('trabalhando');
})
// Launch the server and listen
var port = 8002;
app.listen(port, function () {
    console.log('Ouvindo na porta: ' + port);
})
// }