// Глобальный нэймспейс приложения
var actiGuide = {};;// TODO: Глобально = грязно
var agGridState = false;

$(document).keydown(function(e) {
	if (e && 192 === e.keyCode && e.shiftKey && e.ctrlKey) {
		if (agGridState) {
			agGridState = false;

			$('#in-guidelines').remove();
		} else {
			agGridState = true;

			$('BODY').append(
				'<div id="in-guidelines"><div id="guidelines"><div class="for-guidelines">' +
					'<div class="col-edge-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-edge-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="left-padding-grid"></div>' +
					'<div class="right-padding-grid"></div>' +
				'</div></div></div>'
			);
		}
	}
});
;actiGuide.mainModule = angular.module('mainModule', []);;actiGuide.mainModule.controller('FormDemoCtrl', function ($scope) {

    $scope.Model = {};

});
;/**
 *  @ngdoc directive
 *  @name btn
 *  @restrict C
 *
 *  @description Директива для кнопок. Может использоваться с разными тегами, например button, span, a
 *
 */
actiGuide.mainModule.directive('btn', function () {
	return {
		restrict: 'C',
		replace: false,
		transclude: true,
		template: '<span class="btn-in" data-ng-transclude></span>'
	};
});
;/**
 *  @ngdoc directive
 *  @name dropdown
 *  @restrict E
 *
 *  @description
 *  Директивы для генерации дропдаунов (см. примеры использования в layers.html).
 */

actiGuide.mainModule.directive('dropdown', function ($window, layers) {
	var ngClasses = "{'is-visible':visible, 'reflect-hor':reflectHorizontal, 'reflect-ver':reflectVertical, 'small-wrap':smallWrap}";

	return {
		restrict: 'E',
		transclude: true,
		template: '<span class="dropdown" ng-class="' + ngClasses + '" ng-transclude />',
		replace: true,
		scope: true,
		link: function(scope, element) {

			scope.visible = false;

			element.bind('click', function() {

				/* Клик по элементу, вызывающему дропдаун не из дерева активных слоёв игнорируется, передав при этом
				управление слушателю кликов из сервиса layers */

				if (layers.layersList.length > 1 && !layers.isInTree(this)) {
					return;
				}


				/* Открытие дропдауна и добавление его к слоям */

				var clickedElement = angular.element(this),
					clickedElementScope = clickedElement.scope();

				layers.updateLayers(this);
				clickedElementScope.visible = true;

				if (layers.layersList.indexOf(this) < 0) {
					layers.layersList.push(this);
				}


				/* Проверка ширины элемента, открывающего дропдаун (смещаем стрелку ближе к краю, если ширина < 50px) */

				if (clickedElement[0].offsetWidth < 50) {
					scope.smallWrap = true;
				}

				clickedElementScope.$apply();


				/* Проверка границ выпавшего дропдауна */

				var doc = angular.element(document).find('BODY')[0];

				angular.forEach(clickedElement.children(), function(element) {
					scope.reflectHorizontal = doc.clientWidth < element.getBoundingClientRect().right;
					scope.reflectVertical = doc.clientHeight < element.getBoundingClientRect().bottom;
					clickedElementScope.$apply();
				});

			});

		}
	};
}).directive('dCaller', function () {
	return {
		restrict: 'E',
		transclude: true,
		replace : true,
		scope: false,
		template: '<span class="dropdown_caller" ng-transclude />'
	}
}).directive('dContainer', function () {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: false,
		template: '<span class="dropdown_container" ng-transclude />'
	};
});;/**
 *  @ngdoc directive
 *  @name moneyField
 *  @restrict EA
 *
 *  @description Директива для поля ввода денежных сумм.
 *  Переход между полями может осуществлятся с помощью стрелок влево/вправо
 *  К полям подключены модификаторы RegExpFilter и Money, а также валидатор checkRange со значением 0
 *
 *  @param {string} ngModel Привязка к модели
 *  @param {string} [showKop] Показываем поле с копейками, если указан параметр
 *  @param {string} [id] Стандартный атрибут id. На поля для рублей и копеек будут проставлены атрибуты id
 *  соответственно как {id}_Rub и {id}_Kop
 *  @param {string} [name] Стандартный атрибут name. На поля для рублей и копеек будут проставлены атрибуты name
 *  соответственно как {id}_Rub и {id}_Kop
 *  @param {string} [disabled] Стандартный атрибут
 *  @param {string} [readonly] Стандартный атрибут
 *  @param {string} [required] Стандартный параметр AngularJs
 *  @param {string} [ngRequired] Стандартный параметр AngularJs
 *  @param {string} [ngReadonly] Стандартный параметр AngularJs
 *  @param {string} [ngDisabled] Стандартный параметр AngularJs
 *  @param {string} [zeroAble] По умолчанию значение 0 не валидно. Если указан параметр, значение 0 становится валидным
 *
 */

