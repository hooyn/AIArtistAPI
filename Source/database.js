const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host : '*******',
    port : 3306,
    user : 'root',
    password : '*******',
    database : '*****',
    dateStrings : 'date'
});

module.exports = {
    pool: pool
};

