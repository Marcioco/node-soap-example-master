
const soap = require('soap');
const { geraDadosRetornoPecas } = require('./util')
 

const enviaPedido = async (idCotacao) => {
  geraDadosRetornoPecas(idCotacao).then(result => {
    let xml = result;
    if (result) {
      // define a conexão para o servidor SOAP HDI
      let url = 'http://ws.planetun.com.br/hdi.asmx?WSDL';
      let args = {};
      args.strXml = xml;

      soap.createClient(url, function (err, client) {
        if (err) {
          throw err;
        }
        args.strXml = xml;
        console.log(client.describe());


        // client.EnviarPedido(args, function (err, res) {
        //   if (err)
        //     throw err;
        //   // print the service returned result
        //   console.log(res);
        // });

      }
      )
    }



  }
  ).catch(error => {
    console.log(error);
  });
};

enviaPedido(348);