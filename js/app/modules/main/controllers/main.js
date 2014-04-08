actiGuide.mainModule.controller('MainCtrl', function ($scope, $document) {

	/**
	 * Слои
	 */

	$scope._layers = [];

	angular.element($document).bind('click', function(e) {
		$scope.updateLayers(e.target);
	});

	$scope.updateLayers = function(element) {
		if (!$scope.findElementUpInTree(element) && $scope._layers.length > 0) {
			$scope.popLastLayer();
		}
	};

	$scope.popLastLayer = function() {
		var $topLayerScope = angular.element($scope._layers[$scope._layers.length - 1]).scope();

		$topLayerScope.active = false;
		$topLayerScope.$apply();

		$scope._layers.pop();
	};

	$scope.findElementUpInTree = function(element) {
		if ($scope._layers.indexOf(angular.element(element)[0]) > -1) {
			return true;
		} else if (angular.element(element).parent()[0].tagName !== 'HTML') {
			return $scope.findElementUpInTree(angular.element(element).parent());
		} else {
			return false;
		}
	};

});
