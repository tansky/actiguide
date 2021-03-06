/**
 *  @ngdoc directive
 *  @name tipBox
 *  @restrict E
 *
 *  @description Директива блока. Стилевое оформление указывается с помощью классов.
 *
 *  @param {string} [closeBtn] Показываем ссылку "Скрыть", если указан параметр
 *
 */
actiGuide.mainModule.directive('tipBox', function (VIEWS_PATH) {
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
		templateUrl: VIEWS_PATH + 'tipbox.html'
	};
});
