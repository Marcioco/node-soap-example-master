function adicionaZero(numero) {
    if (numero <= 9)
      return "0" + numero;
    else
      return numero;
  }
  
const dataHoraBR = (data) => {

    let dataFormatada = (adicionaZero(data.getDate().toString()) + "/" +
      (adicionaZero(data.getMonth() + 1).toString()) + "/" +
      data.getFullYear() + ' ' +
      adicionaZero(data.getHours()) + ':' +
      adicionaZero(data.getMinutes()) + ':' +
      adicionaZero(data.getSeconds()));
  
    return dataFormatada;
  }


  const dataHoraBRUTC = (data) => {

    let dataFormatada = data.getUTCDate() + "/" +
      ('0' + (data.getUTCMonth() +1) ).slice(-2) + "/" +
       data.getUTCFullYear() + ' ' +
       ('0' + data.getUTCHours()).slice(-2)  + ':' +
       ('0' + data.getUTCMinutes()).slice(-2)  + ':' +
       ('0' + data.getUTCSeconds()).slice(-2) ;
  
    return dataFormatada;
  }

  module.exports = {dataHoraBR, dataHoraBRUTC};