actiGuide.mainModule.directive('moneyField', function($sniffer, $browser, $timeout, $filter, $caretPosition) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        scope: true,
        link: function (scope, element, attrs, ngModelCtrl) {

            scope.showKop = attrs.showKop;
            scope.atm = attrs.qa;

            var inputRub = element.find('input:first'),
                inputKop = element.find('input:last'),
                spanRub = inputRub.next('span'),
                spanKop = inputKop.next('span'),
                inputs = element.find('input');

            if (attrs.required) {
                inputRub.attr('required', 'required');
            }

            //рендер значения из модели по инпутам
            ngModelCtrl.$render = function() {
                if (ngModelCtrl.$viewValue) {
                    ngModelCtrl.$viewValue = Math.ceil(ngModelCtrl.$viewValue * 100) / 100;
                    var value = String(ngModelCtrl.$viewValue).split('.');

                    inputRub.val($filter('currency')(value[0]));
                    if (value[1]) {
                        value[1] = value[1].length == 1 ? value[1] + '0' : value[1]; //если пришло число типа 1.2, добавляем к копейкам ноль
                        inputKop.val(value[1]);
                    } else {
                        inputKop.val('');
                    }
                } else {
                    inputRub.val('');
                    inputKop.val('');
                }
            };


            var listener = function () {
                var kop = inputKop.val(),
                    rub = inputRub.val(),
                    totalValue = (rub ? rub : (kop && kop > 0 ? '0' : '' )) + (kop && kop > 0 ? '.' + (kop.length > 1 ? kop : '0' + kop) : '');

                if (ngModelCtrl.$viewValue != parseFloat(totalValue)) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(parseFloat(totalValue.replace(/\s/g, '')));
                    });
                }
            };

            if ($sniffer.hasEvent('input')) {
                inputs.on('input', listener);
            } else {
                var timeout;

                var deferListener = function() {
                    if (!timeout) {
                        timeout = $browser.defer(function() {
                            listener();
                            timeout = null;
                        });
                    }
                };

                inputs.on('keydown', function(event) {
                    var key = event.keyCode;

                    // ignore
                    //    command            modifiers                   arrows
                    if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

                    deferListener();
                });

                // if user paste into input using mouse, we need "change" event to catch it
                inputs.on('change', listener);

                // if user modifies input value using context menu in IE, we need "paste" and "cut" events to catch it
                if ($sniffer.hasEvent('paste')) {
                    inputs.on('paste cut', deferListener);
                }
            }

            //управление стрелками
            inputRub.on('keydown', function(event) {
                if (!scope.showKop) return;

                var key = event.keyCode,
                    caretPosition = $caretPosition.get(this),
                    valueLength = this.value.length;

                if (key == 39 && caretPosition == valueLength) {
                    $timeout(function () {
                        $caretPosition.$set(inputKop, 0);
                    }, 1);
                }
            });
            inputKop.on('keydown', function(event) {
                var key = event.keyCode,
                    caretPosition = $caretPosition.get(this);

                if (key == 37 && caretPosition == 0) {
                    $timeout(function () {
                        $caretPosition.$set(inputRub, inputRub.val().length);
                    }, 1);
                }
            });

            //прокидываем событие фокус на инпут
            element.on('focus', function() {
                inputRub.focus();
            });

            spanRub.on('click', function() {
                inputRub.focus();
            });

            spanKop.on('click', function () {
                inputKop.focus();
            });

            //расстановка атрибутов
            if ('disabled' in attrs) {
                inputs.attr('disabled', 'disabled');
            }

            if ('readonly' in attrs) {
                inputs.attr('readonly', 'readonly');
            }

            if ('id' in attrs) {
                inputRub.attr('id', attrs.id + '_Rub');
                inputKop.attr('id', attrs.id + '_Kop');
            }

            if ('name' in attrs) {
                inputRub.attr('name', attrs.name + '.Rub');
                inputKop.attr('name', attrs.name + '.Kop');
            }

            if (attrs.ngDisabled) {
                scope.$watch(attrs.ngDisabled, function(newValue) {
                    inputs.attr('disabled', newValue);
                });
            }

            if (attrs.ngReadonly) {
                scope.$watch(attrs.ngReadonly, function (newValue) {
                    inputs.attr('readonly', newValue);
                });
            }
        },
        template: '<div class="dib t-input-money">' +
            '<input type="text" class="t-input ctrl__sim3 first m-none" data-modifier=\'[\"RegExpFilter:[^\\\\d]\", \"Money\"]\' maxlength="11" data-check-range="0" autocomplete="off" data-qa=\"{{ atm }}.Rub\"><span class="ctrl__sim3">Руб</span>' +
            '<input type="text" data-ng-show="showKop" class="t-input t-input__mini ctrl__sim3 last m-none" data-modifier=\'["RegExpFilter:[^\\\\d]"]\' maxlength="2" autocomplete="off" data-qa=\"{{ atm }}.Kop\"><span data-ng-show="showKop" class="ctrl__sim3">Коп</span>' +
            '</div>',
        replace: true
    };
});
;/**
 *  @ngdoc directive
 *  @name navList
 *  @restrict C
 *
 *  @description Директива для навигационных списков. Добавляет состояния pushed/active
 *
 */
