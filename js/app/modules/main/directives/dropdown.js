/**
 *  @ngdoc directive
 *  @name dropdown
 *  @restrict E
 *
 *  @description
 *  Директива для генерации дропдаунов (см. примеры использования в layers.html).
 */

actiGuide.mainModule.directive('dropdown', function ($window, $timeout, $sce, layers) {
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

					/* Открываем первый слой */

					$scope.visible = true;
					layers.layersList.push($element[0]);

				} else if (layers.layersList.length == 1 && !layers.isUpInTree($element[0])) {

					/* Закрываем верхний слой, если он единственный */

					angular.element(layers.layersList[0]).scope().visible = false;
					layers.layersList.pop();

					$scope.visible = true;
					layers.layersList.push($element[0]);

				} else if (layers.layersList.length > 0 && layers.isUpInTree($element[0]) && layers.layersList.indexOf($element[0]) < 0) {

					/* Открываем дропдаун, если он вызван внутри текущего дерева */

					$scope.visible = true;
					layers.layersList.push($element[0]);

				} else if (layers.layersList.length > 0 && layers.layersList.indexOf($element[0]) > -1 && layers.layersList[layers.layersList.length-1] === $element[0]) {

					/* Закрываем слой, если была попытка открыть его же снова (клик по caller'у дропдауна) */

					$scope.visible = false;
					layers.layersList.pop();

				}


				/* Проверка ширины элемента, открывающего дропдаун (смещаем стрелку ближе к краю, если ширина < 50px) */

				if ($element[0].offsetWidth < 50) {
					$scope.smallWrap = true;
				}

			};

			$scope.$watch('visible', function(isVisible) {

				/* Проверка границ выпавшего дропдауна */

				var doc = angular.element(document).find('BODY')[0];
				angular.forEach($element.children(), function(element) {
					if (angular.element(element).hasClass('dropdown_container')) {
						element.style.display = isVisible ? "block" : "none";
						$scope.reflectHorizontal = doc.clientWidth < element.getBoundingClientRect().right;
						$scope.reflectVertical = doc.clientHeight < element.getBoundingClientRect().bottom;
					}
				});

			});
		}
	};
});