const { json2xml } = require('xml-js');
const oracledb = require("oracledb");
const dbConfig = require("./configDB/configDB");

function adicionaZero(numero) {
    if (numero <= 9)
      return "0" + numero;
    else
      return numero;
  }
  
const dataHoraBR = (data) => {

    let dataFormatada = (adicionaZero(data.getDate().toString()) + "/" +
      (adicionaZero(data.getMonth() + 1).toString()) + "/" +
      data.getFullYear() + ' ' +
      adicionaZero(data.getHours()) + ':' +
      adicionaZero(data.getMinutes()) + ':' +
      adicionaZero(data.getSeconds()));
  
    return dataFormatada;
  }


  const dataHoraBRUTC = (data) => {

    let dataFormatada = data.getUTCDate() + "/" +
      ('0' + (data.getUTCMonth() +1) ).slice(-2) + "/" +
       data.getUTCFullYear() + ' ' +
       ('0' + data.getUTCHours()).slice(-2)  + ':' +
       ('0' + data.getUTCMinutes()).slice(-2)  + ':' +
       ('0' + data.getUTCSeconds()).slice(-2) ;
  
    return dataFormatada;
  }

  //const geraDadosRetornoPecas = async () => {
  async function geraDadosRetornoPecas(idCotacao) {
    //let json1 = {};
    //json1.PPECENVIADO02 = '10';
    //console.log(json1);
    let PPECEnviado02JSON = {};
    let destinatario = {}
    let fornecedorJSON = {};
    let itemPedidoJSON = {};
    let foneFornJSON = {};
    let fornecedoresJSON = [];
    let connection = await oracledb.getConnection(dbConfig);
  
    let selectSql = `Select Decode(OFIC.FORN_NATUREZA_JURIDICA,'Juridica', 'J', 'F') PESSOA,
                            Decode(OFIC.FORN_NATUREZA_JURIDICA,'Juridica',OFIC.FORN_CNPJ,NULL) CGC_OFICINA,
                            Decode(OFIC.FORN_NATUREZA_JURIDICA,'Juridica',NULL,OFIC.FORN_CNPJ)  CPF_OFICINA,
                            OFIC.FORN_NOME_FANTASIA APELIDO_OFICINA,
                            OFIC.FORN_RAZAO_SOCIAL FORN_RAZAO_SOCIAL_OFICINA,
                            OFIC.FORN_RUA || ' ' || OFIC.FORN_COMPLEMENTO ENDERECO_OFICINA,
                            OFIC.FORN_NUMERO NUMERO_OFICINA,
                            OFIC.FORN_BAIRRO BAIRRO_OFICINA,
                            MUNI.MUNI_DESCRICAO CIDADE_OFICINA,
                            UNFE.UNFE_SIGLA UF_OFICINA,
                            OFIC.FORN_CEP CEP_OFICINA,
                            OFIC.FORN_INSCRICAO_ESTADUAL IE_OFICINA,
                            OFIC.FORN_INSCRICAO_MUNICIPAL IM_OFICINA,
                            COTA.COTA_NUM_SINISTRO,
                            COTA.COTA_NUM_COTACAO,
                            COTA.ID_FORNEC_OFICINA,
                            SGRA.SGRA_CNPJ,
                            COTA.COTA_CNPJ_COMPRADOR,
                            COTA.COTA_CPF_PERITO,                          
                            COTA.COTA_IDPEDIDO_PEDI,
                            TO_CHAR(COTA.COTA_DT_LIBERACAO,'YYYY-MM-DD HH24:MI:SS') DATAABERTURA
                      From COTACAO COTA,
                            FORNECEDOR OFIC,
                            MUNICIPIOS MUNI,
                            UNIDADE_FEDERATIVA UNFE,
                            SEGURADORA SGRA
                      Where COTA.ID_COTACAO = :ID_COTACAO
                        And COTA.COTA_STATUS = 'Fechada'
                        And COTA.ID_ANDAMENTO_COTACAO IS NULL
                        And OFIC.ID_FORNECEDOR = COTA.ID_FORNEC_OFICINA
                        And MUNI.ID_MUNICIPIO  = OFIC.ID_MUNICIPIO
        
                        And UNFE.ID_UNIDADE_FEDERATIVA = MUNI.ID_UNIDADE_FEDERATIVA
                        And SGRA.ID_SEGURADORA = COTA.ID_SEGURADORA`;
    let dadosCotacao =  await connection.execute(selectSql, 
      [idCotacao],
      { outFormat: oracledb.OUT_FORMAT_OBJECT });
    if (dadosCotacao.rows.length) {
      //dados da Mediadora
      let chamada = {}; //Mediadora
      chamada.CNPJ = '30274547000146';// CNPJ AVVANTE, DEVE TER NO CADASTRO
      //chamada.CHAMADOR = '';
      //chamada.PERFIL = '';
      //chamada.SENHA = '';
      //chamada.SERIE = '';
      //chamada.HD = '';
      //chamada.CPF = segOficina.rows[0].COTA_CPF_PERITO;
      //chamada.PERITO = '';
  
      ///ADICIONA DADOS DA CHAMADA
      PPECEnviado02JSON.CHAMADA = chamada;
  
      //Dados da Seguradora e Oficina 
      let oficinaJSON = {};
      let foneOficJSON = {};
  
      //seguradora
      //destinatario.CNPJ = segOficina.rows[0].SGRA_CNPJ; //seguradora
      //destinatario.CPF = '';
  
      ///ADICIONA DADOS DO DESTINATARIO
      // PPECEnviado02JSON.DESTINATARIO = destinatario;
  
      oficinaJSON.PESSOA = dadosCotacao.rows[0].PESSOA; //Pessoa (F)ísica ou (J)urídica (Oficina)
      if (dadosCotacao.rows[0].CGC_OFICINA) { oficinaJSON.CGC = dadosCotacao.rows[0].CGC_OFICINA };
      if (dadosCotacao.rows[0].CPF_OFICINA) { oficinaJSON.CPF = dadosCotacao.rows[0].CPF_OFICINA };
  
      //oficinaJSON.APELIDO = dadosCotacao.rows[0].APELIDO_OFICINA;
      //oficinaJSON.NOME = dadosCotacao.rows[0].NOME_OFICINA;
      //oficinaJSON.ENDERECO = dadosCotacao.rows[0].ENDERECO_OFICINA;
      //oficinaJSON.NUMERO = dadosCotacao.rows[0].NUMERO_OFICINA;
      //oficinaJSON.BAIRRO = dadosCotacao.rows[0].BAIRRO_OFICINA;
      //oficinaJSON.CIDADE = dadosCotacao.rows[0].CIDADE_OFICINA;
      //oficinaJSON.UF = dadosCotacao.rows[0].UF_OFICINA;
      //oficinaJSON.CEP = dadosCotacao.rows[0].CEP_OFICINA;
      //if (dadosCotacao.rows[0].IE_OFICINA) { oficinaJSON.IE = dadosCotacao.rows[0].IE_OFICINA; }
      //if (dadosCotacao.rows[0].IM_OFICINA) { oficinaJSON.IE = dadosCotacao.rows[0].IM_OFICINA; }
  
      //selectSql = `Select FRCO.FRCO_NOME CONTATO,
      //                    FRCO.FRCO_EMAIL EMAIL,
      //                    FRCO.FRCO_CELULAR_DDD DDD1,
      //                    FRCO.FRCO_CELULAR_NUMERO NUMERO1,
      //                    FRCO.FRCO_FONE_COMERCIAL_DDD DDD2,
      //                    FRCO.FRCO_FONE_COMERCIAL_NUMERO NUMERO2
      //               From FORNECEDOR_CONTATO FRCO
      //              Where FRCO.ID_FORNECEDOR = :ID_FORNECEDOR
      //                And ROWNUM <= 1`;
  
      //let contatosOfic = await connection.execute(selectSql,
      //  [dadosCotacao.rows[0].ID_FORNEC_OFICINA],
      // { outFormat: oracledb.OUT_FORMAT_OBJECT });
      //if (contatosOfic.rows.length > 0) {
      //  foneOficJSON = {};
      //  foneOficJSON.DDD1 = contatosOfic.rows[0].DDD1;
      //  foneOficJSON.NUMERO1 = contatosOfic.rows[0].NUMERO1;
      //  foneOficJSON.DDD2 = contatosOfic.rows[0].DDD2;
      //  foneOficJSON.NUMERO2 = contatosOfic.rows[0].NUMERO2;
      //  oficinaJSON.TELEFONES = foneOficJSON;
      //}
  
      ////ADICIONA DADOS DA OFICINA
      PPECEnviado02JSON.OFICINAS = { OFICINA: oficinaJSON };
  
      //Dados dos Fornecedores
      selectSql = `  Select DISTINCT 
                            FORN.FORN_CNPJ CNPJ,
                            FORN.ID_FORNECEDOR CODIGO,
                            DECODE(FORN.FORN_TIPO_PECA,'Paralela','A','C') TIPO,
                            FORN.ID_FORNECEDOR,
                            FORN.FORN_RAZAO_SOCIAL,
                            FORN.FORN_NOME_FANTASIA APELIDO ,
                            FORN.FORN_RUA ||' '|| FORN.FORN_NUMERO || ' ' || FORN.FORN_COMPLEMENTO ENDERECO,
                            FORN.FORN_BAIRRO BAIRRO,
                            FORN.FORN_CEP CEP,
                            MUNI.MUNI_DESCRICAO CIDADE,
                            UNFE.UNFE_SIGLA UF,
                            FORN.FORN_INSCRICAO_ESTADUAL IE,
                            FORN.FORN_INSCRICAO_MUNICIPAL IM,      
                            '' REFERENCIA
                      From PEDIDO PEDI,
                            ITEM_PEDIDO ITPD,
                            FORNECEDOR FORN,
                            MUNICIPIOS MUNI,
                            UNIDADE_FEDERATIVA UNFE
                      Where PEDI.ID_COTACAO = :ID_COTACAO
                        And ITPD.ID_PEDIDO = PEDI.ID_PEDIDO
                        And ITPD.ITPD_VENCEU = 'Sim'
                        And FORN.ID_FORNECEDOR = PEDI.ID_FORNECEDOR
                        And MUNI.ID_MUNICIPIO = FORN.ID_MUNICIPIO
                        And UNFE.ID_UNIDADE_FEDERATIVA = MUNI.ID_UNIDADE_FEDERATIVA `;
      let fornecedores = await connection.execute(selectSql, 
        [idCotacao],
        { outFormat: oracledb.OUT_FORMAT_OBJECT });
      if (fornecedores.rows.length) {
        fornecedoresJSON = [];
        for (const key in fornecedores.rows) {
          fornecedorJSON = {};
          fornecedorJSON.CNPJ = fornecedores.rows[key].CNPJ;
          //fornecedorJSON.CODIGO = fornecedores.rows[key].CODIGO;
          fornecedorJSON.TIPO = fornecedores.rows[key].TIPO;
          //fornecedorJSON.APELIDO = fornecedores.rows[key].APELIDO;
          fornecedorJSON.NOME = fornecedores.rows[key].FORN_RAZAO_SOCIAL;
          //fornecedorJSON.ENDERECO = fornecedores.rows[key].ENDERECO;
          //fornecedorJSON.BAIRRO = fornecedores.rows[key].BAIRRO;
          //fornecedorJSON.CEP = fornecedores.rows[key].CEP;
          //fornecedorJSON.CIDADE = fornecedores.rows[key].CIDADE;
          //fornecedorJSON.UF = fornecedores.rows[key].UF;
          //if (fornecedores.rows[key].IE) { fornecedorJSON.IE = fornecedores.rows[key].IE; }
          //if (fornecedores.rows[key].IM) { fornecedorJSON.IE = fornecedores.rows[key].IM; }
          //selectSql = `Select FRCO.FRCO_NOME CONTATO,
          //                    FRCO.FRCO_EMAIL EMAIL,
          //                    FRCO.FRCO_CELULAR_DDD DDD1,
          //                    FRCO.FRCO_CELULAR_NUMERO NUMERO1,
          //                    FRCO.FRCO_FONE_COMERCIAL_DDD DDD2,
          //                    FRCO.FRCO_FONE_COMERCIAL_NUMERO NUMERO2
          //              From FORNECEDOR_CONTATO FRCO
          //              Where FRCO.ID_FORNECEDOR = :ID_FORNECEDOR
          //                And ROWNUM <= 1`;
          //let contatosForn = await connection.execute(selectSql,
          // [fornecedores.rows[key].ID_FORNECEDOR],
          // { outFormat: oracledb.OUT_FORMAT_OBJECT });
          //if (contatosForn.rows.length > 0) {
          //fornecedorJSON.CONTATO = contatosForn.rows[0].CONTATO;
          //if (contatosForn.rows[0].EMAIL) { fornecedorJSON.EMAIL = contatosForn.rows[0].EMAIL; }
          //foneFornJSON = {};
          //foneFornJSON.DDD1 = contatosForn.rows[0].DDD1;
          //foneFornJSON.NUMERO1 = contatosForn.rows[0].NUMERO1;
          //foneFornJSON.DDD2 = contatosForn.rows[0].DDD2;
          //foneFornJSON.NUMERO2 = contatosForn.rows[0].NUMERO2;
          //fornecedorJSON.TELEFONES = foneFornJSON;
          //};
          fornecedoresJSON.push(fornecedorJSON);
        }
      }
      ////ADICIONA DADOS DA FORNECEDORES (ARRAY)
      PPECEnviado02JSON.FORNECEDORES = { FORNECEDOR: fornecedoresJSON };
  
      // Dados do Pedido
      let tagPedido = {};
      let pedidoJson = {};
      let orcamentoJson = {};
      let CGCsJson = {};
  
      tagPedido.IDPEDIDO = dadosCotacao.rows[0].COTA_IDPEDIDO_PEDI;
      //tagPedido.NUMERO = dadosCotacao.rows[0].NUMERO_PEDIDO;
      //tagPedido.DATAABERTURA = dadosCotacao.rows[0].DATAABERTURA;
  
  
  
      //Dados da Cotação
      orcamentoJson.NUMERO = dadosCotacao.rows[0].COTA_NUM_COTACAO;
      orcamentoJson.SINISTRO = dadosCotacao.rows[0].COTA_NUM_SINISTRO;
      tagPedido.ORCAMENTO = orcamentoJson;
  
      if (dadosCotacao.rows[0].CGC_OFICINA) { CGCsJson.OFICINA = dadosCotacao.rows[0].CGC_OFICINA };
      if (dadosCotacao.rows[0].CPF_OFICINA) { CGCsJson.OFICINA = dadosCotacao.rows[0].CPF_OFICINA };
  
      CGCsJson.SEGURADORA = dadosCotacao.rows[0].SGRA_CNPJ;
      tagPedido.CGCS = CGCsJson;
  
      selectSql = `
                    Select FORN.FORN_CNPJ,
                      ITPD.ITPD_PART_NUMBER,
                      ITPD.ITPD_DESCRICAO,
                      ITPD.ITPD_QUANTIDADE,
                      ITPD.ITPD_PRECO_BRUTO_SEGURADORA,
                      ITPD.ITPD_PRECO_LIQUIDO_FORNECEDOR,
                      STIT.STIT_CODIGO,
                      ITPD.ITPD_PRAZO_ENTREGA,
                      TO_CHAR(ITPD.ITPD_DATA_ENTREGA,'YYYY-MM-DD HH24:MI:SS') ITPD_DATA_ENTREGA,
                      ITPD.ITPD_NOME_RECEBEU
                  From ITEM_PEDIDO ITPD,
                      PEDIDO PEDI,
                      FORNECEDOR FORN,
                      ITEM_COTACAO ITCO,
                      STATUS_ITEM STIT
                Where PEDI.ID_COTACAO = :ID_COTACAO
                  And ITPD.ID_PEDIDO = PEDI.ID_PEDIDO
                  And ITPD.ITPD_VENCEU = 'Sim'
                  And NVL(ITPD.ITPD_CANCELADO,'Nao') = 'Nao'
                  And FORN.ID_FORNECEDOR = PEDI.ID_FORNECEDOR
                  And ITCO.ID_COTACAO    = PEDI.ID_COTACAO
                  AND ITCO.ID_ITEM_COTACAO = ITPD.ID_ITEM_COTACAO
                  And STIT.ID_STATUS_ITEM = ITCO.ID_STATUS_ITEM
      `;
  
  
      let itensPedido = await connection.execute(selectSql, 
        [idCotacao],
        { outFormat: oracledb.OUT_FORMAT_OBJECT });
      if (itensPedido.rows.length > 0) {
        let itensPedidoJSON = []
        for (const key in itensPedido.rows) {
          itemPedidoJSON = {};
          itemPedidoJSON.CNPJFOR = itensPedido.rows[key].FORN_CNPJ;
          itemPedidoJSON.CODIGO = itensPedido.rows[key].ITPD_PART_NUMBER;
          itemPedidoJSON.DESCRICAO = itensPedido.rows[key].ITPD_DESCRICAO;
          itemPedidoJSON.QTDE = itensPedido.rows[key].ITPD_QUANTIDADE;
          itemPedidoJSON.PRECO_CON = itensPedido.rows[key].ITPD_PRECO_BRUTO_SEGURADORA;
          itemPedidoJSON.PRECO_ALT = itensPedido.rows[key].ITPD_PRECO_LIQUIDO_FORNECEDOR;
          itemPedidoJSON.STATUSITEMPEDIDO = itensPedido.rows[key].STIT_CODIGO;
          itemPedidoJSON.PRAZO_ENTREGA = itensPedido.rows[key].ITPD_PRAZO_ENTREGA;
          if (itensPedido.rows[key].STIT_CODIGO === 12) {
  
            itemPedidoJSON.DATA_ENTREGA = itensPedido.rows[key].ITPD_DATA_ENTREGA;
            itemPedidoJSON.RECEBIDO_POR = itensPedido.rows[key].ITPD_NOME_RECEBEU;
          };
          itensPedidoJSON.push(itemPedidoJSON);
        }
        tagPedido.ITENSPEDIDO = { ITEMPEDIDO: itensPedidoJSON };
      }
  
      //ADICIONA DADOS DO PEDIDO (ARRAY)
      PPECEnviado02JSON.PEDIDOS = { PEDIDO: tagPedido };
  
      ///ADICIONA TAGS PRINCIPAIS NO INICIO DO JSON
      let ReceberPedidoRequest = {};
      ReceberPedidoRequest = { ReceberPedidoRequest: { PPECENVIADO02: PPECEnviado02JSON } }
  
      const json = JSON.stringify(ReceberPedidoRequest);
  
      return json2xml(json, { compact: true, spaces: 4 });
    }
  }


  module.exports = {dataHoraBR, dataHoraBRUTC, geraDadosRetornoPecas};