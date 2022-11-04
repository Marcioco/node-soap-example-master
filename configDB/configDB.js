/*
Método para conectar com banco de dados Oracle

componentes utilizados
#express
#jsonwebtoken
#oracledb

ocid1.autonomousdatabase.oc1.sa-saopaulo-1.antxeljrcjesqmqatmlixxvqiqznjs4fmpykdkbonmv44ychbdzkcabxk4bq
*/

require("dotenv").config();
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CONSTRING = process.env.DB_CONSTRING;

const oracledb = require("oracledb");
try {

   oracledb.initOracleClient({libDir: "C:\\Aplicativos\\instantclient_21_3"});

     //oracledb.initOracleClient({libDir: "C:\\instantclient_21_6"});

  } catch (err) {
    console.error('Erro no Client!');
    console.error(err);
    process.exit(1);
  }
  
 
const dbConfig = {  
    user : DB_USER,
    password : DB_PASSWORD,
    connectString :DB_CONSTRING
   }

   module.exports = dbConfig;
   
