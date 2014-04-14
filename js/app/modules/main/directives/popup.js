/**
 *  @ngdoc directive
 *  @name popupCaller
 *  @restrict A
 *
 *  @description
 *  Директива для открытия попапов.
 */

actiGuide.mainModule.directive('popupCaller', function (layers) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
			(function(attrs) {
				element.bind('click', function() {

					var popupElement = document.getElementById(attrs.popupCaller),
						popupScope = angular.element(popupElement).scope();

					angular.element(this).data('skipOnUpdate', true);

					/* Клик по элементу, вызывающему попап не из дерева активных слоёв игнорируется, передав при этом
					 управление слушателю кликов из сервиса layers */

					if (layers.isInTree(popupElement)) {
						return;
					}

					popupScope.visible = true;
					popupScope.$apply();

					layers.layersList.push(popupElement);

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

actiGuide.mainModule.directive('popup', function (layers) {
	var ngClasses = "{'is-visible':visible}";

	return {
		restrict: 'E',
		transclude: true,
		template: '<div class="popup" ng-class="' + ngClasses + '" ng-transclude />',
		replace: true,
		scope: true,
		link: function(scope, element) {

			scope.visible = false;

			element.html('').bind('click', function(e) {
				if (angular.element(e.target).hasClass('pop-on-click')) {
					layers.popLastLayer();
				}
			});

			/* Директивы ниже наполняют скоуп попапа данными, из которых здесь формируется его контент */

			var sections = ['title', 'container'],
				collect = '';

			angular.forEach(sections, function(section) {
				if (scope[section]) {
					collect += scope[section];
				}
			});

			element.append('<div class="popup_overflow pop-on-click"></div>');
			element.append('<div class="popup_wrap"><div class="popup_inner-wrap">' + collect + '</div></div>');

		}
	}
}).directive('popupTitle', function () {
	return {
		restrict: 'E',
		link: function(scope, element) {
			var $element = angular.element(element),
				$parent = $element.parent(),
				$parentScope = $parent.scope();

			$parentScope.title = '<div class="popup_title">' + $element.html() + '</div>';
		}
	}
}).directive('popupContainer', function () {
	return {
		restrict: 'E',
		link: function(scope, element) {
			var $element = angular.element(element),
				$parent = $element.parent(),
				$parentScope = $parent.scope();

			$parentScope.container = '<div class="popup_container">' + $element.html() + '</div>';
		}
	};
});