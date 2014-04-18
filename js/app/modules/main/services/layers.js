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
		if ((
			_layers.length > 0 &&
			!isUpInTree(element) &&
			!angular.element(element).hasClass('pop-on-click') &&
			!angular.element(element).data('popupCaller')
		) || (
			_layers.length > 0 &&
			angular.element(element).data('popupCaller') &&
			!isDownInTree(angular.element(element).data('targetPopup')))
		) {
			popLastLayer();
		}
	}

	/**
	 * Данный публичный метод позволяет выяснить, присутствует ли полученный элемент (либо его родители) в списке
	 * слоёв текущего дерева.
	 * @name isUpInTree
	 * @function
	 * @param {object} element DOM-элемент по которому необходимо произвести проверку
	 */
	function isUpInTree(element) {
		if (_layers.indexOf(angular.element(element)[0]) > -1) {
			return true;
		} else if (angular.element(element).parent()[0].tagName !== 'HTML') {
			return isUpInTree(angular.element(element).parent());
		} else {
			return false;
		}
	}

	function isDownInTree(element, tree) {
		var found = false;

		if (!tree) {
			tree = _layers;
		}

		var dig = function(element, tree) {
			angular.forEach(tree, function (item) {
				if (item == element) {
					found = true;
					return true;
				} else {
					return dig(element, angular.element(item).children());
				}
			});
		};
		dig(element, tree);

		return found;
	}

	/**
	 * Механизм закрытия верхнего слоя.
	 * @name isUpInTree
	 * @function
	 */
	function popLastLayer() {
		var $topLayer = angular.element(_layers[_layers.length - 1]),
			topLayerScope = $topLayer.scope();

		topLayerScope.visible = false;
		topLayerScope.$apply();

		_layers.pop();
	}

	return {
		layersList: _layers,
		updateLayers: updateLayers,
		isUpInTree: isUpInTree,
		isDownInTree: isDownInTree,
		popLastLayer: popLastLayer
	}
}]);