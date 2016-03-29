var express = require('express');
var routes = function () {
    var apiRouter = express.Router();
    var dbController = require('../Controllers/dbcontroller')();
    console.log('routes here');

    apiRouter.route('/')
        .get(dbController.get);

    return apiRouter;
};

module.exports = routes;