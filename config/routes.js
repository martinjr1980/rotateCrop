var photos = require('./../server/controllers/photos.js');

module.exports = function (app) {
	app.get('/', function (req, res) {
		res.send('Welcome Home');
	})

	app.post('/upload', function (req, res) {
		photos.create(req, res);
	})

	app.post('/crop', function (req, res) {
		photos.update(req, res);
	})
}
