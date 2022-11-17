/*jslint node: true */
"use strict";


var soap = require('soap');
var express = require('express');
var fs = require('fs');
const oracledb = require("oracledb");
const dbConfig = require("./configDB/configDB");


// the splitter function, used by the service
function splitter_function(args) {
  console.log('splitter_function');
  var splitter = args.splitter;
  var splitted_msg = args.message.split(splitter);
  var result = [];
  for (var i = 0; i < splitted_msg.length; i++) {
    result.push(splitted_msg[i]);
  }
  return {
    result: result
  }
}
function marcio_function(args) {
  console.log('marcio_function');
  var nome = args.nome;
  var result = nome + ' resultado ok';
  return {
    result: result
  }
}

async function dadosFornecedor(args) {
  try {
    let connection = await oracledb.getConnection(dbConfig);
    let selectSql = `Select *
                      From FORNECEDOR FORN
                      Where FORN.FORN_CNPJ = :FORN_CNPJ`;

    let result = await connection.execute(selectSql,
      [args.cpf],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,

      }
    );

    return result.rows.length ? result.rows : { result: 'Nenhum registro' };

  } catch (error) {
    console.error("erro ao listar pedidos", error);
    res.send("erroSalvar").status(500);

  } finally {
    if (connection) {
      try {
        await connection.close();

      } catch (error) {
        console.error(error);
      }
    }
  }

  async function solicitacaoPecas(args) {
    try {
      let dadosCotacao = [];
      if (args.PPECRECEBIDO02) {
        if (args.PPECRECEBIDO02.CHAMADA) {          
          dadosCotacao.args.PPECRECEBIDO02.CHAMADA.CNPJ
        }
      }

      let connection = await oracledb.getConnection(dbConfig);
      let selectSql = `Select *
                        From FORNECEDOR FORN
                        Where FORN.FORN_CNPJ = :FORN_CNPJ`;

      let result = await connection.execute(selectSql,
        [args.cpf],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,

        }
      );

      return result.rows.length ? result.rows : { result: 'Nenhum registro' };

    } catch (error) {
      console.error("erro ao listar pedidos", error);
      res.send("erroSalvar").status(500);

    } finally {
      if (connection) {
        try {
          await connection.close();

        } catch (error) {
          console.error(error);
        }
      }
    }

    // {
    //   nomeFantasia: result.rows.length ? result.rows[0].FORN_NOME_FANTASIA : 'Nenhum registro',
    //   rua: result.rows.length ? result.rows[0].FORN_RUA : 'Nenhum registro',
    //   numero: result.rows.length ? result.rows[0].FORN_NUMERO : 'Nenhum registro',
    //   bairro: result.rows.length ? result.rows[0].FORN_BAIRRO : 'Nenhum registro'

    // }
  }


  // the service
  var serviceObject = {
    MarcioSoapService: { //MessageSplitterService
      MarcioSOAPPort: { //MessageSplitterServiceSoapPort
        MessageSplitter: splitter_function,
        fMarcio: marcio_function,
        fdadosFornecedor: dadosFornecedor
      }
    }
  };


  var serviceObject1 = {
    ScpSoapService: { //MessageSplitterService
      ScpSOAPPort: { //MessageSplitterServiceSoapPort            
        fsolicitacaoPecas: solicitacaoPecas
      }
    }
  };

  // load the WSDL file
  var xml = fs.readFileSync('marcio.wsdl', 'utf8');
  // create express app
  var app = express();

  // root handler
  app.get('/', function (req, res) {
    res.send('Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>');
  })

  // Launch the server and listen
  var port = 8000;
  app.listen(port, function () {
    console.log('Listening on port ' + port);
    var wsdl_path = "/wsdl";
    soap.listen(app, wsdl_path, serviceObject, xml);
    console.log("Check http://localhost:" + port + wsdl_path + "?wsdl to see if the service is working");
  });