var Connection = require('tedious').Connection;
var config = {
    userName: '...',
    password: '...',
    server: '',
    options: {
        port: '',
        encrypt: true,
        database: '',
        requestTimeout: 300000,
        rowCollectionOnRequestCompletion: true,
        useColumnNames: true
    }
};

var connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

function getData(query, callback) {
    connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err, 'db err');
        } else {
            var request = new Request(query, function (err, rowCount, rows) {
                if (err) {
                    callback(err, 'db err');
                } else if (rowCount === 0) {
                    callback(null, 'no data');
                } else {
                    callback(null, rows);
                }
            });
            connection.execSql(request);
        }
    });
}

var buildQuery = function (table, cols, where) {
    var whereClause = '';
    if (where !== undefined) {
        var whereLength = where.length;
        if (whereLength !== 0) {
            whereClause = ' WHERE ';
            for (var i = 0; where.length > i; i++) {
                var converted = where[i].replace(':', '=');
                if (i === whereLength - 1) {
                    whereClause += ' AND ' + converted;
                } else if (i === whereLength - 2) {
                    whereClause += converted;
                } else {
                    whereClause += converted + ', ';
                }
            }
        }
    }
    var query = 'SELECT top 50000 ' + cols + ' FROM ' + table + whereClause + ';';
    return query;
};

var dbController = function () {
    var getAll = function (req, res) {
        var query = 'SELECT top 1 * FROM batbiview;';
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

    var getTable = function (req, res) {
        var table = req.params.table;
        var cols = req.query.cols;
        var where = req.query.where;
        if (cols === undefined || cols.length === 0) {
            res.send('Please specify column names');
        } else {
            var query = buildQuery(table, cols, where);
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