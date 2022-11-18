const reader = require('xlsx')
const oracledb = require("oracledb");
const dbConfig = require("./configDB/configDB");
//const moment = require("moment");
const { dataHoraBR, dataHoraBRUTC } = require("./util");



// function ExcelDateToJSDate(date) {
//     return new Date(Math.round((date - 25569)*86400*1000));
//   }

const gravaRessarcimentoPlanilha = async () => {
    // Reading our test file
    const file = reader.readFile('./excel/hdi.xlsx');
    const sheets = file.SheetNames;
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]])
    let connection = await oracledb.getConnection(dbConfig);
    //SEQ_REPL
    

    try {
      
        for (key in temp) {
           
            dataEmissaoNF = new Date(Date.UTC(0, 0, temp[key].DATA_EMISSAO_NF_DEV -1));
            await connection.execute(`Insert into RESSACIMENTO_PLANILHA
                                    (ID_RESSACIMENTO_PLANILHA,
                                    REPL_CNPJ_SEGURADORA,
                                    REPL_CNPJ_FORNECEDOR,
                                    REPL_SINISTRO,
                                    REPL_PEDIDO_COMPRA,
                                    REPL_NUMERO_NF_DEV,
                                    REPL_SERIE_NF_DEV,
                                    REPL_DATA_EMISSAO_NF_DEV,
                                    REPL_VALOR_NF_DEV,
                                    REPL_STATUS)
                                Values
                                    (SEQ_REPL.NEXTVAL,
                                    :REPL_CNPJ_SEGURADORA,
                                    :REPL_CNPJ_FORNECEDOR,
                                    :REPL_SINISTRO,
                                    :REPL_PEDIDO_COMPRA,
                                    :REPL_NUMERO_NF_DEV,
                                    :REPL_SERIE_NF_DEV,
                                    TO_DATE(:REPL_DATA_EMISSAO_NF_DEV, 'DD/MM/YYYY HH24:MI:SS'),
                                    :REPL_VALOR_NF_DEV,
                                    :REPL_STATUS)     
     `,
                [temp[key].CNPJ_SEGURADORA,
                temp[key].CNPJ_FORNECEDOR,
                temp[key].SINISTRO,
                temp[key].PEDIDO_COMPRA,
                temp[key].NUMERO_NF_DEV,
                temp[key].SERIE_NF_DEV,
                dataHoraBRUTC(dataEmissaoNF),
                temp[key].VALOR_NF_DEV,
                    'Pendente'],
                { outFormat: oracledb.OUT_FORMAT_OBJECT });
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

gravaRessarcimentoPlanilha();