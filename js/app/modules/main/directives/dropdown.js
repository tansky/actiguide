/**
 *  @ngdoc directive
 *  @name dropdown
 *  @restrict E
 *
 *  @description
 *  Директивы для генерации дропдаунов (см. пример в layers.html).
 */

actiGuide.mainModule.directive('dropdown', function ($window, $document, layers) {
	var ngClasses = "{'is-visible':active, 'reflect-hor':reflectHorizontal, 'reflect-ver':reflectVertical, 'small-wrap':smallWrap}";

	return {
		restrict: 'E',
		transclude: true,
		template: '<span class="dropdown" ng-class="' + ngClasses + '" ng-transclude></span>',
		replace: true,
		scope: true,
		link: function($scope, $element) {
			$scope.active = false;

			$element.bind('click', function() {

				/* Клик по элементу, вызывающему дропдаун не из активного дерева игнорируется, передав при этом
				управление слушателю кликов из сервиса layers */

				if (!layers.isElementInLayers(this) && layers.getLayersList.length > 1) {
					return;
				}


				/* Открытие дропдауна и добавление его к слоям */

				var element = angular.element(this),
					scope = element.scope();

				layers.updateLayers(this);

				if (!scope.active) {
					scope.active = true;
				}

				if (scope.active && layers.getLayersList.indexOf(this) < 0) {
					layers.getLayersList.push(this);
				}


				/* Проверка ширины элемента, открывающего дропдаун (смещаем стрелку ближе к краю, если ширина < 50px) */

				if (element[0].offsetWidth < 50) {
					$scope.smallWrap = true;
				}

				scope.$apply();


				/* Проверка границ выпавшего дропдауна */

				var document = angular.element($document).find('BODY')[0];

				angular.forEach(element.children(), function(element) {
					$scope.reflectHorizontal = document.clientWidth < element.getBoundingClientRect().right;
					$scope.reflectVertical = document.clientHeight < element.getBoundingClientRect().bottom;
					scope.$apply();
				});

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