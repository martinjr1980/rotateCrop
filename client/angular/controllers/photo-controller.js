galleryApp.controller('PhotoController', function ($scope, $routeParams, $location, PhotoFactory) {
	//Initializations
	$scope.angle = "0";
	adjustLargeImage();
	$scope.photos = PhotoFactory.getPhotos();

	$scope.$on('$routeChangeSuccess', function() {
		$scope.id = $routeParams.id;
	});

	$scope.selected = function (cords, id) {
		var crop_canvas,
			left = cords.x * scale,
			top = cords.y * scale,
			width = cords.w * scale,
			height = cords.h * scale;
		crop_canvas = document.createElement('canvas');
		crop_canvas.width = width;
		crop_canvas.height = height;
		var image = new Image();
		image.src = document.getElementById('crop').children[1].src;
		crop_canvas.getContext('2d').drawImage(image, left, top, width, height, 0, 0, width, height);
		// window.open(crop_canvas.toDataURL('image/jpeg'));
		var base64 = crop_canvas.toDataURL('image/jpeg');

		$scope.crop = function() {
			PhotoFactory.cropPhoto(id, base64)
				.success(function (data, satus, headers, config) {
					$scope.crop_success = 'Cropped image has been saved!'
				});
		}
	};

	$scope.upload = function() {
		PhotoFactory.upload($scope.file)
			.progress(function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function (data, status, headers, config) {
				$scope.up_success = 'UPLOAD COMPLETE!'
				$location.path('/');			  
			});
	}

	// Temporary way to adjust large image size - need to improve
	function adjustLargeImage() {
		var width = $(window).width()-400;
		var height = (1360 / 2048) * ($(window).width()-400);
		$('#frame').css({ width: width, height: height });
		$('#full').css({ width: width, height: height });
	}

	// Options for rotate directive
	$scope.options = {       
		from: 0,
		to: 360,
		step: 1,
		realtime: true,
		css: {
		    background: {"background-color": "gray"},
		    after: {"background-color": "green"},
		    pointer: {"background-color": "red"}           
	    }        
	};
})