actiGuide.mainModule.directive('actiguideDropdown', function () {
	return {
		restrict: 'E',
		transclude: true,
		template: '<span class="dropdown" ng-transclude ng-class="{active:active}"></span>',
		replace: true,
		controller: function($scope, $element) {
			$scope.$watch('$element.active', function(newVal) {
				console.log('sv', newVal);
			});

			$element.bind('click', function() {
				var scope = angular.element(this).scope();
				scope.active = true;
				console.log(scope);
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
		scope: false,
		replace: true,
		template: '<span class="dropdown_block" ng-transclude></span>'
	};
});