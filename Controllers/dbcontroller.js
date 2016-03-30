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

function getData(query, callback) {
    connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err,'db err');
        } else {
            var request = new Request(query, function (err, rowCount, rows) {
                if (err) {
                    callback(err,'db err');
                } else if (rowCount === 0) {
                    callback(null,'no data');
                } else {
                    callback(null,rows);
                }
            });
            connection.execSql(request);
        }
    });
}

var dbController = function () {
    var getAll = function (req, res) {
        var query = 'SELECT top 2 * FROM batbiview;';
        var data = getData(query, function callback(err, data) {
            if (data === 'db err') {
                res.status(503).json('Database error');
            } else if (data === 'no data') {
                res.send('No data was found');
            } else {
                res.json(data);
            }
        });
    };

    var getTable = function(req, res) {
        var table = req.params.table;
        var cols = req.query.cols;
        if (cols === undefined || cols.length === 0) {
            res.send('Please specify column names');
        } else {
            var query = 'SELECT top 50000 ' + cols + ' FROM ' + table + ';';
            console.log(query);
            var data = getData(query, function callback(err, data) {
                if (err) {
                    console.log(err);
                }
                if (data === 'db err') {
                    res.status(503).json('Database error');
                } else if (data === 'no data') {
                    res.send('No data was found');
                } else {
                    res.json(data);
                }
            });
        }
    };

    return {
        getAll: getAll,
        getTable: getTable
    };
};

module.exports = dbController;
