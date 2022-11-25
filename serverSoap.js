/*jslint node: true */
"use strict";

var soap = require('soap');
var express = require('express');
var fs = require('fs');
const oracledb = require("oracledb");
const dbConfig = require("./configDB/configDB");

async function dadosFornecedor(args) {
    let connection = await oracledb.getConnection(dbConfig);
    try {
        console.log('dadosFornecedor acessada!');
        let selectSql = `Select *
                      From FORNECEDOR FORN
                      Where FORN.FORN_CNPJ = :FORN_CNPJ`;

        let result = await connection.execute(selectSql,
            [args.cpf],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );
        let dadosFornec = {};
        dadosFornec.PROTREC = {};
        dadosFornec.PROTREC.PEDIDO = '123456';
        dadosFornec.Trace = {};
        dadosFornec.Trace.TraceEntry = [];
        let message = {};        
        message.Level = 'INFO';
        message.message = 'Mensagem so de Teste';
        dadosFornec.Trace.TraceEntry.push(message);
        message.Level = 'INFO';
        message.message = 'Teste de Mensagem Informativa';
        dadosFornec.Trace.TraceEntry.push(message);
        //dadosFornec.NOME_FANTASIA = result.rows[0].FORN_NOME_FANTASIA;
        //dadosFornec.RAZAO_SOCIAL = result.rows[0].FORN_RAZAO_SOCIAL;
        return result.rows.length ? dadosFornec : { result: 'Nenhum registro' };
    } catch (error) {
        console.error("erro ao listar pedidos", error);
        return { result: 'erro: ' + error.message }
        //res.send("erroSalvar").status(500);
    } finally {
        try {
            if (connection) {
                await connection.close();
            }
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
}

// the service
var serviceObject = {
    scpSoapService: { //MessageSplitterService
        scpSoapPort: { //MessageSplitterServiceSoapPort
            // MessageSplitter: splitter_function,
            // fMarcio: marcio_function,
            fEnviarPedido: dadosFornecedor
        }
    }
};


// load the WSDL file
var xml = fs.readFileSync('serverSoap.wsdl', 'utf8');
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
})
