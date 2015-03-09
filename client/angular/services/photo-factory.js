galleryApp.factory('PhotoFactory', function ($upload, $http) {
	var photos = [];
	var factory = {};

	factory.getPhotos = function (callback) {
		$http.get('/photos.json').success(function (data) {
			photos = data;
			callback(photos);
		});
	}

	factory.updatePhoto = function(name, base64, callback) {
		$upload.upload({ url: 'update', method: 'POST', data: { name: name, base64: base64 }})
			.success(function (data, status, headers, config) {
				for (var i in photos) {
					if (photos[i].name == data.name) {
						photos[i].name = data;
					}
				}
				var message = { update_success: 'Image has been saved!' };
				callback(message);
			}).error(function (data, status, headers, config) {
				var message = { update_fail: 'Could not save file!' };
			});
	}

	factory.uploadPhoto = function(file, callback) {
		$upload.upload({ url: 'upload', method: 'POST', file: file })
			.progress(function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function (data, status, headers, config) {
				photos.push(data);
				console.log(photos);
				var message = { up_success: 'Upload complete!' };
				callback(message);
			}).error(function (data, status, headers, config) {
				var message = { up_fail: 'Upload failed!' };
			});
	}

	return factory;
})