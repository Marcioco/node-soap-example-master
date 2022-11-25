// const fs =  require('fs');
const fse = require('fs-extra');
const { gravaDadosPlanilha, dataHoraBRSemFormatar } = require('./util')
const oracledb = require("oracledb");
const dbConfig = require("./configDB/configDB");
//const moment = require("moment");
//const { dataHoraBR, dataHoraBRUTC } = require("./util");

// function ExcelDateToJSDate(date) {
//     return new Date(Math.round((date - 25569)*86400*1000));
//   }

const buscaPlanilhasRessarcimento = async () => {
    let dataArquivo;
    let src = '';
    let dest = '';
    let i = 0;
    let kf = 0;
    let pasta = './planilhas/ressarcimento/';
    const filenames = fse.readdirSync(pasta + 'pendentes');
    if (filenames.length) {

        let connection = await oracledb.getConnection(dbConfig);
        try {
            for (kf in filenames) {
                try {
                    src = pasta + 'pendentes/' + filenames[kf];

                    await gravaDadosPlanilha(connection, src);
                    dataArquivo = new Date();
                    dest = pasta + 'processados/' + dataHoraBRSemFormatar(dataArquivo) + '_' + filenames[kf];
                    

                    fse.move(src, dest, (err) => {
                        if (err)
                            throw 'Erro ao mover a planilha:' + filenames[kf] + ' para: ' + pasta + 'processados, erro: ' + err.message;
                    });

                    // await fse.move(src, dest, { overwrite: true })
                    //     .then(() => console.log(src,dest, "File moved to the destination" +
                    //         " folder successfully"))
                    //     .catch((e) => console.log(e));

                    connection.commit();                    
                }
                catch (error) {
                    connection.rollback();
                    console.error(error);
                };
            };
        }
        finally {
            if (connection) {
                try {                    
                    await connection.close();
                } catch (error) {
                    console.error(error);
                };
            };
        };


  
    };
};

module.exports = { buscaPlanilhasRessarcimento };