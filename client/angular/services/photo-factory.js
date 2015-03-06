galleryApp.factory('PhotoFactory', function ($upload) {
	var photos = [
		{ id: 1, name: '1.jpg', thumb: '1_thumb.jpg', cropped: false },
		{ id: 2, name: '2.jpg', thumb: '2_thumb.jpg', cropped: false },
		{ id: 3, name: '3.jpg', thumb: '3_thumb.jpg', cropped: false },
		{ id: 4, name: '4.jpg', thumb: '4_thumb.jpg', cropped: false },
		{ id: 5, name: '5.jpg', thumb: '5_thumb.jpg', cropped: false },
		{ id: 6, name: '6.jpg', thumb: '6_thumb.jpg', cropped: false },
		{ id: 7, name: '7.jpg', thumb: '7_thumb.jpg', cropped: false },
		{ id: 8, name: '8.jpg', thumb: '8_thumb.jpg', cropped: false },
		{ id: 9, name: '9.jpg', thumb: '9_thumb.jpg', cropped: false },
		{ id: 10, name: '10.jpg', thumb: '10_thumb.jpg', cropped: false }
	];
	var id = 10;
	var factory = {};

	factory.getPhotos = function() {
		return photos;
	}

	factory.cropPhoto = function(id, base64) {
		return $upload.upload({
			url: 'crop',
			method: 'POST',
			data: { id: id, base64: base64 }
		})
	}

	factory.upload = function(file) {
		return $upload.upload({
            url: 'upload',
            method: 'POST',
            file: file
        })
	}

	return factory;
})