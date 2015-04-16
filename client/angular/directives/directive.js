galleryApp.directive('rotate', function() {
    return {
        link: function(scope, element, attrs) {
            // watch the degrees attribute, and update the UI when it changes
            scope.$watch(attrs.degrees, function(rotateDegrees) {
                //transform the css to rotate based on the new rotateDegrees
                element.css({
                    '-moz-transform': 'rotate(' + rotateDegrees + 'deg)',
                    '-webkit-transform': 'rotate(' + rotateDegrees + 'deg)',
                    '-o-transform': 'rotate(' + rotateDegrees + 'deg)',
                    '-ms-transform': 'rotate(' + rotateDegrees + 'deg)'
                });
            });
        }
    }
});

galleryApp.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                element.removeClass('hide');
                element[0].parentElement.previousElementSibling.style.display='none';
            });
        }
    };
});

// galleryApp.directive('imgCropped', function() {
//     return {
//         restrict: 'E',
//         replace: true,
//         scope: { src: '@', selected: '&', info: '=' },
//         link: function (scope, element, attr) {
//             var myImg;
//             var clear = function () {
//                 if (myImg) {
//                     myImg.next().remove();
//                     myImg.remove();
//                     myImg = undefined;
//                 }
//             };
 
//             scope.$watch('src', function (nv) {
//                 clear();
//                 if (nv) {
//                     element.after('<img />');
//                     myImg = element.next();
//                     nv += String(scope.info) + '.jpg'
//                     myImg.attr('src', nv);
//                     $(myImg).Jcrop({
//                         trackDocument: true,
//                         onSelect: function (x) {
//                             scope.$apply(function () {
//                                 scope.selected({ cords: x });
//                             });
//                         }
//                     }, function () {
//                         // Use the API to get the real image size 
//                         var bounds = this.getBounds();
//                         var scales = this.getScaleFactor();
//                         boundx = bounds[0];
//                         boundy = bounds[1];
//                         scale = scales[0];
//                     });
//                 }
//             });
//             scope.$on('$destroy', clear);
//         }
//     };
// });