actiGuide.mainModule.directive('navList', function () {
    return {
        restrict: 'C',
        link: function (scope, element) {
            var listItems = $('li:not(.list-title, .list-subtitle)', element);
            listItems.click(function () {
                listItems.removeClass('active');
                $(this).addClass('active');
            });

            listItems.on("mousedown", function () {
                $(this).addClass("pushed");
            }).on("mouseup mouseout", function () {
                $(this).removeClass("pushed");
            });
        }
    };
});;/**
 *  @ngdoc directive
 *  @name popupCaller
 *  @restrict A
 *
 *  @description
 *  Директива для открытия попапов.
 */

actiGuide.mainModule.directive('popupCaller', function (layers) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
			(function(attrs) {
				element.bind('click', function() {

					var popupElement = document.getElementById(attrs.popupCaller),
						popupScope = angular.element(popupElement).scope();

					/* Клик по элементу, вызывающему попап не из дерева активных слоёв игнорируется, передав при этом
					 управление слушателю кликов из сервиса layers */

					if (layers.layersList.length > 0 && !layers.isInTree(this)) {
						return;
					}

					scope.noScroll = true;
					popupScope.visible = true;

					if (layers.layersList.indexOf(this) < 0) {
						layers.layersList.push(this);
						angular.element(element).data('popupElement', popupElement);
					}

					popupScope.$apply();

				});
			})(attrs);
		}
	}
});


/**
 *  @ngdoc directive
 *  @name popup
 *  @restrict E
 *
 *  @description
 *  Директивы для генерации попапов (см. примеры использования в layers.html).
 */

actiGuide.mainModule.directive('popup', function ($document, layers) {
	var ngClasses = "{'is-visible':visible}";

	return {
		restrict: 'E',
		transclude: true,
		template: '<div class="popup" ng-class="' + ngClasses + '" ng-transclude />',
		replace: true,
		scope: true,
		link: function(scope, element, attrs) {

			scope.visible = false;

			element.html('').bind('click', function(e) {
				if (angular.element(e.target).hasClass('pop-on-click')) {
					angular.element($document[0].body).scope().noScroll = false;
					scope.noScroll = false;
					layers.popLastLayer();
				}
			});

			/* Директивы ниже наполняют скоуп попапа данными, из которых здесь формируется его контент */

			var sections = ['title', 'container'],
				collect = '';

			if (typeof attrs.noCloseButton === 'undefined') {
				collect += '<div class="close-button pop-on-click"></div>';
			}

			angular.forEach(sections, function(section) {
				if (scope[section]) {
					collect += scope[section];
				}
			});

			element.append('<div class="popup_overflow pop-on-click"></div>');
			element.append('<div class="popup_wrap pop-on-click"><div class="popup_inner-wrap">' + collect + '</div></div>');

		}
	}
}).directive('popupTitle', function () {
	return {
		restrict: 'E',
		link: function(scope, element) {
			var $element = angular.element(element),
				$parent = $element.parent(),
				$parentScope = $parent.scope();

			$parentScope.title = '<div class="popup_title"><h2>' + $element.html() + '</h2></div>';
		}
	}
}).directive('popupContainer', function () {
	return {
		restrict: 'E',
		link: function(scope, element) {
			var $element = angular.element(element),
				$parent = $element.parent(),
				$parentScope = $parent.scope();

			$parentScope.container = '<div class="popup_container">' + $element.html() + '</div>';
		}
	};
});;/**
 *  @ngdoc directive
 *  @name tipBox
 *  @restrict E
 *
 *  @description Директива блока. Стилевое оформление указывается с помощью классов.
 *
 *  @param {string} [closeBtn] Показываем ссылку "Скрыть", если указан параметр
 *
 */
