actiGuide.mainModule.directive('dynLoad', function ($http) {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, $element) {
			$scope.dynamic = true;

			$scope.$watch('visible', function() {
				console.log('visible');
			});

			console.log('dyn load', $scope);
			console.log($element);
		}
	}
});