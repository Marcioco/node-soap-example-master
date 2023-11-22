var soap = require('soap');

var url = 'http://localhost:8005/wsdl?wsdl';

soap.createClient(url, function (err, client) {
  if (err) {
    throw err;
  }

  /* 
  * Parameters of the service call: they need to be called as specified
  * in the WSDL file
  */
 

  var args = {};
  args.strXml = {}
  // call the service
  client.TesteXML(args, function (err, res) {
    if (err)
      throw err;
    // print the service returned result
    console.log(res);
    
  });
})