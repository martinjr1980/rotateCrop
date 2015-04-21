var mongoose = require('mongoose');
var config = require('./config.js');
// Require file system so that we can load up and read all of the model files that we create
var fs = require('fs');

var connect = function() {
	// Specify options for when mongoose connects to mongodb
	var options = { server: { socketOptions: { keepAive: 1 } } };
	// Connect to our mongodb database server with options specified above
	// mongoose.connect('mongodb://localhost/galleryApp', options);
	mongoose.connect(config.mongodb.uri, options);
}
connect();

mongoose.connection.on('error', function (err) {
	console.log(err);
})

// If we get disconnected from mongoose, try to connect again
mongoose.connection.on('disconnected', function() {
	connect();
})

// Specify the path to all of the models
var models_path = __dirname + '/../server/models';
// Read all of the files in that path and for each one, if the file is a js file, let's require it
fs.readdirSync(models_path).forEach(function (file) {
	if (file.indexOf('.js') !== -1) {
		require(models_path + '/' + file);
	}
})
