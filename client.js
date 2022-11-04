
var soap = require('soap');
const oracledb = require("oracledb");
const dbConfig = require("./configDB/configDB");
var url = 'http://localhost:8000/wsdl?wsdl';


const geraDadosRetornoPecas = async () => {
  //let json1 = {};
  //json1.PPECENVIADO02 = '10';
  //console.log(json1);
  let idCotacao = 304;
  let fornJSON = {}; //objeto
  let connection = await oracledb.getConnection(dbConfig);
  let selectSql = `
                      Select DISTINCT 
                            FORN.FORN_CNPJ CNPJ,
                            FORN.ID_FORNECEDOR CODIGO,
                            DECODE(FORN.FORN_TIPO_PECA,'Paralela','A','C') TIPO,
                            FORN.ID_FORNECEDOR,
                            FORN.FORN_NOME_FANTASIA APELIDO ,
                            FORN.FORN_RUA ||' '|| FORN.FORN_NUMERO || ' ' || FORN.FORN_COMPLEMENTO ENDERECO,
                            FORN.FORN_BAIRRO BAIRRO,
                            FORN.FORN_CEP CEP,
                            MUNI.MUNI_DESCRICAO CIDADE,
                            UNFE.UNFE_SIGLA UF,
                            FORN.FORN_INSCRICAO_ESTADUAL IE,
                            FORN.FORN_INSCRICAO_MUNICIPAL IM,      
                            '' REFERENCIA
                      From PEDIDO      PEDI,
                            ITEM_PEDIDO ITPD,
                            FORNECEDOR  FORN,
                            MUNICIPIOS  MUNI,
                            UNIDADE_FEDERATIVA UNFE
                      Where PEDI.ID_COTACAO    = :ID_COTACAO
                        And ITPD.ID_PEDIDO     = PEDI.ID_PEDIDO
                        And ITPD.ITPD_VENCEU   = 'Sim'
                        And FORN.ID_FORNECEDOR = PEDI.ID_FORNECEDOR
                        And MUNI.ID_MUNICIPIO  = FORN.ID_MUNICIPIO
                        And UNFE.ID_UNIDADE_FEDERATIVA = MUNI.ID_UNIDADE_FEDERATIVA  
    `;
  let fornecedores = await connection.execute(selectSql,
    [idCotacao],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  if (fornecedores.rows.length) {
    for (const key in fornecedores.rows) {
      fornJSON.CNPJ     = fornecedores.rows[key].CNPJ;
      fornJSON.CODIGO   =  fornecedores.rows[key].CODIGO;
      fornJSON.TIPO     =  fornecedores.rows[key].TIPO;
      fornJSON.APELIDO  =  fornecedores.rows[key].APELIDO;
      fornJSON.NOME     =  fornecedores.rows[key].NOME;
      fornJSON.ENDERECO =  fornecedores.rows[key].ENDERECO;
      fornJSON.BAIRRO   =  fornecedores.rows[key].BAIRRO;
      fornJSON.CEP      =  fornecedores.rows[key].CEP;
      fornJSON.CIDADE   =  fornecedores.rows[key].CIDADE;
      fornJSON.UF       =  fornecedores.rows[key].UF;



      
        console.log(fornJSON)
    }
  }
}

geraDadosRetornoPecas();
return;

// Create client
soap.createClient(url, function (err, client) {
  if (err) {
    throw err;
  }

  /* 
  * Parameters of the service call: they need to be called as specified
  * in the WSDL file
  */

  // var args = {
  //   message: "Miromar,Junior",
  //   splitter: ","
  // };

  //var args = {
  //  cpf: '12657826000530'
  //};

  var args = {};
  args.cpf = '12657826000530';

  // call the service
  client.fdadosFornecedor(args, function (err, res) {
    if (err)
      throw err;
    // print the service returned result
    console.log(res);
  });
})