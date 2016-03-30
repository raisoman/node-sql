var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000,
    apiRouter = require('./Routes/apiroutes')();

app.use('/api', apiRouter);

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});