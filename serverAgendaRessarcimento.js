const CronJob = require('cron').CronJob
const { buscaPlanilhasRessarcimento } = require('./ressarcimento')
var express = require('express');

const job = new CronJob('0 */5 * * * *', () => {
    buscaPlanilhasRessarcimento();
    console.log('rodou');
}, null, true, 'America/Sao_Paulo')


// Segundos (opcional): 0 - 59
// Minuto: 0 - 59
// Hora: 0 - 23
// Dia do mês: 1 - 31
// Mês: 1 - 12
// Dia da semana: 0 - 7 (0 e 7 representam domingo)

// Run every second: * * * * * *
// Run every 30 seconds: */30 * * * * *
// Run every 10 minutes: 0 */10 * * * *
// Run every 2 hours: 0 0 */2 * * *

// const job1 = new CronJob('*/30 * * * * *', () => {
//     console.log('tarefa agendada')
// }, null, true, 'America/Sao_Paulo')
var app = express();


// root handler
app.get('/', function (req, res) {
    res.send('Este endereço está reservado para o Agendador de Ressarcimento.');
})

// Launch the server and listen
var port = 8001;
app.listen(port, function () {
    console.log('Ouvindo na porta: ' + port);
})
