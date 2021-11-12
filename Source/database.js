const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host : '13.209.4.65',
    port : 3306,
    user : 'root',
    password : 'owner9809~',
    database : 'epoch',
    dateStrings : 'date'
});

module.exports = {
    pool: pool
};

