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

			$element.bind('click', function() {

				/* Клик по элементу, вызывающему дропдаун не из дерева активных слоёв игнорируется, передав при этом
				управление слушателю кликов из сервиса layers */

				if (layers.layersList.length > 1 && !layers.isUpInTree(this)) {
					return;
				}


				/* Открытие дропдауна и добавление его к слоям */

				var clickedElement = angular.element(this),
					clickedElementScope = clickedElement.scope();

				layers.updateLayers(this);
				clickedElementScope.visible = true;

				if (layers.layersList.indexOf(this) < 0) {
					layers.layersList.push(this);
				}


				/* Проверка ширины элемента, открывающего дропдаун (смещаем стрелку ближе к краю, если ширина < 50px) */

				if (clickedElement[0].offsetWidth < 50) {
					$scope.smallWrap = true;
				}

				clickedElementScope.$apply();


				/* Проверка границ выпавшего дропдауна */

				var doc = angular.element(document).find('BODY')[0];

				angular.forEach(clickedElement.children(), function(element) {
					$scope.reflectHorizontal = doc.clientWidth < element.getBoundingClientRect().right;
					$scope.reflectVertical = doc.clientHeight < element.getBoundingClientRect().bottom;
					clickedElementScope.$apply();
				});

			});

		}
	};
});