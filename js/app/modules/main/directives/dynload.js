actiGuide.mainModule.directive('dynLoad', function ($http, $sce, $timeout, $parse, $interpolate, $compile) {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, $element, $attrs) {

			if ($element[0].tagName.toLowerCase() === 'popup-section') {

				/* Загрузка контента в секции с динамическим содержимым попапов с меню */

				var $popupScope = $element.parent().scope();

				if (!$popupScope._dynLoadInited) {
					$popupScope._dynLoadInited = true;

					$popupScope.$watch('visible', function(visible) {
						if (visible) {
							touchSection();
						}
					});

					$popupScope.$watch('currentSection', function() {
						if ($popupScope.visible) {
							touchSection();
						}
					});

					function touchSection() {
						var currentSection = $popupScope.sections[$popupScope.currentSection.section];
						if (currentSection.dynLoad) {
							$popupScope.dynamic = true;

							if (!currentSection.loaded) {
								$http.get(currentSection.dynLoad).success(function (response) {
									currentSection.loaded = true;
									currentSection.content = $sce.trustAsHtml(response);

									if (typeof $scope[currentSection.dynOnLoad] === 'function') {
										$scope[currentSection.dynOnLoad]({
											response: response,
											section: $popupScope.currentSection.section
										});
									}
								});
							} else if (typeof $scope[currentSection.dynOnOpen] === 'function') {
								$scope[currentSection.dynOnOpen]({
									section: $popupScope.currentSection.section
								});
							}
						} else {
							$popupScope.dynamic = false;
						}
					}
				}

			} else if ($element.hasClass('popup') || $element.hasClass('dropdown')) {

				/* Загрузка динамического содержимого в попапы без меню и дропдауны */

				$scope.dynamic = true;

				$scope.$watch('visible', function(visible) {
					if (visible) {
						if (!$scope.loaded) {
							$http.get($attrs.dynLoad).success(function (response) {
								$scope.loaded = true;

								$scope.content = $sce.trustAsHtml(response);

								$compile(response)($scope, function(res) {
									$timeout(function() {
										$scope.content = $sce.trustAsHtml(res.html());
									});
								});

								if (typeof $scope[$attrs.dynOnLoad] === 'function') {
									$scope[$attrs.dynOnLoad]({
										response: response
									});
								}
							});
						} else if (typeof $scope[$attrs.dynOnOpen] === 'function') {
							$scope[$attrs.dynOnOpen]({});
						}
					}
				});
			}

		}
	}
});