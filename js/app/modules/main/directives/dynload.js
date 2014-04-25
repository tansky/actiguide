actiGuide.mainModule.directive('onOpen', function () {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, $element, $attrs) {
			$scope.$watch('visible', function(isVisible) {
				if (isVisible && typeof $scope[$attrs.onOpen] === 'function') {
					$scope[$attrs.onOpen]();
				}
			});
		}
	}
});
