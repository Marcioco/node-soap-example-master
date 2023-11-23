/*jslint node: true */
"use strict";

var soap = require('soap');
var express = require('express');
var fs = require('fs');
//const oracledb = require("oracledb");
//const dbConfig = require("./configDB/configDB");


async function testeXML(args) {
    return { result: 'Nenhum registro' };
}

// the service
var serviceObject = {
    testeSoapService: { //MessageSplitterService
        testeSoapPort: { //MessageSplitterServiceSoapPort
            // MessageSplitter: splitter_function,
            // fMarcio: marcio_function,
            TesteXml: testeXML
        }
    }
};

// load the WSDL file
var xml = fs.readFileSync('serverSoapXML.wsdl', 'utf8');
// create express app
var app = express();

// root handler
app.get('/', function (req, res) {
    res.send('Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>');
})

// Launch the server and listen
var port = 8005;
app.listen(port, function () {
    console.log('Listening on port ' + port);
    var wsdl_path = "/wsdl";
    soap.listen(app, wsdl_path, serviceObject, xml);
    console.log("Check http://localhost:" + port + wsdl_path + "?wsdl to see if the service is working");
})
