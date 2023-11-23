const soap = require('soap');
const url = 'http://localhost:8000/wsdl?wsdl';

// Crie um cliente SOAP com a URL do WSDL
soap.createClient(url, function(err, client) {
  if (err) {
    console.error(err);
  } else {
    // Tente chamar a função do serviço
    const args = { name: 'John' };
    client.MyFunction(args, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
        // O resultado deve ser: { result: 'Hello, John!' }
      }
    });
  }
});