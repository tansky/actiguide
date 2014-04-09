// Глобальный нэймспейс приложения
var actiGuide = {};;// TODO: Глобально = грязно
var agGridState = false;

$(document).keydown(function(e) {
	if (e && 192 === e.keyCode && e.shiftKey && e.ctrlKey) {
		if (agGridState) {
			agGridState = false;

			$('#in-guidelines').remove();
		} else {
			agGridState = true;

			$('BODY').append(
				'<div id="in-guidelines"><div id="guidelines"><div class="for-guidelines">' +
					'<div class="col-edge-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-edge-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="left-padding-grid"></div>' +
					'<div class="right-padding-grid"></div>' +
				'</div></div></div>'
			);
		}
	}
});
;actiGuide.mainModule = angular.module('mainModule', []);;actiGuide.mainModule.directive('btn', function () {
	return {
		restrict: 'C',
		replace: false,
		transclude: true,
		template: '<span class="btn-in" data-ng-transclude></span>'
	};
});
;actiGuide.mainModule.directive('dropdown', function (layers) {
	return {
		restrict: 'E',
		transclude: true,
		template: '<span class="dropdown" ng-class="{active:active}" ng-transclude></span>',
		replace: true,
		scope: true,
		link: function($scope, $element) {
			$scope.active = false;

			$element.bind('click', function() {
				var scope = angular.element(this).scope();

				if (!layers.findElementUpInTree(this) && layers.getLayersList.length > 1) {
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
});;actiGuide.mainModule.directive('navList', function () {
    return {
        restrict: 'C',
        link: function (scope, element) {
            var listItems = $('li:not(.list-title, .list-subtitle)', element);
            listItems.click(function () {
                listItems.removeClass('active');
                $(this).addClass('active');
            });

            listItems.on("mousedown", function () {
                $(this).addClass("pushed");
            }).on("mouseup mouseout", function () {
                $(this).removeClass("pushed");
            });
        }
    };
});;actiGuide.mainModule.directive('tipBox', function () {
	return {
		restrict: 'E',
		scope: true,
		replace: true,
		transclude: true,
		link: function (scope, element, attr) {
			scope.showCloseBtn = attr.closeBtn;

			scope.hideTip = function () {
				scope.hideTipBox = true;
			}
		},
		templateUrl: 'tipbox.html'
	};
});
;actiGuide.mainModule.service('layers', ['$document', function ($document) {
	var _layers = [];

	angular.element($document).bind('click', function(e) {
		updateLayers(e.target);
	});

	function updateLayers(element) {
		if (!findElementUpInTree(element) && _layers.length > 0) {
			popLastLayer();
		}
	}

	function popLastLayer() {
		var $topLayerScope = angular.element(_layers[_layers.length - 1]).scope();

		$topLayerScope.active = false;
		$topLayerScope.$apply();

		_layers.pop();
	}

	function findElementUpInTree(element) {
		if (_layers.indexOf(angular.element(element)[0]) > -1) {
			return true;
		} else if (angular.element(element).parent()[0].tagName !== 'HTML') {
			return findElementUpInTree(angular.element(element).parent());
		} else {
			return false;
		}
	}

	return {
		getLayersList: _layers,
		updateLayers: updateLayers,
		findElementUpInTree: findElementUpInTree
	}
}]);