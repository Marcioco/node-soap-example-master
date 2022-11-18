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

//grava a solicitação de Peças (Montagem da Cotação) na tabela SOLICITACAO_PECAS, para em seguida
//ser gerado a cotação no sistema
async function gravaSolicitacaoPecas() {
    let connection = await oracledb.getConnection(dbConfig);
    try {
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
                            "APELIDO": "JO",
                            "NOME": "JOAQUIM OFICINA",
                            "ENDERECO": "Avenida T-30",
                            "NUMERO": "10",
                            "BAIRRO": "Santa Luzia",
                            "CIDADE": "Aparecida de Goiania",
                            "UF": "GO",
                            "CEP": "74923230",
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

        let jsonSolicPecas = {};
        let idPedido, numPedido;
        let jsonBanco = {};

        if (args.ReceberPedidoRequest) {
            //PPECRECEBIDO02 -- substituir abaixo
            if (args.ReceberPedidoRequest.PPECENVIADO02) {
                jsonSolicPecas = args.ReceberPedidoRequest.PPECENVIADO02;
            };
        };

        if (jsonSolicPecas.PEDIDOS) {
            if (jsonSolicPecas.PEDIDOS.PEDIDO) {
                idPedido = jsonSolicPecas.PEDIDOS.PEDIDO.IDPEDIDO;
                numPedido = jsonSolicPecas.PEDIDOS.PEDIDO.NUMERO;
            };
        };

        if (!idPedido) {
            throw new Error('tag IDPEDIDO do Pedido não encontrada!');
        };

        if (!idPedido) {
            throw new Error('tag NUMERO do Pedido não encontrada!')
        };

        let strJson = JSON.stringify(args);
        let idSolicitacaoPecas;

        let buscaSolicPecas = await connection.execute(`Select ID_SOLICITACAO_PECAS
                                                         From SOLICITACAO_PECAS 
                                                        Where SOPE_IDPEDIDO = :SOPE_IDPEDIDO
                                                          And SOPE_NUMERO_PEDI = :SOPE_NUMERO_PEDI
                                                          And SOPE_STATUS = 'Pendente'
                                                          For Update`,
            [idPedido,
                numPedido],
            { outFormat: oracledb.OUT_FORMAT_OBJECT });
        if (buscaSolicPecas.rows.length) {
            idSolicitacaoPecas = buscaSolicPecas.rows[0].ID_SOLICITACAO_PECAS;
        };
        if (idSolicitacaoPecas) {
            await connection.execute(`Update SOLICITACAO_PECAS
                                     Set SOPE_DATA_RECEBIMENTO = SYSDATE,
                                         SOPE_JSON = :SOPE_JSON
                                   Where ID_SOLICITACAO_PECAS = :ID_SOLICITACAO_PECAS`,
                [strJson,
                    idSolicitacaoPecas],
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                    //autoCommit: true
                });

        } else {
            let buscaId = await connection.execute(`Select SEQ_SOPE.NEXTVAL ID From DUAL`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT });

            idSolicitacaoPecas = buscaId.rows[0].ID;
            await connection.execute(`Insert Into SOLICITACAO_PECAS
                                    (ID_SOLICITACAO_PECAS,
                                    SOPE_IDPEDIDO,
                                    SOPE_NUMERO_PEDI,
                                    SOPE_DATA_RECEBIMENTO,
                                    SOPE_STATUS,
                                    SOPE_JSON)
                                Values
                                    (:ID_SOLICITACAO_PECAS,
                                     :SOPE_IDPEDIDO,
                                     :SOPE_NUMERO_PEDI,
                                     SYSDATE,
                                     :SOPE_STATUS,
                                     :SOPE_JSON) `,
                [idSolicitacaoPecas,
                    idPedido,
                    numPedido,
                    'Pendente',
                    strJson],
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                    //autoCommit: true
                });
        };

        oracledb.fetchAsString = [oracledb.CLOB];
        let solicitacaoPecas = await connection.execute(`Select SOPE_STATUS, SOPE_JSON
                                                          From SOLICITACAO_PECAS 
                                                         Where SOPE_IDPEDIDO = :SOPE_IDPEDIDO
                                                           And SOPE_NUMERO_PEDI = :SOPE_NUMERO_PEDI`,
            [idPedido,
                numPedido],
            { outFormat: oracledb.OUT_FORMAT_OBJECT });
        if (solicitacaoPecas.rows.length) {
            jsonBanco = JSON.parse(solicitacaoPecas.rows[0].SOPE_JSON);
            //validação dos campos obrigatórios
            validaJsonSolicPecas(jsonBanco);
            //
            console.log(jsonBanco)

        } else {
            throw new Error('falha na gravação da Solicitação de Peças!')
        }
        connection.commit();
    }
    catch (error) {
        connection.rollback();
        console.error(error);
    }
    finally {
        if (connection) {
            try {
                await connection.close();

            } catch (error) {
                console.error(error);
            }
        }
    }
}

