actiGuide.mainModule.directive('dropdown', function () {
	return {
		restrict: 'E',
		transclude: true,
		template: '<span class="dropdown" ng-class="{active:active}" ng-transclude></span>',
		replace: true,
		scope: true,
		link: function($scope, $element) {
			$scope.active = false;

			$element.bind('click', function() {
				var scope = angular.element(this).scope();

				if (!$scope.findElementUpInTree(this) && $scope._layers.length > 1) {
					return;
				}

				$scope.updateLayers(this);

				if (!scope.active) {
					scope.active = true;
				}

				if (scope.active && $scope._layers.indexOf(this) < 0) {
					$scope._layers.push(this);
				}

				scope.$apply();
			});
		}
	};
}).directive('dname', function () {
	return {
		restrict: 'E',
		transclude: true,
		replace : true,
		scope: false,
		template: '<span class="dropdown_name" ng-transclude></span>'
	}
}).directive('dblock', function () {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: false,
		template: '<span class="dropdown_block" ng-transclude></span>'
	};
});