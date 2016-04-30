/**
 * Created by baidu on 16/1/31.
 */
var mysql = require('mysql');

var pool = mysql.createPool({
    host: '45.32.250.247',
    user: 'root',
    password: 'caoyifeng2b',
    database: 'vs'
});

module.exports = pool;