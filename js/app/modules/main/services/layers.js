/**
 *  @ngdoc service
 *  @name layers
 *
 *  @description
 *  Сервис работы со слоями. Его используют элементы типа дропдаун, для обеспечения поочерёдного
 *  открытия и закрытия элементов.
 */

actiGuide.mainModule.service('layers', ['$document', function ($document) {
	var _layers = [];

	angular.element($document).bind('click', function(e) {
		updateLayers(e.target);
	});

	/**
	 * При удовлетворяющих условиях (например клик вне открытого дропдауна) данный публичный метод закроет верхний слой.
	 * @name updateLayers
	 * @function
	 * @param {object} element DOM-элемент по которому необходимо произвести проверку
	 */
	function updateLayers(element) {
		if (!isElementInLayers(element) && _layers.length > 0) {
			popLastLayer();
		}
	}

	/**
	 * Данный публичный метод позволяет выяснить, присутствует ли полученный элемент (либо его родители) в списке
	 * имеющихся слоёв.
	 * @name isElementInLayers
	 * @function
	 * @param {object} element DOM-элемент по которому необходимо произвести проверку
	 */
	function isElementInLayers(element) {
		if (_layers.indexOf(angular.element(element)[0]) > -1) {
			return true;
		} else if (angular.element(element).parent()[0].tagName !== 'HTML') {
			return isElementInLayers(angular.element(element).parent());
		} else {
			return false;
		}
	}

	/**
	 * Механизм закрытия верхнего слоя.
	 * @name isElementInLayers
	 * @function
	 */
	function popLastLayer() {
		var $topLayerScope = angular.element(_layers[_layers.length - 1]).scope();

		$topLayerScope.active = false;
		$topLayerScope.$apply();

		_layers.pop();
	}

	return {
		getLayersList: _layers,
		updateLayers: updateLayers,
		isElementInLayers: isElementInLayers
	}
}]);