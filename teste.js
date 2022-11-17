// var cluster = require('node:cluster'),
//     http = require('node:http'),
//     { cpus } = require('node:os'),
//     process = require('node:process');

// if (cluster.isPrimary) {
//     console.log('entrou aqui');
//     // Keep track of http requests
//     let numReqs = 0;
//     setInterval(() => {
//         console.log(`numReqs = ${numReqs}`);
//     }, 1000);

//     // Count requests
//     function messageHandler(msg) {
//         if (msg.cmd && msg.cmd === 'notifyRequest') {
//             numReqs += 1;
//         }
//     }

//     // Start workers and listen for messages containing notifyRequest
//     const numCPUs = cpus().length;
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }

//     for (const id in cluster.workers) {
//         cluster.workers[id].on('message', messageHandler);
//         cluster.workers[id].on('exit', function (worker) {
//             console.log('Cluster %d esta desconectado.', worker.process.pid);
//         });
//     }

// } else {
//     console.log('criou o servidor');
//     // Worker processes have a http server.
//     http.Server((req, res) => {
//         res.writeHead(200);
//         res.end('hello world\n');

//         // Notify primary about the request
//         process.send({ cmd: 'notifyRequest' });
//     }).listen(8000);
// }

const oracledb = require("oracledb");
const dbConfig = require("./configDB/configDB");

