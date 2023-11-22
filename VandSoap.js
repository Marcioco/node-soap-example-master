const soap = require('soap');
const http = require('http');


const server = http.createServer((req, res) => {
    // Configurando o cabeçalho da resposta
    res.writeHead(200, {'Content-Type': 'text/plain'});
  
    // Enviando a resposta de volta ao cliente
    res.end('Hello, world!\n');
  });

  const port = 3000;




// Define as operações do serviço
const myService = {
  MyService: {
    MyPort: {
      MyFunction: function(args) {
        return { name: args.name };
      },
    },
  },
};


  // Iniciando o servidor e ouvindo na porta especificada
  server.listen(port, () => {
    const serverSoap = soap.listen(http, '/wsdl', myService);    
    console.log(`Servidor está ouvindo na porta ${port}`);
  });
