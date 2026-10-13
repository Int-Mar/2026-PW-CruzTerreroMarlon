const mysql = require('mysql2/promise');

/** 
 * la base de datos local se usara para verificar pruebas internas, se buscara que deben de crear
 * cada una cuenta en supabase.com
 * y generaremos uuna api para conectarnos a un servicio en bd en la nube, para ello debemos
 * configurar el archivo .env
 */

const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'n0m3l0',
    database: 'cecyt9_local',
    dateStrings: true,

});