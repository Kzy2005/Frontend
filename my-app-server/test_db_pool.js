var mysql = require('mysql');
var connection = mysql.createPool({
    connectionLimit : 10 ,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'my-product'
});

pool.query(
    'SELECT * FROM users WHERE first_name = ?', ['Peter'], 
    function (error, results, fields) {
    if (error) throw error;

    console.log(results);
});