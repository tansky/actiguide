/**
 *  @ngdoc service
 *  @name layers
 *
 *  @description
 *  Сервис работы со слоями. Его используют дропдауны и попапы, для обеспечения поочерёдного открытия и закрытия слоёв.
 */

actiGuide.mainModule.service('layers', ['$document', function ($document) {
	var _layers = [];

	angular.element($document).bind('click', function(e) {
		updateLayers(e.target);
	});

	angular.element($document).bind('keydown', function(e) {
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
		if (_layers.length > 0 && (
			angular.element(element).hasClass('pop-on-click') ||
			(
				!angular.element(element).data('popupCaller') &&
				(!isUpInTree(element) || !isDownInTree(element, angular.element(_layers[_layers.length-1])))
			) || (
				angular.element(element).data('popupCaller') &&
				!isDownInTree(angular.element(element).data('targetPopup'))
			)
		)) {
			popLastLayer();
		}

		updateScrollStatus();
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

		_layers.pop();

		topLayerScope.$apply();

		/* После закрытия слоя проверяем, если новый верхний слой это попап, то делаем его видимым */

		$topLayer = angular.element(_layers[_layers.length - 1]);
		topLayerScope = $topLayer.scope();

		if ($topLayer.hasClass('popup')) {
			topLayerScope.visible = true;
			topLayerScope.$apply();
		}

		updateScrollStatus();
	}

	/**
	 * Проверка наличия открытых попапов в слоях для отключения прокрутки основной страницы
	 * @name updateScrollStatus
	 * @function
	 */
	function updateScrollStatus() {

		/* Если текущий слой - попап, делаем BODY не скроллируемым */

		var bodyScope = angular.element($document[0].body).scope(),
			noScroll = false;

		angular.forEach(_layers, function(layer) {
			if (angular.element(layer).hasClass('popup')) {
				noScroll = true;
			}
		});

		bodyScope.noScroll = noScroll;
		bodyScope.$apply();

	}

	return {
		layersList: _layers,
		updateLayers: updateLayers,
		isUpInTree: isUpInTree,
		isDownInTree: isDownInTree,
		popLastLayer: popLastLayer
	}
}]);