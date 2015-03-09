galleryApp.factory('PhotoFactory', function ($upload, $http) {
	var photos = [];
	var factory = {};

	factory.getPhotos = function (callback) {
		$http.get('/photos.json').success(function (data) {
			photos = data;
			callback(photos);
		});
	}

	factory.updatePhoto = function(photo, base64, callback) {
		$upload.upload({ url: 'update', method: 'POST', data: { id: photo._id, name: photo.name, base64: base64 }})
			.progress(function (evt) {
				$('#update').removeClass('hide');
				$('#save-status').removeClass('hide');
			}).success(function (data, status, headers, config) {
				for (var i in photos) {
					if (photos[i]._id == data._id) {
						photos[i] = data;
					}
				}
				$('#update').addClass('hide');
				$('#save-status').addClass('hide');
				// var message = { update_success: 'Image has been saved!' };
				var update = { photo: data, message: { update_success: 'Image has been saved!' } };
				callback(update);
			}).error(function (data, status, headers, config) {
				$('#update').addClass('hide');
				$('#save-status').addClass('hide');
				var message = { update_fail: 'Could not save file!' };
			});
	}

	factory.uploadPhoto = function(file, callback) {
		$upload.upload({ url: 'upload', method: 'POST', file: file })
			.progress(function (evt) {
				$('#upload').removeClass('hide');
				$('#up-status').text('Uploading...');
	            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function (data, status, headers, config) {
				photos.push(data);
				$('#upload').addClass('hide');
				$('#up-status').text('Upload New Photo');
				var message = { up_success: 'Upload complete!' };
				callback(message);
			}).error(function (data, status, headers, config) {
				$('#upload').addClass('hide');
				$('#up-status').text('Upload New Photo');
				console.log(data);
				var message = { up_fail: 'Upload failed!' };
			});
	}

	return factory;
})