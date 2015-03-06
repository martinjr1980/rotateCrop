var fs = require('fs');

module.exports = (function() {
	return {
		create: function (req, res) {
			fs.readFile(req.files.file.path, function (err, data) {
				var newPath = "/Users/Jeremy/Desktop/Coding_Dojo/500_myProjects/FastFit360/client/angular/public/images/" + req.files.file.originalFilename;
				fs.writeFile(newPath, data, function (err) {
					res.send('Upload Complete');
				})
			})
		},

		update: function (req, res) {
			var data = JSON.parse(req.body.data).base64;
			var id = JSON.parse(req.body.data).id;

			function decodeBase64Image(dataString) {
				var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
				var response = {};

				if (matches.length !== 3) {
				return new Error('Invalid input string');
				}

				response.type = matches[1];
				response.data = new Buffer(matches[2], 'base64');

				return response;
			}

			var imageBuffer = decodeBase64Image(data);
			var newPath = "/Users/Jeremy/Desktop/Coding_Dojo/500_myProjects/FastFit360/client/angular/public/images/cropped/" + id + '_cropped.jpg';
			fs.writeFile(newPath, imageBuffer.data, function (err) {
				res.send('Cropped Image Saved');
			})
		}
	}
})();