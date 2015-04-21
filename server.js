var express = require('express');
var path = require('path');
var multipart = require('connect-multiparty');

var app = express();
app.use(multipart());

// Allows us to parse data through the req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());

// Allows us to use put, patch, and delete http verbs
var methodOverride = require('method-override');
app.use(methodOverride('X-HTTP-Method-Override'));

// Sets up a static file server that points to the client directory
app.use(express.static(path.join(__dirname, 'client')));

var config = require('./config/config.js');
var mongoose = require('./config/mongoose.js')
var routes = require('./config/routes.js')(app);

app.set('port', (config.web.port));

app.listen(app.get('port'), function() {
    console.log('cool stuff on: ' + app.get('port'));
});