//verifica se a Tag do Json existe e se tem conteudo
function tagExiste(tag) {
    if (!tag || (tag.length === 0)) {
        return false;
    } else {
        return true;
    }

}

//Validação do Json de Solicitação de Peças
function validaJsonSolicPecas(jsonPecas) {
    let dadosCotacao = {}, dadosItensCota = {}, jsonSolPecas = {}, jsonOficinaFK = {},
        jsonContatoOficina = {}, jsonErro = {};
    let oficina, unidadeFederativa, seguradora;
    let arrayItensPedido = [];

    if (jsonPecas.ReceberPedidoRequest) {
        //PPECRECEBIDO02 -- substituir abaixo
        if (jsonPecas.ReceberPedidoRequest.PPECENVIADO02) {
            jsonSolPecas = jsonPecas.ReceberPedidoRequest.PPECENVIADO02;
        };
    };

    //CHAMADOR
    if (jsonSolPecas.CHAMADA) {
        if (!tagExiste(jsonSolPecas.CHAMADA.CNPJ)) { throw new Error('tag <CNPJ> não encontrada em <CHAMADA>!') };
        if (!tagExiste(jsonSolPecas.CHAMADA.CHAMADOR)) { throw new Error('tag <CHAMADOR> não encontrada em <CHAMADA>!') };
        if (!tagExiste(jsonSolPecas.CHAMADA.CPF)) { throw new Error('tag <CPF> não encontrada em <CHAMADA>!') };
        if (!tagExiste(jsonSolPecas.CHAMADA.PERITO)) { throw new Error('tag <PERITO> não encontrada em <CHAMADA>!') };
    } else {
        throw new Error('tag <CHAMADOR> não encontrada!');
    };

    //DADOS DA OFICINA
    let cpfCnpjOficina;
    if (jsonSolPecas.OFICINAS) {
        if (jsonSolPecas.OFICINAS.OFICINA) {
            console.log(jsonSolPecas.OFICINAS.OFICINA);
            if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.PESSOA)) { throw new Error('tag <PESSOA> não encontrada em <OFICINAS><OFICINA>!'); };
            if (jsonSolPecas.OFICINAS.OFICINA.PESSOA === 'F') {
                cpfCnpjOficina = jsonSolPecas.OFICINAS.OFICINA.CPF
                if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.CPF)) { throw new Error('tag <CPF> não encontrada em <OFICINAS><OFICINA>!'); };
            }
            else if (jsonSolPecas.OFICINAS.OFICINA.PESSOA === 'J') {
                if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.CGC)) { throw new Error('tag <CGC> não encontrada em <OFICINAS><OFICINA>!'); };
            };
            if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.APELIDO)) { throw new Error('tag <APELIDO> não encontrado em <OFICINAS><OFICINA>!'); };
            if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.NOME)) { throw new Error('tag <NOME> não encontrado em <OFICINAS><OFICINA>!'); };
            if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.ENDERECO)) { throw new Error('tag <ENDERECO> não encontrado em <OFICINAS><OFICINA>!'); };
            if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.NUMERO)) { throw new Error('tag <NUMERO> não encontrado em <OFICINAS><OFICINA>!'); };
            if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.BAIRRO)) { throw new Error('tag <BAIRRO> não encontrado em <OFICINAS><OFICINA>!'); };
            if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.CIDADE)) { throw new Error('tag <CIDADE> não encontrada em <OFICINAS><OFICINA>!'); };

            if (!tagExiste(jsonSolPecas.OFICINAS.OFICINA.CODIGO_OFICINA)) { throw new Error('tag <CODIGO_OFICINA> não encontrada em <OFICINAS><OFICINA>!') }
           

        } else {
            throw new Error('tag <OFICINA> não encontrada em <OFICINAS>!');
        };
    } else {
        throw new Error('tag <OFICINAS> não encontrada!');
    };
};

