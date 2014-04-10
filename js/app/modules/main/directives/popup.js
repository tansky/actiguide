/**
 *  @ngdoc directive
 *  @name pCaller
 *  @restrict A
 *
 *  @description
 *  Директива для открытия попапов.
 */

actiGuide.mainModule.directive('pCaller', function (layers) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
			(function(attrs) {
				element.bind('click', function() {

					/* Клик по элементу, вызывающему попап не из дерева активных слоёв игнорируется, передав при этом
					 управление слушателю кликов из сервиса layers */

					if (!layers.isElementInLayers(this) && layers.getLayersList.length > 1) {
						return;
					}

					var popupElement = angular.element(document.getElementById(attrs.pCaller)),
						popupScope = popupElement.scope();

					layers.updateLayers(this);
					popupScope.visible = true;

					if (layers.getLayersList.indexOf(this) < 0) {
						layers.getLayersList.push(this);
					}

					popupScope.$apply();

				});
			})(attrs);
		}
	}
});


/**
 *  @ngdoc directive
 *  @name popup
 *  @restrict E
 *
 *  @description
 *  Директивы для генерации попапов (см. примеры использования в layers.html).
 */

actiGuide.mainModule.directive('popup', function () {
	var ngClasses = "{'is-visible':visible}";

	return {
		restrict: 'E',
		transclude: true,
		template: '<div class="popup" ng-class="' + ngClasses + '" ng-transclude />',
		replace: true,
		scope: true,
		link: function(scope, element) {
			scope.visible = false;

			var overflowElement = element.prepend('<div class="popup_overflow" />');
			overflowElement.bind('click', function() {
				scope.visible = false;
				scope.$apply();
			});
		}
	}
}).directive('pTitle', function () {
	return {
		restrict: 'E',
		transclude: true,
		replace : true,
		scope: false,
		template: '<span class="popup_title" ng-transclude />'
	}
}).directive('pContainer', function () {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: false,
		template: '<span class="popup_container" ng-transclude />'
	};
});