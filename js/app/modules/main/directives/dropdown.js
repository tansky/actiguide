/**
 *  @ngdoc directive
 *  @name dropdown
 *  @restrict E
 *
 *  @description
 *  Директива для генерации дропдаунов (см. примеры использования в layers.html).
 */

actiGuide.mainModule.directive('dropdown', function ($window, $sce, layers) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'templates/dropdown.html',
		replace: true,
		scope: true,
		controller: function($scope, $element, $attrs) {

			$scope.visible = false;

			$scope.caller = $sce.trustAsHtml($attrs.caller);

			$scope.toggleDropdown = function() {

				if (layers.layersList.length === 0) {
					$scope.visible = true;
					layers.layersList.push($element[0]);
				} else if (layers.layersList.length > 0 && layers.isUpInTree($element[0]) && layers.layersList.indexOf($element[0]) < 0) {
					$scope.visible = true;
					layers.layersList.push($element[0]);
				} else if (layers.layersList.length > 0 && layers.layersList.indexOf($element[0]) > -1 && layers.layersList[layers.layersList.length-1] === $element[0]) {
					$scope.visible = false;
					layers.layersList.pop();
				} else if (layers.layersList.length > 0 && layers.layersList.indexOf($element[0]) > -1) {
					angular.element(layers.layersList[layers.layersList.length-1]).scope().visible = false;
					layers.layersList.pop();
				}

			};

		}
	};
});