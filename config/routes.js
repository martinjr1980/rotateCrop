var photos = require('./../server/controllers/photos.js');

module.exports = function (app) {
	app.get('/', function (req, res) {
		res.send('Welcome Home');
	})

	app.get('/photos.json', function (req, res) {
		photos.index(req, res);
	})

	app.post('/upload', function (req, res) {
		photos.create(req, res);
	})

	app.post('/update', function (req, res) {
		photos.update(req, res);
	})
}