actiGuide.mainModule.directive('tipBox', function () {
	return {
		restrict: 'E',
		scope: true,
		replace: true,
		transclude: true,
		link: function (scope, element, attr) {
			scope.showCloseBtn = attr.closeBtn;

			scope.hideTip = function () {
				scope.hideTipBox = true;
			}
		},
		templateUrl: 'tipbox.html'
	};
});
;actiGuide.mainModule.filter('currency', function() {
    //currency - разбить число по разрядам и округлить до второго знака
    return function(value, format) {
        if (!value) return value;
        value = String(value).replace(',', '.');
        value = Math.ceil(value * 100) / 100;
        value = String(value).split('.');
        if (value[1]) {
            value[1] = value[1].length == 1 ? value[1] + '0' : value[1]; //если пришло число типа 1.2, добавляем к копейкам ноль
        }
        if (format === 'full') {
            return value[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1 ") + ' руб' + (+value[1] ? ' ' + value[1] + ' коп' : "");
        }
        return value[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1 ") + (+value[1] ? "," + value[1] : "");
    };
});actiGuide.mainModule.factory('$caretPosition', function () {
    return {
        get: "selection" in document ? getCaretPositionForIe : getCaretPosition,
        set: document.createElement("input").createTextRange ? setCaretPositionForIe : setCaretPosition,
        $get: $getCaretPosition,
        $set: $setCaretPosition
    };

    function getCaretPosition(element) {
        return element ? element.selectionStart : null;
    }

    function getCaretPositionForIe(element) {
        if (!element) return null;

        element.focus();

        var selection = document.selection.createRange();
        selection.moveStart("character", -element.value.length);
        return selection.text.length;
    }

    function setCaretPosition(element, position) {
        if (!element) return false;

        element.focus();
        try { // try/catch ???
            element.setSelectionRange(position, position);
        } catch (e) {

        }
        return true;
    }

    function setCaretPositionForIe(element, position) {
        if (!element) return false;
        if (!position) return false;

        element.focus();

        var range = element.createTextRange();
        range.collapse(true);
        range.moveEnd("character", position);
        range.moveStart("character", position);
        range.select();
        return true;
    }

    function $getCaretPosition($element) {
        return this.get($element.get(0));
    }

    function $setCaretPosition($element, position) {
        return this.set($element.get(0), position);
    }
});;/**
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
		if (!isInPopup(element) && !isInTree(element) && _layers.length > 0 && !angular.element(element).hasClass('pop-on-click')) {
			popLastLayer();
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

	function isInPopup(element) {
		if (angular.element(element).hasClass('popup')) {
			return true;
		} else if (angular.element(element).parent()[0].tagName !== 'HTML') {
			return isInPopup(angular.element(element).parent());
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
		var $topLayer = angular.element(_layers[_layers.length - 1]),
			topLayerScope = angular.element($topLayer).data('popupElement') ? angular.element(angular.element($topLayer).data('popupElement')).scope() : $topLayer.scope();

		topLayerScope.visible = false;
		topLayerScope.$apply();

		_layers.pop();
	}

	return {
		layersList: _layers,
		updateLayers: updateLayers,
		isInTree: isInTree,
		popLastLayer: popLastLayer
	}
}]);