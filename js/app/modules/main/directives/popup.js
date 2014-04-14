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

					/* Клик по элементу, вызывающему попап не из дерева активных слоёв игнорируется, передав при этом
					 управление слушателю кликов из сервиса layers */

					if (layers.layersList.length > 0 && !layers.isInTree(this)) {
						return;
					}

					scope.noScroll = true;
					popupScope.visible = true;

					if (layers.layersList.indexOf(this) < 0) {
						layers.layersList.push(this);
						angular.element(element).data('popupElement', popupElement);
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

actiGuide.mainModule.directive('popup', function ($document, layers) {
	var ngClasses = "{'is-visible':visible}";

	return {
		restrict: 'E',
		transclude: true,
		template: '<div class="popup" ng-class="' + ngClasses + '" ng-transclude />',
		replace: true,
		scope: true,
		link: function(scope, element, attrs) {

			var innerWrapStyle = '',
				innerWrapAdditionalClasses = '';

			scope.visible = false;

			element.html('').bind('click', function(e) {
				if (angular.element(e.target).hasClass('pop-on-click')) {
					angular.element($document[0].body).scope().noScroll = false;
					scope.noScroll = false;
					layers.popLastLayer();
				}
			});

			/* Директивы ниже наполняют скоуп попапа данными, из которых здесь формируется его контент */

			var sections = ['title', 'sidebar', 'container'],
				collect = '';

			if (typeof attrs.noCloseButton === 'undefined') {
				collect += '<div class="close-button pop-on-click"></div>';
			}

			if (parseInt(attrs.popupWidth, 10) > 0) {
				innerWrapStyle += 'width: ' + parseInt(attrs.popupWidth, 10) + 'px;';
			}

			if (scope.sidebar) {
				innerWrapAdditionalClasses += ' w-sidebar';
			}

			angular.forEach(sections, function(section) {
				if (scope[section]) {
					collect += scope[section];
				}
			});

			element.append('<div class="popup_overflow pop-on-click"></div>');
			element.append('<div class="popup_wrap pop-on-click"><div class="popup_inner-wrap' + innerWrapAdditionalClasses + '" style="' + innerWrapStyle + '">' + collect + '<div class="clear-fix"></div></div>');

			if (scope.activeSection) {
				console.log(scope.activeSection);
			}

		}
	}
}).directive('popupTitle', function () {
	return {
		restrict: 'E',
		link: function(scope, element) {
			var $element = angular.element(element),
				$parent = $element.parent(),
				$parentScope = $parent.scope();

			$parentScope.title = '<div class="popup_title"><h2>' + $element.html() + '</h2></div>';
		}
	}
}).directive('popupSidebar', function () {
	return {
		restrict: 'E',
		link: function(scope, element) {
			var $element = angular.element(element),
				$parent = $element.parent(),
				$parentScope = $parent.scope();

			$parentScope.sidebar = '<div class="popup_sidebar">' + $element.html() + '</div>';

			angular.forEach($element.find('li'), function(item) {
				if (!$parentScope.activeSection && angular.element(item).data('section')) {
					$parentScope.activeSection = angular.element(item).data('section');
				}
			});
		}
	}
}).directive('popupContainer', function () {
	return {
		restrict: 'E',
		link: function(scope, element, attrs) {
			var $element = angular.element(element),
				$parent = $element.parent(),
				$parentScope = $parent.scope(),
				additionalClasses = '';

			if (typeof attrs.noPadding !== 'undefined') {
				additionalClasses += ' no-padding';
			}

			$parentScope.container = '<div class="popup_container' + additionalClasses + '">' + $element.html() + '</div>';
		}
	};
});