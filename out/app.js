// TODO: Глобально = грязно
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
;var mainModule = angular.module('mainModule', []);;mainModule.directive('btn', function() {
    return {
        restrict: 'C',
        replace: false,
        transclude: true,
        template: '<span class="btn-in" data-ng-transclude></span>'
    };
});
;mainModule.directive('tipBox', function() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        transclude: true,
        link: function(scope, element, attr) {
            scope.showCloseBtn = attr.closeBtn;

            scope.hideTip = function (){
                scope.hideTipBox = true;
            }
        },
        templateUrl: 'tipbox.html'
    };
});
