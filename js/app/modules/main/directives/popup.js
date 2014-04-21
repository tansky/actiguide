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
			angular.element(element).data('popupCaller', true);

			(function(attrs) {
				element.bind('click', function() {

					var popupElement = document.getElementById(attrs.popupCaller),
						popupScope = angular.element(popupElement).scope();

					/* Клик по элементу, вызывающему попап не из дерева активных слоёв игнорируется, передав при этом
					 управление слушателю кликов из сервиса layers */

					if (layers.layersList.length > 0 && !layers.isDownInTree(this)) {
						return;
					}

					scope.noScroll = true;

					popupScope.visible = true;

					layers.layersList.push(popupElement);
					angular.element(element).data('targetPopup', popupElement);

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
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'templates/popup.html',
		replace: true,
		scope: true,
		controller: function($scope, $element, $attrs) {

			$scope.visible = false;

			/* Включаем параметры из popup-config в scope */

			if ($attrs.popupConfig) {
				var conf = JSON.parse($attrs.popupConfig);
				for (var i in conf) {
					if (conf.hasOwnProperty(i)) {
						$scope[i] = conf[i];
					}
				}
			}

			if ($scope.menu && !$scope.currentSection) {
				$scope.currentSection = $scope.menu[0];
			}

			$scope.setSection = function() {
				if (this.item.type !== 'divider') {
					$scope.currentSection = this.item;
				}
			};

		}
	}
}).directive('popupSection', function ($sce) {
	return {
		restrict: 'E',
		controller: function($scope, $element, $attrs) {
			var $parent = angular.element($element).parent(),
				$parentScope = $parent.scope();

			if (!$parentScope.sections) {
				$parentScope.sections = {};
			}

			if (!$parentScope.sections[$attrs.target]) {
				$parentScope.sections[$attrs.target] = {}
			}

			$parentScope.sections[$attrs.target].content = $sce.trustAsHtml($element.html());

			var portAttrs = ['dynLoad', 'dynOnLoad', 'dynOnOpen'];
			for (var i in portAttrs) {
				if (portAttrs.hasOwnProperty(i) && $attrs[portAttrs[i]]) {
					$parentScope.sections[$attrs.target][portAttrs[i]] = $attrs[portAttrs[i]];
				}
			}
		}
	}
});