async function ProcessaSolicitacaoPecas() {
    let dadosCotacao = {}, dadosItensCota = {}, jsonSolPecas = {}, jsonOficinaFK = {},
        jsonContatoOficina = {};
    let oficina, unidadeFederativa, seguradora;
    let arrayItensPedido = [];

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
            if (cpfCnpjOficina) {
                oficina = await connection.execute(`Select FORN.ID_FORNECEDOR 
                                                      From FORNECEDOR FORN
                                                     Where FORN.FORN_CNPJ = :FORN_CNPJ`,
                    [cpfCnpjOficina],
                    { outFormat: oracledb.OUT_FORMAT_OBJECT });
                if (oficina.rows.length) {
                    dadosCotacao.ID_FORNEC_OFICINA = oficina.rows[0].ID_FORNECEDOR;
                };
            }

            // jsonOficinaFK.ID_FORNECEDOR = '';//dadosCotacao.ID_FORNEC_OFICINA || '';
            // jsonOficinaFK.FORN_CNPJ = cpfCnpjOficina;
            // jsonOficinaFK.FORN_NOME_FANTASIA = jsonSolPecas.OFICINAS.OFICINA.APELIDO;
            // jsonOficinaFK.FORN_RAZAO_SOCIAL = jsonSolPecas.OFICINAS.OFICINA.NOME;
            // jsonOficinaFK.FORN_RUA = jsonSolPecas.OFICINAS.OFICINA.ENDERECO;
            // jsonOficinaFK.FORN_NUMERO = jsonSolPecas.OFICINAS.OFICINA.NUMERO;
            // jsonOficinaFK.FORN_BAIRRO = jsonSolPecas.OFICINAS.OFICINA.BAIRRO;
            // jsonOficinaFK.FORN_CIDADE = jsonSolPecas.OFICINAS.OFICINA.CIDADE;

            // unidadeFederativa = await connection.execute(`Select UNFE.ID_UNIDADE_FEDERATIVA
            //                                                 From UNIDADE_FEDERATIVA UNFE
            //                                                Where UNFE.UNFE_SIGLA = :UNFE_SIGLA`,
            //     [jsonSolPecas.OFICINAS.OFICINA.UF],
            //     { outFormat: oracledb.OUT_FORMAT_OBJECT });
            // if (unidadeFederativa.rows.length) {
            //     jsonOficinaFK.ID_UNIDADE_FEDERATIVA = unidadeFederativa.rows[0].ID_UNIDADE_FEDERATIVA;
            // };  
            // jsonOficinaFK.ID_UNIDADE_FEDERATIVA = { UNIDADE_FEDERATIVA: { UF: jsonSolPecas.OFICINAS.OFICINA.UF } };
            // jsonOficinaFK.FORN_CEP = jsonSolPecas.OFICINAS.OFICINA.CEP;

            // dadosCotacao.ID_FORNEC_OFICINA = { FORNECEDOR: { jsonOficinaFK } };

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
                    };
                };
            };
        };
    };
    //jsonOficinaFK deve ser cadastrada ou atualizada

    console.log(dadosCotacao);
    //console.log(dadosItensCota);
};

//Chamada da Rotina
gravaSolicitacaoPecas();
//ProcessaSolicitacaoPecas();