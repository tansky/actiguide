actiGuide.mainModule.directive('dynLoad', function ($http, $sce) {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, $element, $attrs) {
			$scope.dynamic = true;
			$scope.loaded = false;

			$scope.$watch('visible', function(newVal) {
				if ($scope.currentSection) {
					if (newVal) {
						loadContent($scope.sections[$scope.currentSection.section]);
					}
				} else {
					if (!$scope.loaded && newVal) {
						$http.get($attrs.dynLoad).success(function (response) {
							$scope.loaded = true;
							$scope.content = $sce.trustAsHtml(response);
						});
					}
				}
			});

			$scope.$watch('currentSection', function(newVal) {
				if ($scope.visible && newVal) {
					loadContent($scope.sections[newVal.section]);
				}
			});

			function loadContent(currentSection) {
				if (!currentSection.loaded) {
					$http.get(currentSection.dynLoad).success(function (response) {
						currentSection.loaded = true;
						currentSection.content = $sce.trustAsHtml(response);
					});
				}
			}
		}
	}
});