galleryApp.controller('PhotoController', function ($scope, $routeParams, $location, PhotoFactory, $window, $route) {
	//Initializations
	var x_crop, y_crop, x_crop2, y_crop2, offset_x, offset_y, frame_top, frame_bot, frame_left, frame_right;	
	$scope.angle = "0";
	PhotoFactory.getPhotos(function (output) {
		$scope.photos = output;
	})

	$scope.$on('$routeChangeSuccess', function() {
		$scope.name = $routeParams.name;
	});

	if (localStorage.current_photo !== JSON.stringify({}) && localStorage.current_photo) {
		$scope.current_photo = JSON.parse(localStorage.current_photo);
		adjustLargeImage();
	}

	$scope.openPhoto = function (name) {
		for (var i in $scope.photos) {
			if ($scope.photos[i].name == name) {
				localStorage.current_photo = JSON.stringify($scope.photos[i]);
				adjustLargeImage();
			}
		}
	}

	// Event handler for creating crop window
	$("#full")
	.mousedown(function (e) {
		x_crop = e.clientX;
		y_crop = e.clientY;
		offset_x = x_crop - 200;
		offset_y = y_crop - 45;
		frame_left = e.clientX - offset_x;
		frame_top = e.clientY - offset_y;
		frame_right = frame_left + e.currentTarget.offsetWidth;
		frame_bot = frame_top + e.currentTarget.offsetHeight;
	    $(window).mousemove(function (e) {
	    	$('#select-box').removeClass('hide');
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
		$('#select-box').addClass('hide');
	});

	// Even handler for moving crop window
	$('#select-box')
	.mousedown(function (e) {
		var box = document.getElementById('select-box');
		var box_width = parseInt(box.style.width);
		var box_height = parseInt(box.style.height);
		var start_x = e.clientX;
		var start_y = e.clientY;
		var start_left = start_x - e.offsetX;
		var start_top = start_y - e.offsetY;
		$(window).mousemove(function (e) {
			var box_left = parseInt(box.style.left);
			var box_right = box_left + box_width;
			var box_top = parseInt(box.style.top);
			var box_bot = box_top + box_height;

			var delta_x = e.clientX - start_x;
		    var delta_y = e.clientY - start_y;

			if (box_left <= frame_left) {
				if (e.originalEvent.movementX > 0) {
					start_x = e.clientX;
					if (start_x <= box_left) {
						start_left = start_x + (frame_left - e.offsetX);
					}
					else {
						start_left = start_x - e.offsetX;
					}
					delta_x = frame_left - start_left + 1;
				}
				else {
					delta_x = frame_left - start_left;
				}
			}
			else if (box_right >= frame_right) {
				if (e.originalEvent.movementX < 0) {	
					start_x = e.clientX;
					if (start_x >= box_right) {
						start_left = start_x + (frame_right - e.offsetX) - box_width;
					}
					else {
						start_left = start_x - e.offsetX;
					}
					delta_x = frame_right - (start_left + box_width) - 1;
				}
				else {
					delta_x = frame_right - (start_left + box_width);
				}
			}
			if (box_top <= frame_top) {
				if (e.originalEvent.movementY > 0) {
					start_y = e.clientY;
					if (start_y <= box_top) {
						start_top = start_y + (frame_top - e.offsetY);
					}
					else {
						start_top = start_y - e.offsetY;
					}
					delta_y = frame_top - start_top + 1;
				}
				else {
					delta_y = frame_top - start_top;
				}
			}
			else if (box_bot >= frame_bot) {
				if (e.originalEvent.movementY < 0) {
					start_y = e.clientY;
					if (start_y >= box_bot) {
						start_top = start_y + (frame_bot - e.offsetY) - box_height;
					}
					else {
						start_top = start_y - e.offsetY;
					}
					delta_y = frame_bot - (start_top + box_height) - 1;
				}
				else {
					delta_y = frame_bot - (start_top + box_height);
				}
			}
		    document.getElementById("select-box").style.left = String(start_left + delta_x) + 'px';
		    document.getElementById("select-box").style.top = String(start_top + delta_y) + 'px';

		    offset_x = box_left - frame_left;
		    offset_y = box_top - frame_top;
		}).mouseup(function (e) {
			$(window).unbind("mousemove");
		})
	})

	$scope.save = function(photo) {
		if (y_crop2 === undefined || x_crop2 === undefined) {
			$scope.message = { update_fail: 'Please define crop area first' };
			return;
		}

		var image = new Image();
		// image.crossOrigin = 'anonymous';
		image.src = document.getElementById('full').src;

		var scale = image.width / $('#full').width();
		var	left = offset_x * scale,
			top = offset_y * scale,
			crop_width = (x_crop2 - x_crop) * scale,
			crop_height = (y_crop2 - y_crop) * scale;

		var width = image.width;
		var height = image.height;
		
		var angle = $scope.angle * Math.PI / 180;
		var canvas = document.createElement('canvas');
		
		canvas.width = image.width;
		canvas.height = image.height;

		var data = { angle: $scope.angle, x: left, y: top, width: crop_width, height: crop_height };

		// Need to translate so you are rotating about the center of image
		// canvas.getContext('2d').save();
		// canvas.getContext('2d').translate(canvas.width/2, canvas.height/2);
		// canvas.getContext('2d').rotate(angle);
		// canvas.getContext('2d').translate(-canvas.width/2, -canvas.height/2);
		// canvas.getContext('2d').drawImage(image, 0, 0, width, height, 0, 0, width, height);

		// Restore from saved state so you can use originla X, Y coords
		// canvas.getContext('2d').restore();
		// image.src = canvas.toDataURL('image/jpeg');
		// console.log(image);
		// canvas.width = crop_width;
		// canvas.height = crop_height;
		// canvas.getContext('2d').translate(-left, -top);
		// canvas.getContext('2d').drawImage(image, 0, 0, width, height, 0, 0, width, height);
		// var base64 = canvas.toDataURL('image/jpeg');
		
		$scope.message = {};
		// PhotoFactory.updatePhoto(photo, base64, function (output) {
		// 	$scope.message = output.message;
		// 	localStorage.current_photo = JSON.stringify(output.photo);
		// })

		PhotoFactory.updatePhoto(photo, data, function (output) {
			$window.location.reload();
			// $scope.message = output.message;
			localStorage.current_photo = JSON.stringify(output.photo);
		})
	}

	$scope.uploadPhoto = function() {
		$scope.message = {};
		PhotoFactory.uploadPhoto($scope.file, function (output) {
			$location.path('/');
			$scope.message = output;
		})

	}

	// Temporary way to adjust large image size - need to improve
	function adjustLargeImage() {
		var win_width = $(window).width() - $('#side-bar').width();
		var win_height = $(window).height() - $('#header').height();
		var img = JSON.parse(localStorage.current_photo);
		var height = img.height;
		var width = img.width;

		if ( win_width / width > win_height / height ) {
			var ratio = win_height / height;
		} else {
			var ratio = win_width / width;
		}
		console.log(ratio);
		width = width * ratio * 0.9;
		height = height * ratio * 0.9;

		// $('#frame').css({ width: width, height: height });
		$('#full').css({ width: width, height: height });

		if (img.edited === true) {
			if (win_width / img.edit_width > win_height / img.edit_height) {
				ratio = win_height / img.edit_height;
			} else {
				ratio = win_width / img.edit_width;
			}
			
			var edit_height = img.edit_height * ratio * 0.9;
			var edit_width = img.edit_width * ratio * 0.9;

			$('#edited-photo').css({ width: edit_width, height: edit_height });
		}
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