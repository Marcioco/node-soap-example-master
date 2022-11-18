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

    let dataFormatada = (adicionaZero(data.getUTCDate().toString()) + "/" +
      (adicionaZero(data.getUTCMonth() + 1).toString()) + "/" +
      data.getUTCFullYear() + ' ' +
      adicionaZero(data.getUTCHours()) + ':' +
      adicionaZero(data.getUTCMinutes()) + ':' +
      adicionaZero(data.getUTCSeconds()));
  
    return dataFormatada;
  }

  module.exports = {dataHoraBR, dataHoraBRUTC};