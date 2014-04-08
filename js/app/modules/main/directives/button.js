actiGuide.mainModule.directive('btn', function () {
	return {
		restrict: 'C',
		replace: false,
		transclude: true,
		template: '<span class="btn-in" data-ng-transclude></span>'
	};
});
