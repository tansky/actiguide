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
						if (!$scope.sections[$scope.currentSection.section].loaded) {
							loadContent($scope.sections[$scope.currentSection.section], function() {
								if (typeof $scope.dynOnLoad === 'function') {
									$scope.dynOnLoad($scope.currentSection.section);
								}
							});
						} else {
							if (typeof $scope.dynOnOpen === 'function') {
								$scope.dynOnOpen($scope.currentSection.section);
							}
						}
					}
				} else {
					if (!$scope.loaded && newVal) {
						$http.get($attrs.dynLoad).success(function (response) {
							$scope.loaded = true;
							$scope.content = $sce.trustAsHtml(response);

							if (typeof $scope.dynOnLoad === 'function') {
								$scope.dynOnLoad();
							}
						});
					}

					if ($scope.loaded && newVal && typeof $scope.dynOnOpen === 'function') {
						$scope.dynOnOpen();
					}
				}
			});

			$scope.$watch('currentSection', function(newVal) {
				if ($scope.visible && newVal) {
					loadContent($scope.sections[newVal.section]);
				}

				if ($scope.visible && newVal && !$scope.sections[newVal.section].loaded && typeof $scope.dynOnLoad === 'function') {
					$scope.dynOnLoad(newVal.section);
				}

				if ($scope.visible && newVal && $scope.sections[newVal.section].loaded && typeof $scope.dynOnOpen === 'function') {
					$scope.dynOnOpen(newVal.section);
				}
			});

			function loadContent(currentSection, callback) {
				if (!currentSection.loaded) {
					$http.get(currentSection.dynLoad).success(function (response) {
						currentSection.loaded = true;
						currentSection.content = $sce.trustAsHtml(response);

						if (typeof callback === 'function') {
							callback(response);
						}
					});
				}
			}
		}
	}
});