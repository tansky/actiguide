/**
 *  @ngdoc directive
 *  @name dropdown
 *  @restrict E
 *
 *  @description
 *  Директивы для генерации элементов типа дропдаун (см. пример в layers.html).
 */

actiGuide.mainModule.directive('dropdown', function (layers) {
	return {
		restrict: 'E',
		transclude: true,
		template: '<span class="dropdown" ng-class="{\'is-visible\':active}" ng-transclude></span>',
		replace: true,
		scope: true,
		link: function($scope, $element) {
			$scope.active = false;

			$element.bind('click', function() {
				var scope = angular.element(this).scope();

				if (!layers.isElementInLayers(this) && layers.getLayersList.length > 1) {
					return;
				}

				layers.updateLayers(this);

				if (!scope.active) {
					scope.active = true;
				}

				if (scope.active && layers.getLayersList.indexOf(this) < 0) {
					layers.getLayersList.push(this);
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