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

	angular.element($document).bind('keyup', function(e) {
		if (e.which == 27 && _layers.length > 0) {
			popLastLayer();
		}
	});

	/**
	 * При удовлетворяющих условиях (например клик вне открытого дропдауна) данный публичный метод закроет верхний слой.
	 * @name updateLayers
	 * @function
	 * @param {object} element DOM-элемент по которому необходимо произвести проверку
	 */
	function updateLayers(element) {
		if (!isInTree(element) && _layers.length > 0 && !angular.element(element).hasClass('pop-on-click') && !angular.element(element).data('skipOnUpdate')) {
			popLastLayer();
		}
	}

	/**
	 * Публичный метод добавляет элемент к текущему дереву, если его там ещё нет
	 * @name addLayer
	 * @function
	 * @param {object} element DOM-элемент, который добавляется к дереву
	 */
	function addLayer(element) {
		if (_layers.indexOf(angular.element(element)[0]) > -1) {
			return true;
		} else if (angular.element(element).parent()[0].tagName !== 'HTML') {
			return isInTree(angular.element(element).parent());
		} else {
			return false;
		}
	}

	/**
	 * Данный публичный метод позволяет выяснить, присутствует ли полученный элемент (либо его родители) в списке
	 * слоёв текущего дерева.
	 * @name isInTree
	 * @function
	 * @param {object} element DOM-элемент по которому необходимо произвести проверку
	 */
	function isInTree(element) {
		if (_layers.indexOf(angular.element(element)[0]) > -1) {
			return true;
		} else if (angular.element(element).parent()[0].tagName !== 'HTML') {
			return isInTree(angular.element(element).parent());
		} else {
			return false;
		}
	}

	/**
	 * Механизм закрытия верхнего слоя.
	 * @name isInTree
	 * @function
	 */
	function popLastLayer() {
		var $topLayerScope = angular.element(_layers[_layers.length - 1]).scope();

		$topLayerScope.visible = false;
		$topLayerScope.$apply();

		_layers.pop();
	}

	return {
		layersList: _layers,
		updateLayers: updateLayers,
		addLayer: addLayer,
		isInTree: isInTree,
		popLastLayer: popLastLayer
	}
}]);