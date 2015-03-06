galleryApp.controller('PhotoController', function ($scope, $routeParams, $location, PhotoFactory) {
	//Initializations
	$scope.angle = "0";
	adjustLargeImage();
	$scope.photos = PhotoFactory.getPhotos();

	$scope.$on('$routeChangeSuccess', function() {
		$scope.id = $routeParams.id;
	});

	var x_crop, y_crop, x_crop2, ycrop2, offset_x, offset_y;

	$scope.selected = function (cords, id) {
		var crop_canvas,
			left = cords.x * scale,
			top = cords.y * scale,
			width = cords.w * scale,
			height = cords.h * scale;
		console.log(left, top, width, height);
		crop_canvas = document.createElement('canvas');
		crop_canvas.width = width;
		crop_canvas.height = height;
		var image = new Image();
		image.src = document.getElementById('crop').children[1].src;
		crop_canvas.getContext('2d').drawImage(image, left, top, width, height, 0, 0, width, height);
		window.open(crop_canvas.toDataURL('image/jpeg'));
		// var base64 = crop_canvas.toDataURL('image/jpeg');

		// $scope.crop = function() {
		// 	PhotoFactory.cropPhoto(id, base64)
		// 		.success(function (data, satus, headers, config) {
		// 			$scope.crop_success = data;
		// 		}).error(function (data, status, headers, config) {
		// 			$scope.crop_fail = data;
		// 		})
		// }
	};

	var isDragging = false;
	$("#frame")
	.mousedown(function (e) {
		console.log(e);
		x_crop = e.clientX;
		y_crop = e.clientY;
		offset_x = e.offsetX;
		offset_y = e.offsetY;
	    $(window).mousemove(function (e) {
	        isDragging = true;
	        x_crop2 = e.clientX;
	        y_crop2 = e.clientY;
	        document.getElementById("select-box").style.left = String(x_crop) + 'px';
	        document.getElementById("select-box").style.top = String(y_crop) + 'px';
	        $('#select-box').width(x_crop2-x_crop).height(y_crop2-y_crop);
	    }).mouseup(function (e) {
	    	$(window).unbind("mousemove");
	    })
	})
	.mouseup(function(e) {
	    var wasDragging = isDragging;
	    isDragging = false;
	    $(window).unbind("mousemove");
	    if (!wasDragging) { //was clicking
	        $(window).unbind("mousemove");
	        $('#select-box').width(0).height(0);
	    }
	});

	$scope.crop2 = function() {
		var image = new Image();
		image.src = document.getElementById('frame').children[0].src;
		var scale = image.width / $('#frame').width();
		var crop_canvas,
			left = offset_x * scale,
			top = offset_y * scale,
			width = (x_crop2 - x_crop) * scale,
			height = (y_crop2 - y_crop) * scale;
		crop_canvas = document.createElement('canvas');
		crop_canvas.width = width;
		crop_canvas.height = height;
		crop_canvas.getContext('2d').drawImage(image, left, top, width, height, 0, 0, width, height);
		window.open(crop_canvas.toDataURL('image/jpeg'));
	}

	$scope.save = function() {
		var image = new Image();
		image.src = document.getElementById('frame').children[0].src;
		var width = image.width;
		var height = image.height;
		var canvas = document.createElement('canvas');
		var angle = $scope.angle * Math.PI / 180;
		console.log(document.getElementById('frame').width)

		if ($scope.angle == 90 || $scope.angle == 270) {
			canvas.width = height;
			canvas.height = width;
		}
		else {
			canvas.width = width;
			canvas.height = height;
		}

		// Need to translate so you are rotating about the center of image
		canvas.getContext('2d').translate(canvas.width/2, canvas.height/2);
		canvas.getContext('2d').rotate(angle);
		canvas.getContext('2d').drawImage(image, -width/2, -height/2, width, height);
		window.open(canvas.toDataURL('image/jpeg'));
	}

	$scope.upload = function() {
		PhotoFactory.upload($scope.file)
			.progress(function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function (data, status, headers, config) {
				$scope.up_success = data;
				$location.path('/');		  
			}).error(function (data, status, headers, config) {
				$scope.up_fail = data;
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