const soap = require('strong-soap').soap;

// Defina o serviço SOAP
const service = {
  MyService: {
    MyPort: {
      // Define um método
      MyFunction: function(args) {
        return {
          MyResult: args.name + '!'
        };
      }
    }
  }
};

// Crie o servidor SOAP
const soapServer = soap.listen(8000, '/myservice', service, function() {
  const wsdl = soapServer.wsdl();
  console.log('WSDL disponível em:');
  console.log(wsdl);
});