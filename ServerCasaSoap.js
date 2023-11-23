const soap = require('soap');
const http = require('http');

// Defina as funções do serviço
const service = {
  MyService: {
    MyPort: {
      MyFunction: function(args) {
        return {
          result: 'Hello, ' + args.name + '!',
        };
      },
    },
  },
};

// Crie o servidor HTTP
const server = http.createServer(function(request, response) {
  response.end('404: Not Found: ' + request.url);
});

// Escute em uma porta específica
server.listen(8000, function() {
  const wsdl = `
  <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
             xmlns:tns="urn:example" 
             targetNamespace="urn:example">

  <types>
    <schema targetNamespace="urn:example"
            xmlns="http://www.w3.org/2001/XMLSchema">
      <element name="MyFunctionRequest">
        <complexType>
          <sequence>
            <element name="name" type="string"/>
          </sequence>
        </complexType>
      </element>
      <element name="MyFunctionResponse">
        <complexType>
          <sequence>
            <element name="result" type="string"/>
          </sequence>
        </complexType>
      </element>
    </schema>
  </types>

  <message name="MyFunctionRequest">
    <part name="parameters" element="tns:MyFunctionRequest"/>
  </message>
  <message name="MyFunctionResponse">
    <part name="parameters" element="tns:MyFunctionResponse"/>
  </message>

  <portType name="MyPortType">
    <operation name="MyFunction">
      <input message="tns:MyFunctionRequest"/>
      <output message="tns:MyFunctionResponse"/>
    </operation>
  </portType>

  <binding name="MyBinding" type="tns:MyPortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="MyFunction">
      <soap:operation soapAction="urn:MyFunction"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
  </binding>

  <service name="MyService">
    <port name="MyPort" binding="tns:MyBinding">
      <soap:address location="http://localhost:8000/wsdl"/>
    </port>
  </service>
</definitions>`;
  const soapServer = soap.listen(server, '/wsdl', service, wsdl);
  console.log('Servidor SOAP rodando em http://localhost:8000/wsdl');
});
