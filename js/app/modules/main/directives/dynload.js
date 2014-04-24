actiGuide.mainModule.directive('onOpen', function () {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, $element, $attrs) {
			$scope.$watch('visible', function(visible) {
				if (visible && typeof $scope[$attrs.onOpen] === 'function') {
					$scope[$attrs.onOpen]();
				}
			});

			$scope.$watch('currentSection', function(currentSection) {
//				console.log($element, currentSection, $attrs.onOpen);
			});
		}
	}
});
