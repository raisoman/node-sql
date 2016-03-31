var express = require('express');
var routes = function () {
    var apiRouter = express.Router();
    var dbController = require('../Controllers/dbcontroller')();

    apiRouter.route('/')
        .get(dbController.getAll);

    //Example: http://localhost:5000/api/batbiview?cols=CsSDISCHARGE,CblSVESSEL
    //Example with where: http://localhost:5000/api/batbiview?cols=CsSDISCHARGE,CblSVESSEL&where=CsSDISCHARGE:'USSAV'&where=CBlSVESSEL:'YM OAKLAND'
    apiRouter.route('/:table')
        .get(dbController.getTable);

    return apiRouter;
};

module.exports = routes;