//const gravaSolicitacaoPecas = async () => {
async function gravaSolicitacaoPecas() {
    let args = {
        "ReceberPedidoRequest": {
            "PPECENVIADO02": {
                "CHAMADA": {
                    "CNPJ": "30274547000146",
                    "CHAMADOR": "NOME CHAMADOR",
                    "CPF": "53112254867",
                    "PERITO": "NOME DO PERITO"
                },
                "OFICINAS": {
                    "OFICINA": {
                        "PESSOA": "J",
                        "CGC": "81134312000190",
                        "CONTATO": 'JOAOZINHO',
                        "EMAIL": "joazinho@oficina.com.br",
                        "CODIGO_OFICINA": "123456",
                        "TELEFONES": {
                            "DDD1": "62",
                            "NUMERO1": "981697636"
                        }
                    }
                },
                "FORNECEDORES": {
                    "FORNECEDOR": [
                        {
                            "CNPJ": "02918639000186",
                            "TIPO": "C",
                            "NOME": "BELCAR VEICULOS LTDA"
                        },
                        {
                            "CNPJ": "12657826000530",
                            "TIPO": "C",
                            "NOME": "SAGA KOREA COMÉRCIO DE VEÍCULOS, PEÇAS E SERVIÇOS LTDA"
                        }
                    ]
                },
                "PEDIDOS": {
                    "PEDIDO": {
                        "IDPEDIDO": 98343,
                        "NUMERO": "202211171028",
                        "DATAABERTURA": "2022-11-17 10:30:00",
                        "REMETENTE": {
                            "CNPJ": "61198164000160"
                        },
                        "ORCAMENTO": {
                            "NUMERO": "202216110905",
                            "COMPLEMENTO": "1234567890",
                            "VERSAO": "12345",
                            "SINISTRO": "202216110904",
                            "APOLICE": "ABC123456",
                            "DATAVISTORIA": "2022-11-17 10:30:00",
                            "ANALISTA": "CARLOS",
                            "LOGIN_ANALISTA": "CARLOS",
                            "REGIAO_ANALISTA": "GOIAS"

                        },
                        "CGCS": {
                            "SEGURADORA": "61198164000160",
                            "SUCURSAL": "61198164000160"
                        },
                        "VEICULO": {
                            "PLACA": "ABCD1234",
                            "CHASSI": "1234567890ABC",
                            "DESCRICAO": "RENEGADE",
                            "COR": "BRANCA",
                            "KM": '2500',
                            "ANOMODELO": "2022",
                            "ANOFABRICACAO": "2023",
                            "CODIGO_MARCA": "1254",
                            "MARCA": "JEEP",
                            "CODIGO_MODELO": "254",
                            "MODELO": "RENEGADE",
                            "VERSAO": "LONGITUDE"
                        },
                        "ITENSPEDIDO": {
                            "ITEMPEDIDO": [
                                {
                                    "CNPJFOR": "12657826000530",
                                    "CODIGO": "921011S500",
                                    "DESCRICAO": "FAROL LE",
                                    "QTDE": 1,
                                    "PRECO_CON": 1369,
                                    "PRECO_ALT": 1204.72,
                                    "STATUSITEMPEDIDO": 0,
                                    "PRAZO_ENTREGA": 2,
                                    "IDPEC": 23454587
                                },
                                {
                                    "CNPJFOR": "02918639000186",
                                    "CODIGO": "664001S000",
                                    "DESCRICAO": "CAPO",
                                    "QTDE": 1,
                                    "PRECO_CON": 1748,
                                    "PRECO_ALT": 1538.24,
                                    "STATUSITEMPEDIDO": 0,
                                    "PRAZO_ENTREGA": 3,
                                    "IDPEC": 54454544
                                },
                                {
                                    "CNPJFOR": "02918639000186",
                                    "CODIGO": "86350R1000",
                                    "DESCRICAO": "GRADE DIANT",
                                    "QTDE": 1,
                                    "PRECO_CON": 745.14,
                                    "PRECO_ALT": 655.72,
                                    "STATUSITEMPEDIDO": 0,
                                    "PRAZO_ENTREGA": 2,
                                    "IDPEC": 4578566
                                }
                            ]
                        }
                    }
                }
            }
        }
    }

    let dadosCotacao = {}, dadosItensCota = {}, jsonSolPecas = {}, jsonOficinaFK = {},
        jsonContatoOficina = {};
    let oficina, unidadeFederativa, seguradora;
    let arrayItensPedido = [];
    let connection = await oracledb.getConnection(dbConfig);
    if (args.ReceberPedidoRequest) {
        //PPECRECEBIDO02 -- substituir abaixo
        if (args.ReceberPedidoRequest.PPECENVIADO02) {
            jsonSolPecas = args.ReceberPedidoRequest.PPECENVIADO02;
        };
    };

    //CHAMADOR
    if (jsonSolPecas.CHAMADA) {
        dadosCotacao.COTA_CNPJ_COMPRADOR = (jsonSolPecas.CHAMADA.CNPJ);
        dadosCotacao.COTA_NOME_COMPRADOR = (jsonSolPecas.CHAMADA.CHAMADOR);
        dadosCotacao.COTA_CPF_PERITO = (jsonSolPecas.CHAMADA.CPF);
        dadosCotacao.COTA_NOME_PERITO = (jsonSolPecas.CHAMADA.PERITO);
    };

    //FORNECEDORES 

    //DADOS DA OFICINA
    let cpfCnpjOficina;
    if (jsonSolPecas.OFICINAS) {
        if (jsonSolPecas.OFICINAS.OFICINA) {
            if (jsonSolPecas.OFICINAS.OFICINA.PESSOA) {
                if (jsonSolPecas.OFICINAS.OFICINA.PESSOA === 'F') { cpfCnpjOficina = jsonSolPecas.OFICINAS.OFICINA.CPF }
                else if (jsonSolPecas.OFICINAS.OFICINA.PESSOA === 'J') { cpfCnpjOficina = jsonSolPecas.OFICINAS.OFICINA.CGC }
            };
            // if (cpfCnpjOficina) {
            //     oficina = await connection.execute(`Select FORN.ID_FORNECEDOR 
            //                                           From FORNECEDOR FORN
            //                                          Where FORN.FORN_CNPJ = :FORN_CNPJ`,
            //         [cpfCnpjOficina],
            //         { outFormat: oracledb.OUT_FORMAT_OBJECT });
            //     if (oficina.rows.length) {
            //         dadosCotacao.ID_FORNEC_OFICINA = oficina.rows[0].ID_FORNECEDOR;
            //     };
            // }

            jsonOficinaFK.ID_FORNECEDOR = '';//dadosCotacao.ID_FORNEC_OFICINA || '';
            jsonOficinaFK.FORN_CNPJ = cpfCnpjOficina;
            jsonOficinaFK.FORN_NOME_FANTASIA = jsonSolPecas.OFICINAS.OFICINA.APELIDO;
            jsonOficinaFK.FORN_RAZAO_SOCIAL = jsonSolPecas.OFICINAS.OFICINA.NOME;
            jsonOficinaFK.FORN_RUA = jsonSolPecas.OFICINAS.OFICINA.ENDERECO;
            jsonOficinaFK.FORN_NUMERO = jsonSolPecas.OFICINAS.OFICINA.NUMERO;
            jsonOficinaFK.FORN_BAIRRO = jsonSolPecas.OFICINAS.OFICINA.BAIRRO;
            jsonOficinaFK.FORN_CIDADE = jsonSolPecas.OFICINAS.OFICINA.CIDADE;

            // unidadeFederativa = await connection.execute(`Select UNFE.ID_UNIDADE_FEDERATIVA
            //                                                 From UNIDADE_FEDERATIVA UNFE
            //                                                Where UNFE.UNFE_SIGLA = :UNFE_SIGLA`,
            //     [jsonSolPecas.OFICINAS.OFICINA.UF],
            //     { outFormat: oracledb.OUT_FORMAT_OBJECT });
            // if (unidadeFederativa.rows.length) {
            //     jsonOficinaFK.ID_UNIDADE_FEDERATIVA = unidadeFederativa.rows[0].ID_UNIDADE_FEDERATIVA;
            // };  
            jsonOficinaFK.ID_UNIDADE_FEDERATIVA = {UNIDADE_FEDERATIVA: {UF: jsonSolPecas.OFICINAS.OFICINA.UF}};
            jsonOficinaFK.FORN_CEP = jsonSolPecas.OFICINAS.OFICINA.CEP;

            dadosCotacao.ID_FORNEC_OFICINA = {FORNECEDOR : {jsonOficinaFK}};

            dadosCotacao.COTA_COD_OFICINA_SEGURADORA = jsonSolPecas.OFICINAS.OFICINA.CODIGO_OFICINA;
            //CONTATOS OFICINA
            jsonContatoOficina.FRCO_NOME = jsonSolPecas.OFICINAS.OFICINA.CONTATO;
            jsonContatoOficina.FRCO_EMAIL = jsonSolPecas.OFICINAS.OFICINA.EMAIL;
            if (jsonSolPecas.OFICINAS.OFICINA.TELEFONES) {
                jsonContatoOficina.FRCO_CELULAR_DDD = jsonSolPecas.OFICINAS.OFICINA.TELEFONES.DDD1;
                jsonContatoOficina.FRCO_CELULAR_NUMERO = jsonSolPecas.OFICINAS.OFICINA.TELEFONES.NUMERO1;
                jsonContatoOficina.FRCO_FONE_COMERCIAL_DDD = jsonSolPecas.OFICINAS.OFICINA.TELEFONES.DDD2;
                jsonContatoOficina.FRCO_FONE_COMERCIAL_NUMERO = jsonSolPecas.OFICINAS.OFICINA.TELEFONES.NUMERO2;
            }
        };
    };

    //DADOS DO PEDIDO
    if (jsonSolPecas.PEDIDOS) {
        if (jsonSolPecas.PEDIDOS.PEDIDO) {
            dadosCotacao.COTA_IDPEDIDO_PEDI = jsonSolPecas.PEDIDOS.PEDIDO.IDPEDIDO;
            dadosCotacao.COTA_NUMERO_PEDI = jsonSolPecas.PEDIDOS.PEDIDO.NUMERO;
            dadosCotacao.COTA_DATAABERTURA_PEDI = jsonSolPecas.PEDIDOS.PEDIDO.DATAABERTURA;
            if (jsonSolPecas.PEDIDOS.PEDIDO.REMETENTE) {
                dadosCotacao.COTA_CNPJ_REMETENTE_PEDI = jsonSolPecas.PEDIDOS.PEDIDO.REMETENTE.CNPJ;
            };
            if (jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO) {
                dadosCotacao.COTA_NUM_COTACAO = jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO.NUMERO;
                dadosCotacao.COTA_COMPLEMENTO_ORC = jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO.COMPLEMENTO;
                dadosCotacao.COTA_VERSAO_ORC = jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO.VERSAO;
                dadosCotacao.COTA_NUM_SINISTRO = jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO.SINISTRO;
                dadosCotacao.COTA_APOLICE_ORC = jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO.APOLICE;
                dadosCotacao.COTA_DATAVISTORIA_ORC = jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO.DATAVISTORIA;
                dadosCotacao.COTA_ANALISTA_ORC = jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO.ANALISTA;
                dadosCotacao.COTA_LOGIN_ANALISTA_ORC = jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO.LOGIN_ANALISTA;
                dadosCotacao.COTA_REGIAO_ANALISTA_ORC = jsonSolPecas.PEDIDOS.PEDIDO.ORCAMENTO.REGIAO_ANALISTA;
            };
            if (jsonSolPecas.PEDIDOS.PEDIDO.CGCS) {
                if (jsonSolPecas.PEDIDOS.PEDIDO.CGCS.SEGURADORA) {
                    seguradora = await connection.execute(`Select ID_SEGURADORA
                                                             From SEGURADORA 
                                                            Where SGRA_CNPJ = :SGRA_CNPJ`,
                        [jsonSolPecas.PEDIDOS.PEDIDO.CGCS.SEGURADORA],
                        { outFormat: oracledb.OUT_FORMAT_OBJECT });
                    if (seguradora.rows.length) {
                        dadosCotacao.ID_SEGURADORA = seguradora.rows[0].ID_SEGURADORA;
                    };
                }
                dadosCotacao.COTA_CNPJ_SUCURSAL = jsonSolPecas.PEDIDOS.PEDIDO.CGCS.SUCURSAL;
                dadosCotacao.COTA_CNPJ_REGULADORA = jsonSolPecas.PEDIDOS.PEDIDO.CGCS.SEGURADORA;
            };
            if (jsonSolPecas.PEDIDOS.PEDIDO.VEICULO) {

                dadosCotacao.COTA_VEICULO_PLACA = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.PLACA;
                dadosCotacao.COTA_VEICULO_CHASSI = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.CHASSI;
                dadosCotacao.COTA_VEICULO_MODELO = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.DESCRICAO;
                dadosCotacao.COTA_VEICULO_COR = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.COR;
                dadosCotacao.COTA_VEICULO_QUILOMETRAGEM = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.KM;
                dadosCotacao.COTA_VEICULO_ANO_MODELO = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.ANOMODELO;
                dadosCotacao.COTA_VEICULO_ANO_FABR = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.ANOFABRICACAO;
                dadosCotacao.COTA_VEICULO_COD_MARCA = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.CODIGO_MARCA;

                marca = await connection.execute(`Select MRVC.ID_MARCA_VEICULO
                                                    From MARCA_VEICULO MRVC
                                                   Where MRVC.MRVC_DESCRICAO = :MRVC_DESCRICAO`,
                    [jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.MARCA],
                    { outFormat: oracledb.OUT_FORMAT_OBJECT });
                if (marca.rows.length) {
                    dadosCotacao.ID_MARCA_VEICULO = marca.rows[0].ID_MARCA_VEICULO;
                };

                dadosCotacao.COTA_VEICULO_COD_MODELO = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.CODIGO_MODELO;
                dadosCotacao.COTA_VEICULO_MODELO = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.MODELO;
                dadosCotacao.COTA_VEICULO_VERSAO = jsonSolPecas.PEDIDOS.PEDIDO.VEICULO.VERSAO;
            }
            dadosItensCota = [];
            if (jsonSolPecas.PEDIDOS.PEDIDO.ITENSPEDIDO) {
                if (jsonSolPecas.PEDIDOS.PEDIDO.ITENSPEDIDO.ITEMPEDIDO) {
                    arrayItensPedido = jsonSolPecas.PEDIDOS.PEDIDO.ITENSPEDIDO.ITEMPEDIDO;
                    for (key in arrayItensPedido) {
                        //console.log(arrayItensPedido[key].CNPJFOR)
                        jsonItemPedido = {};
                        jsonItemPedido.ITCO_PART_NUMBER = arrayItensPedido[key].CODIGO; //obrig
                        jsonItemPedido.ITCO_DESCRICAO = arrayItensPedido[key].DESCRICAO; //obrig
                        jsonItemPedido.ITCO_QUANTIDADE = arrayItensPedido[key].QTDE;  // obrig
                        if (arrayItensPedido[key].FLAG_PRECO = 'C') {
                            jsonItemPedido.ITCO_PRECO_BRUTO_SEGURADORA = arrayItensPedido[key].PRECO_CON;
                        } else {
                            jsonItemPedido.ITCO_PRECO_BRUTO_SEGURADORA = arrayItensPedido[key].PRECO_ALT;
                        };

                        statusItem = await connection.execute(`Select STIT.ID_STATUS_ITEM
                                                                 From STATUS_ITEM STIT
                                                                Where STIT.STIT_CODIGO = :STIT_CODIGO 
                       `,
                            [arrayItensPedido[key].STATUSITEMPEDIDO],
                            { outFormat: oracledb.OUT_FORMAT_OBJECT });

                        if (statusItem.rows.length) {
                            jsonItemPedido.ID_STATUS_ITEM = statusItem.rows[0].ID_STATUS_ITEM
                        };


                        jsonItemPedido.ITCO_PORC_DESCONTO = arrayItensPedido[key].DESCONTO;//opci
                        jsonItemPedido.ITCO_IDPEC = arrayItensPedido[key].IDPEC; //obrig
                        dadosItensCota.push(jsonItemPedido);
                    }
                }
            }
        }
    }
    //jsonOficinaFK deve ser cadastrada ou atualizada

    console.log(dadosCotacao);
    //console.log(dadosItensCota);

}

gravaSolicitacaoPecas();