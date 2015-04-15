var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var Photo = require('./../models/photo');

var aws = require('aws-sdk');
// var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
// var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
// var S3_BUCKET = process.env.S3_BUCKET;
var AWS_ACCESS_KEY = 'AKIAIFRHIWJYBJFGAZ6A';
var AWS_SECRET_KEY = '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';
var S3_BUCKET = 'fastfit';
aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });

var s3 = new aws.S3();

module.exports = (function() {
	return {
		index: function (req, res) {
			Photo.find({}, function (err, results) {
				res.json(results);
			})
		},

		create: function (req, res) {
			gm(req.files.file.path)
				.autoOrient()
				.stream(function (err, stdout, stderr) {
					var buffer = new Buffer('');
					stdout.on('data', function (data) {
						buffer = Buffer.concat([buffer, data]);
					})
					stdout.on('end', function (data) {
						s3.putObject({
							ACL: 'public-read',
						    Bucket: S3_BUCKET,
						    Key: req.files.file.originalFilename,
						    Body: buffer,
						    ContentType: 'image/png'
						}, function (err) {
							if (err) {
								res.status(400).send('Could not upload file!');
							}
							else {
								var size = { width: 200, height: 200 };
								gm(req.files.file.path)
									.autoOrient()
									.resize(size.width, size.height + "^")
									.gravity('Center')
									.extent(size.width, size.height)
									.stream(function (err, stdout, stderr) {
										var buf = new Buffer('');
										stdout.on('data', function (data) {
											buf = Buffer.concat([buf, data]);
										})
										stdout.on('end', function (data) {
											s3.putObject({
												ACL: 'public-read',
											    Bucket: S3_BUCKET,
											    Key: 'thumbs/thumb_' + req.files.file.originalFilename,
											    Body: buf,
											    ContentType: 'image/png'
											}, function (err, response) {
													if (err) {
														res.status(400).send('Could not save file!');
													}
													else {
														var photo = new Photo();
														photo.name = req.files.file.originalFilename;
														photo.created_at = new Date();
														var parser = require('exif-parser').create(buffer);
														var result = parser.parse();
														photo.height = result.imageSize.height;
														photo.width = result.imageSize.width;
														photo.save(function (err) {
															if (err) {
																res.status(400).send('Could not save file!');
															} 
															else {
																res.json(photo);
															}
														})
													}
												})
										})
										
									})

							}
						})
					})
				})
		},

		update: function (req, res) {
			// var data = JSON.parse(req.body.data).base64;
			var data = JSON.parse(req.body.data).data;
			var name = JSON.parse(req.body.data).name;
			var id = JSON.parse(req.body.data).id;
			console.log(data);

			// function decodeBase64Image(dataString) {
			// 	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
			// 	var response = {};

			// 	if (matches.length !== 3) {
			// 	return new Error('Invalid input string');
			// 	}

			// 	response.type = matches[1];
			// 	response.data = new Buffer(matches[2], 'base64');

			// 	return response;
			// }

			// var imageBuffer = decodeBase64Image(data);
			// var newPath = "./client/angular/public/images/edited/edited_" + name;
			// fs.writeFile(newPath, imageBuffer.data, function (err) {

			gm('https://s3-us-west-1.amazonaws.com/fastfit/' + name)
				.rotate('black', data.angle)
				.crop(data.crop_width, data.crop_height, data.x, data.y)
				.stream(function (err, stdout, stderr) {
					var buffer = new Buffer('');
					stdout.on('data', function (data) {
						buffer = Buffer.concat([buffer, data]);
					})
					stdout.on('end', function (data) {
						s3.putObject({
							ACL: 'public-read',
						    Bucket: S3_BUCKET,
						    Key: 'edited/edited_' + name,
						    Body: buffer,
						    ContentType: 'image/png'
						}, function (err) {
							if (err) {
								console.log('error1', err);
								res.status(400).send('Could not save file!');
							}
							else {
								Photo.findOne({ _id: id }, function (err, photo) {
									if (err) {
										console.log('error2', err);
										res.status(400).send('Could not save file!');
									}
									else {
										photo.edited = true;
										var parser = require('exif-parser').create(buffer);
										var result = parser.parse();
										photo.edit_height = result.imageSize.height;
										photo.edit_width = result.imageSize.width;
										photo.save(function (err) {
											res.json(photo);
										})
									}
								})
								
							}
						})
					})
				})
		}
	}
})();