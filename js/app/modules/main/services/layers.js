actiGuide.mainModule.service('layers', ['$document', function ($document) {
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