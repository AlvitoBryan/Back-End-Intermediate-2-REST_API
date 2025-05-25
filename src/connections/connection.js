const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'be-2-intermediate-videobelajar'
});

module.exports = db;