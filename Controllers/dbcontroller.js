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

function getData(callback) {
    connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback('db err');
        } else {
            var request = new Request('SELECT top 2 * FROM batbiview;', function (err, rowCount, rows) {
                if (err) {
                    callback('db err');
                } else if (rowCount === 0) {
                    callback('no data');
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
        var data = getData(function callback(data) {
            if (data === 'db err') {
                res.status(503).json('Database error');
            } else if (data === 'no data') {
                res.send('No data was found');
            } else {
                res.json(data);
            }
        });
    };

    return {
        get: get
    };
};

module.exports = dbController;
