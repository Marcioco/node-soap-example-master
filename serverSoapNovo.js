const soap = require('strong-soap').soap;
const http = require('http');

// Defina as funções do serviço
const service = {
  MyService: {
    MyPort: {
      MyFunction: function (args) {
        // Lógica da função
        return {
          result: 'Hello, ' + args.name + '!',
        };
      },
    },
  },
};

// Crie o servidor HTTP
const server = http.createServer(function (request, response) {
  if (request.url.toLowerCase() === '/wsdl?wsdl') {
    response.setHeader('Content-Type', 'application/xml');

    // Gere dinamicamente o WSDL
    const wsdl = soap.createWSDL(null, '/wsdl', service, 'http://example.com/');
    const xml = wsdl.toXML();

    response.end(xml);
  } else {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('404: Not Found: ' + request.url);
  }
});

server.listen(8000, function () {
  console.log('Serviço da Web SOAP está rodando em http://127.0.0.1:8000/wsdl?wsdl');
});
