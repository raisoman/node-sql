var Connection = require('tedious').Connection;
var config = {
    userName: 'yourusername',
    password: 'yourpassword',
    server: 'yourserver.database.windows.net',
    // When you connect to Azure SQL Database, you need these next options.
    options: {
        encrypt: true,
        database: 'AdventureWorks'
    }
};

var connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

function connect(callback) {
    connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            console.log('error ' + err);
            return 'failed connection';
        } else {
            console.log('Connected');
            var request = new Request('SELECT top 2 LOTDMEASUREMENT, CsHETD FROM batbiview;', function (err, rowCount, rows) {
                if (err) {
                    callback('no data could be fetcced');
                } else {
                    callback(rows);
                }
            });
            connection.execSql(request);
        }
    });
}

var dbController = function () {
    var get = function (req, res) {
        var rows = connect(function callback(rows) {
                res.json(rows);
            });
    };

    return {
        get: get
    };
};

module.exports = dbController;