actiGuide.mainModule.directive('dynLoad', function ($http) {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, $element) {
			$scope.dynamic = true;

			$scope.$watch('visible', function(newVal) {
				console.log('visible', newVal);
			});

			$scope.$watch('currentSection', function(newVal) {
				if (newVal) {
					console.log('currentSection', newVal.section);
				}
			});

			console.log('dyn load', $scope);
			console.log($element);
		}
	}
});