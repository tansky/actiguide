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
				'<div id="in-guidelines"><div class="wrapper" style="height: 100%"><div id="guidelines"><div class="for-guidelines">' +
					'<div class="col-edge-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="col-edge-1"><div class="box"><p class="grid-p"></p></div></div>' +
					'<div class="left-padding-grid"></div>' +
					'<div class="right-padding-grid"></div>' +
				'</div></div></div></div>'
			);
		}
	}
});
;actiGuide.mainModule = angular.module('mainModule', []);;actiGuide.mainModule.controller('TestFormCtrl', function ($scope, $timeout, alertBox) {

	$scope.Model = {};

	$scope.Model.PaymentTypeCatalog = [
		{
			Name: 'Оплата контрагенту',
			Id: 1
		},
		{
			Name: 'Возврат контрагенту',
			Id: 2
		},
		{
			Name: 'Штраф и неустойка контрагенту',
			Id: 3
		},
		{
			Name: 'Выплата зарплаты',
			Id: 4
		}
	];

	$scope.Model.PaymentType = $scope.Model.PaymentTypeCatalog[0];

	$scope.saveTestForm = function (disabled) {
		if (disabled) return;

		$scope.sending = true;

		$timeout(function () {
			$scope.sending = false;
			$timeout(function () {
				alertBox.push('Сохранение успешно');
			});
		}, 2000);
	};

	$scope.checkPaymentType = function () {
		return $scope.Model.PaymentType.Id == 4;
	};

    $scope.Model.DisabledInput = "Текст";
});


actiGuide.mainModule.controller('TabsCtrl', function ($scope, $timeout) {

    $scope.Model = {};

    $scope.handler = function (value) {
        console.warn(value);
    };
});
;/**
 *  @ngdoc directive
 *  @name btn__select
 *  @restrict С
 *
 *  @description Кнопка с выпадающим списком
 *
 */
actiGuide.mainModule.directive('btnSelect', function () {

    var $btnsList = $();

    $(document).on('click', function () {
        $btnsList.removeClass('active').find('.select-dropdown').hide();
    });

	return {
		restrict: 'C',
		link: function (scope, element, attr) {
            $btnsList = $btnsList.add(element);

            var dropdown = $('.select-dropdown', element);

            element.on('click', function (event) {
                if (element.hasClass('active')) {
                    dropdown.hide();
                } else {
                    event.stopPropagation();
                    $btnsList.removeClass('active').find('.select-dropdown').hide();
                    dropdown.show();
                }
                element.toggleClass('active');
            });
		}
	};
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
 *  @name dateField
 *  @restrict EA
 *
 *  @description Директива для ввода даты
 *  Переход между полями может осуществлятся с помощью стрелок влево/вправо
 *  К полям подключен модификатор RegExpFilter
 *
 *  @param {string} ngModel Привязка к модели
 *  @param {string} [id] Стандартный атрибут id. На поля будут проставлены атрибуты id
 *  соответственно как {id}_Day, {id}_Month и {id}_Year
 *  @param {string} [name] Стандартный атрибут name. На поля будут проставлены атрибуты name
 *  соответственно как {name}.Day, {name}.Month и {name}.Year
 *  @param {string} [disabled] Стандартный атрибут
 *  @param {string} [readonly] Стандартный атрибут
 *  @param {string} [required] Стандартный параметр AngularJs
 *  @param {string} [ngRequired] Стандартный параметр AngularJs
 *  @param {string} [ngReadonly] Стандартный параметр AngularJs
 *  @param {string} [ngDisabled] Стандартный параметр AngularJs
 *
 */

actiGuide.mainModule.directive('dateField', function($sniffer, $browser) {

    var options = {
        yearLimitMax: 2100,
        yearLimitMin: 1900,
        daysInMonth: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        monthLimit: 12
    };

    return {
        restrict: 'EA',
        require: 'ngModel',
        scope: true,
        link: function (scope, element, attrs, ngModelCtrl) {

            var inputDay = element.find('input:eq(0)'),
                inputMonth = element.find('input:eq(1)'),
                inputYear = element.find('input:eq(2)'),
                inputs = element.find('input');

            scope.groupCtrl = attrs.groupCtrl;

            //рендер значения из модели по инпутам
            ngModelCtrl.$render = function() {
                if (ngModelCtrl.$viewValue) {
                    var value = String(ngModelCtrl.$viewValue).split('.');

                    inputDay.val(value[0]);
                    inputMonth.val(value[1]);
                    inputYear.val(value[2]);
                } else {
                    inputs.val('');
                }
            };

            var listener = function () {
                var day = parseInt(inputDay.val()),
                    month = parseInt(inputMonth.val()),
                    year = parseInt(inputYear.val());

                if (month == 2 && (year + '').length == 4) {
                    options.dayLimit = new Date(year, month, 0).getDate();
                } else {
                    options.dayLimit = month ? options.daysInMonth[month - 1] : 31
                }

                if (day > options.dayLimit) {
                    day = options.dayLimit;
                    inputDay.val(options.dayLimit);
                }

                if (month > options.monthLimit) {
                    month = options.monthLimit;
                    inputMonth.val(options.monthLimit);
                }

                if (year > options.yearLimitMax) {
                    year = options.yearLimitMax;
                    inputYear.val(options.yearLimitMax);
                }

                setValue(day, month, year);
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

            inputs.on('focusout', function (e) {
                var day = parseInt(inputDay.val()),
                    month = parseInt(inputMonth.val()),
                    year = parseInt(inputYear.val());

                if (day === 0) {
                    day = 1;
                    inputDay.val(day);
                }
                if (month === 0) {
                    month = 1;
                    inputMonth.val(month);
                }
                if (year < options.yearLimitMin) {
                    year = options.yearLimitMin;
                    inputYear.val(year);
                }

                setValue(day, month, year);
            });

            function setValue(day, month, year) {
                var totalValue;

                if (day && month && (year + '').length == 4){
                    totalValue = day + '.' + month + '.' + year;
                }

                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(totalValue);
                });
            }

            //прокидываем событие фокус на инпут
            element.on('focus', function() {
                inputDay.focus();
            });

            //расстановка атрибутов
            if ('disabled' in attrs) {
                inputs.attr('disabled', 'disabled');
            }

            if ('readonly' in attrs) {
                inputs.attr('readonly', 'readonly');
            }

            if ('id' in attrs) {
                inputDay.attr('id', attrs.id + '_Day');
                inputMonth.attr('id', attrs.id + '_Month');
                inputYear.attr('id', attrs.id + '_Year');
            }

            if ('name' in attrs) {
                inputDay.attr('name', attrs.name + '.Day');
                inputMonth.attr('name', attrs.name + '.Month');
                inputYear.attr('name', attrs.name + '.Year');
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
        template: '<div class="dib" data-split-fields>' +
                '<input class="t-input t-input__micro" data-ng-class="{ first: !groupCtrl }" data-modifier=\'["RegExpFilter:[^\\\\d]"]\' autocomplete="off" placeholder="ДД" maxlength="2">' +
                '<input class="t-input t-input__micro" data-modifier=\'["RegExpFilter:[^\\\\d]"]\' autocomplete="off" placeholder="ММ" maxlength="2">' +
                '<input class="t-input t-input__mini last" data-modifier=\'["RegExpFilter:[^\\\\d]"]\' autocomplete="off" placeholder="ГГГГ" maxlength="4">' +
            '</div>',
        replace: true
    };
});
;/**
 *  @ngdoc directive
 *  @name datepicker
 *  @restrict E
 *
 *  @description
 *  Директива календаря для выбора дат с поддержкой периодов
 */
;actiGuide.mainModule.directive( 'datepicker', [ 'ranges', 'VIEWS_PATH', function ( RangesService, VIEWS_PATH) {

    return {
        restrict: 'E',
        scope: {
            mDate: '=' // дата в формате 1.1.2000
        },
        replace: true,
        transclude: false,
        templateUrl: VIEWS_PATH + 'datepicker.html',
        link: function ($scope, $element, $attrs) {

            var TODAY = new Date(),
                RENDER_DATE = TODAY,
                DATE_SELECTED = TODAY;

            $scope.isDisableBtn = false;
            $scope.RangesService = RangesService;
            $scope.bindedTo = !!$attrs.alternativeBinding ? $attrs.alternativeBinding : $attrs.mDate;
            $scope.inputValue = {
                day: parseInt( TODAY.getDay(), 10 ),
                month: parseInt( TODAY.getMonth(), 10 ),
                year: parseInt( TODAY.getFullYear(), 10 )
            };
            $scope.showSubmitTooltip = false;
            $scope.submitTooltip = '';
            $scope.week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
            $scope.month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];


            /**
             * День недели
             * @param date
             * @returns {number}
             */
            function getDayOfWeek (date) {
                var day = date.getDay();
                if ( day == 0 ) day = 7;
                return day - 1;
            }


            /**
             * Количество дней в месяце
             * @param date
             * @returns {number}
             */
            function daysInMonth (date) {
                return 33 - new Date( date.getFullYear(), date.getMonth(), 33 ).getDate();
            }


            /**
             * Проверки вводимых символов из инпутов
             * @param $scope
             * @param inputValue
             */
            function checkInputsValue ($scope, inputValue) {

                var _inputValue = _.clone( inputValue );

                if ( _inputValue.year.length < 4 ){
                    return;
                }

                _inputValue.month = parseInt( _inputValue.month, 10 ) == 0 ? 0 : _inputValue.month - 1;

                var valueToCheck = [ _inputValue.year | 0 , _inputValue.month | 0, _inputValue.day | 0 ];

                if ( moment( valueToCheck ).isValid() ) {

                    if ( !isDateDisabled( _inputValue ) ) {
                        DATE_SELECTED = new Date( _inputValue.year, _inputValue.month, _inputValue.day )
                        $scope.renderDays( _inputValue.year, _inputValue.month )
                        $scope.isSubmitDisabled = false;
                        $scope.showSubmitTooltip = false;
                    } else {
                        $scope.isSubmitDisabled = true;
                        $scope.submitTooltip = _inputValue.tooltip;
                    }

                }
            }

            $scope.$on( 'RangesChanged', function () {
                $scope.renderDays( DATE_SELECTED.getFullYear(), DATE_SELECTED.getMonth() )
            } )

            /**
             * Событие при клике на кнопку "ОК"
             * если выбрана не валидная дата ругнется и покажет тултип
             */
            $scope.clickBtn = function () {
                if ( $scope.isSubmitDisabled ) {
                    $scope.showSubmitTooltip = true;
                    setTimeout( function () {
                        $scope.showSubmitTooltip = false;
                        $scope.$apply();
                    }, 1000 );
                } else {
                    $scope.choose()
                }
            };

            // Формирование дат в календаре
            $scope.renderDays = function (year, month) {

                var date = new Date( year, month ),
                    prevMonth = new Date( date.getFullYear(), date.getMonth() - 1 );

                $scope.days = [];
                $scope.title = $scope.month[date.getMonth()] + ', ' + date.getFullYear();

                function addDay (d, m, y) {

                    var day = {
                        day: d,
                        month: m,
                        year: y
                    }

                    day.isCurrent = isCurrent( day );
                    day.isDisabled = isDateDisabled( day );
                    day.isToday = isToday( day )

                    $scope.days.push( day )
                }


                for ( var i = 0; i < getDayOfWeek( date ); i++ ) { // Добавление дат до текушего месяца
                    addDay( daysInMonth( prevMonth ) - (getDayOfWeek( date ) - i - 1), prevMonth.getMonth(), prevMonth.getFullYear() )
                }

                while (date.getMonth() == month) { // Добавляем даты с текущего месяца
                    addDay( date.getDate(), date.getMonth(), date.getFullYear() )
                    date.setDate( date.getDate() + 1 );
                }

                if ( getDayOfWeek( date ) != 0 ) { // Добавляем даты после текущего месяца
                    for ( var i = getDayOfWeek( date ); i < 7; i++ ) {
                        addDay( date.getDate(), date.getMonth(), date.getFullYear() )
                        date.setDate( date.getDate() + 1 );
                    }
                }

                /**
                 * установка даты на первый валидный день
                 */
                var _dateSelected = {
                    day: DATE_SELECTED.getDate(),
                    month: DATE_SELECTED.getMonth(),
                    year: DATE_SELECTED.getFullYear()
                };

                if ( isDateDisabled( _dateSelected ) ) {

                    var activeRange = RangesService.getActiveRangeForDatepicker( $scope.bindedTo ),
                        _d = moment( [_dateSelected.year, _dateSelected.month, _dateSelected.day] ),
                        dStart = activeRange.from.add( 'day', 1 ),
                        dEnd = activeRange.to.subtract( 'day', 1 ), result;

                    if ( dStart.isAfter( dEnd ) ) {
                        //$scope.title = 'Нет доступных дат';
                    }
                    if ( dStart.isSame( dEnd ) ) {
                        result = dStart;
                    } else {

                        if ( _d.diff( dStart ) < 0 ) {

                            if ( _d.diff( dStart ) < _d.diff( dEnd ) ) {
                                result = dEnd;
                            } else {
                                result = dStart;
                            }

                        } else {
                            if ( _d.diff( dStart ) < _d.diff( dEnd ) ) {
                                result = dStart;
                            } else {
                                result = dEnd;
                            }
                        }

                    }

                    DATE_SELECTED = result.toDate();
                    //RENDER_DATE = new Date( DATE_SELECTED.getFullYear(), DATE_SELECTED.getMonth() );
                    $scope.mDate = result.format('DD.MM.YYYY')
                }
            };

            /**
             * на месяц вперёд
             */
            $scope.nextMonth = function () {
                var year = RENDER_DATE.getFullYear(), month = RENDER_DATE.getMonth();

                if (month == 11) {
                    year++;
                    month = 0;
                } else {
                    month++;
                }

                RENDER_DATE = new Date(year, month);
                $scope.renderDays( year, month );

            };

            /**
             * на месяц назад
             */
            $scope.prevMonth = function () {

                var month = RENDER_DATE.getMonth(),
                    year = RENDER_DATE.getFullYear();

                if (month == 0) {
                    year--;
                    month = 11;
                } else {
                    month--;
                }

                RENDER_DATE = new Date(year, month);
                $scope.renderDays(year, month);
            };

            /**
             * Выбор даты
             * @param [item] конкретный день
             */
            $scope.choose = function (item) {

                var item = !!item ?
                    item
                    :
                    {
                        year: DATE_SELECTED.getFullYear(),
                        month: DATE_SELECTED.getMonth(),
                        day: DATE_SELECTED.getDate()
                    };

                if ( !isDateDisabled( item ) ) {
                    var date = new Date( item.year, item.month, item.day );
                    DATE_SELECTED = date;

                    $scope.inputValue.day = item.day;
                    $scope.inputValue.month = item.month + 1;
                    $scope.inputValue.year = item.year;

                    //RENDER_DATE = new Date( item.year, item.month, item.day );
                    $scope.renderDays( item.year, item.month )
                    $scope.mDate = moment( date).format( 'DD.MM.YYYY' )

                } else { // показать подсказку
                    item.isShow = true;
                    setTimeout( function () {
                        item.isShow = false;
                        $scope.$apply();
                    }, 1000 );
                }

            };

            function parseDateString( date ){
                var format = 'D.M.YYYY',
                    result = moment( date, format);

                return result.isValid() ? result.toDate() : date;
            }

            /**
             * проверка из RangesService в разрезе конкретного дэйтпикера
             * @type {function}
             */
            var isDaySelectable = RangesService.isDateSelectable.bind( $scope.bindedTo );

            function isDateDisabled (date) {

                var dateToCheck = new Date(date.year, date.month, date.day),
                    result = isDaySelectable(dateToCheck);

                date.tooltip = result.message

                return !result.selectable;
            }

            function isToday (item) {
                return TODAY.getDate() == item.day && TODAY.getMonth() == item.month && TODAY.getFullYear() == item.year
            }

            function isCurrent (item) {

                var _d = DATE_SELECTED;

                if ( _d.getFullYear() == item.year && _d.getMonth() == item.month && _d.getDate() == item.day ) {
                    return !isDateDisabled( item );
                }

                return false
            };

            $scope.$watch( 'mDate', function (newVal, oldVal, $scope) {

                if ( oldVal !== newVal ) {
                    var date = parseDateString( newVal );

                    DATE_SELECTED = date;
                    RENDER_DATE = new Date( date.getFullYear(), date.getMonth() )

                    $scope.renderDays( date.getFullYear(), date.getMonth() );
                }
            } );

            $scope.$watch( 'inputValue', function (newVal, oldVal, $scope) {
                if ( oldVal !== newVal ) {
                    checkInputsValue( $scope, newVal );
                }
            }, true );



            // если выбранный изначально день заблокирован, нужно выбрать ближайший валидный
            if ( isDateDisabled( {year: DATE_SELECTED.getFullYear(), month: DATE_SELECTED.getMonth(), day: DATE_SELECTED.getDate()} )){
                $scope.renderDays( 1970, 1)
            } else {
                $scope.choose()
            }

        }
    };
}] );
;/**
 *  @ngdoc directive
 *  @name dropdown
 *  @restrict E
 *
 *  @description
 *  Директива для генерации дропдаунов (см. примеры использования в layers.html).
 */

actiGuide.mainModule.directive('dropdown', function (VIEWS_PATH, $window, $timeout, $sce, layers) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: VIEWS_PATH + 'dropdown.html',
		replace: true,
		scope: true,
		controller: function($scope, $element, $attrs) {

			$scope.visible = false;

			$scope.caller = $sce.trustAsHtml($attrs.caller);

			$scope.toggleDropdown = function() {

				if (layers.layersList.length === 0) {

					/* Открываем первый слой */

					$scope.visible = true;
					layers.layersList.push($element[0]);

				} else if (layers.layersList.length == 1 && !layers.isUpInTree($element[0])) {

					/* Закрываем верхний слой, если он единственный */

					angular.element(layers.layersList[0]).scope().visible = false;
					layers.layersList.pop();

					$scope.visible = true;
					layers.layersList.push($element[0]);

				} else if (layers.layersList.length > 0 && layers.isUpInTree($element[0]) && layers.layersList.indexOf($element[0]) < 0) {

					/* Открываем дропдаун, если он вызван внутри текущего дерева */

					$scope.visible = true;
					layers.layersList.push($element[0]);

				} else if (layers.layersList.length > 0 && layers.layersList.indexOf($element[0]) > -1 && layers.layersList[layers.layersList.length-1] === $element[0]) {

					/* Закрываем слой, если была попытка открыть его же снова (клик по caller'у дропдауна) */

					$scope.visible = false;
					layers.layersList.pop();

				}


				/* Проверка ширины элемента, открывающего дропдаун (смещаем стрелку ближе к краю, если ширина < 50px) */

				if ($element[0].offsetWidth < 50) {
					$scope.smallWrap = true;
				}

			};

			$scope.$watch('visible', function(isVisible) {

				/* Проверка границ выпавшего дропдауна */

				var doc = angular.element(document).find('BODY')[0];
				angular.forEach($element.children(), function(element) {
					if (angular.element(element).hasClass('dropdown_container')) {
						element.style.display = isVisible ? "block" : "none";
						$scope.reflectHorizontal = doc.clientWidth < element.getBoundingClientRect().right;
						$scope.reflectVertical = doc.clientHeight < element.getBoundingClientRect().bottom;
					}
				});

			});
		}
	};
});;actiGuide.mainModule.directive('onOpen', function () {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, $element, $attrs) {
			$scope.$watch('visible', function(isVisible) {
				if (isVisible && typeof $scope[$attrs.onOpen] === 'function') {
					$scope[$attrs.onOpen]();
				}
			});
		}
	}
});
;/**
 *  @ngdoc directive
 *  @name form
 *  @restrict E
 *
 *  @description Директива формы
 *
 *
 */
actiGuide.mainModule.directive('form', function () {
    return {
        require: 'form',
        restrict: 'E',
        link: function ($scope, $element, $attrs, formCtrl) {
            if (!formCtrl) return;

            angular.forEach(formCtrl, function(item) {
                if (angular.isObject(item) && item.$name) {
                    var control = $element.find('[name="' + item.$name + '"]');

                    item.$element = control;

                    control.on('focusout', checkControl);

                    control.on('keyup', function (){
                        if (!item.$error.showError) return;
                        checkControl();
                    });

                    function checkControl () {
                        var errorReason;
                        angular.forEach(item.$error, function(value, reason) {
                            if (value === true && reason !== 'required') {
                                errorReason = reason;
                            }
                        });

                        if (errorReason) {
                            $scope.$apply(item.$error.showError = errorReason);
                            $(this).addClass('invalid');
                        } else {
                            $scope.$apply(item.$error.showError = false);
                            $(this).removeClass('invalid');
                        }

                        if (item.$warnings) {
                            var warningReason;
                            angular.forEach(item.$warnings, function(value, reason) {
                                if (value === true) {
                                    warningReason = reason;
                                }
                            });

                            if (warningReason) {
                                $scope.$apply(item.$warnings.showWarning = warningReason);
                            } else {
                                $scope.$apply(item.$warnings.showWarning = false);
                            }
                        }
                    }
                }
            });
        },
    };
});
;/**
 *  @ngdoc directive
 *  @name hint
 *  @restrict A
 *
 *  @description Хинты-подсказки. Всплывают при наведении на элемент
 *
 *
 */
actiGuide.mainModule.directive('hint', function($timeout) {
    return {
        restrict: 'A',
        priority: 1000,
        link: function($scope, $element, $attrs) {
            var hint = $('<div>', {
                    'class': 'hint-text',
                    'html': $attrs.hint
                }).appendTo('body'),
                timeoutPromise;

            $element.on('mouseover.hints', function () {
                var position = $element.offset();

                timeoutPromise = $timeout(function () {
                    hint.css({ 'top': position.top - hint.innerHeight() - 15, 'left': position.left, display: 'block' });
                }, 700);
            });

            $element.on('mouseleave.hints', function () {
                $timeout.cancel(timeoutPromise);
                hint.css({ display: 'none' });
            });

            $scope.$on('$destroy', function() {
                $element.off('mouseover.hints').off('mouseleave.hints');
                hint.remove();
            });
        }
    };
});;/**
 *  @ngdoc directive
 *  @name jsPlaceholder
 *  @restrict E
 *
 *  @description js-placeholder. По клику ставится фокус в элемент с заданным name
 *
 *  @param {string} [jsPlaceholder] Name элемента, в который нужно установить фокус
 *
 *  TODO: требует доработки
 */
actiGuide.mainModule.directive('jsPlaceholder', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            var parent = $element.parents('form').length ? $element.parents('form') : 'body';
            $element.on('click', function() {
                $('[name="' + $attrs.jsPlaceholder + '"]', parent).focus();
            });
        }
    };
});;/**
 *  @ngdoc directive
 *  @name kladr
 *  @restrict E
 *
 *  @description КЛАДР
 *
 *  TODO: вынести класс inputCover в сервис
 *  TODO: объеденить подключение автокомплита к инпутам
 */
actiGuide.mainModule.directive('kladr', function (VIEWS_PATH) {
        var inputCover = new function () {
            return {
                create: createCover,
                remove: removeCover,
                $create: $createCover,
                $remove: $removeCover
            };

            function createCover(element, text, className) {
                var wrapper = document.createElement("div");
                wrapper.style.position = "relative";
                wrapper.setAttribute("data-type", "wrapper");
                element.parentNode.insertBefore(wrapper, element);
                wrapper.appendChild(element);

                var valueText = document.createElement("span");
                valueText.style.position = "absolute";
                valueText.style.left = "-9999px";
                copyFontStyle(element, valueText);
                valueText.innerHTML = element.value + "&nbsp;&nbsp;";
                document.body.appendChild(valueText);

                var cover = document.createElement("div"),
                    offset = valueText.clientWidth;

                document.body.removeChild(valueText);

                if (element.clientWidth < offset)
                    return;

                cover.style.position = "absolute";
                cover.style.left = offset + "px";
                cover.style.top = 0;
                cover.style.overflow = "hidden";
                cover.style.cursor = "text";

                cloneMetrics(element, cover, offset);

                if (className) cover.className = className;
                cover.innerHTML = text;

                cover.onclick = function () {
                    element.focus();
                };

                $(cover).on('mousedown', function () {
                    $('body').addClass('no-select');
                });

                wrapper.appendChild(cover);
            }

            function cloneMetrics(sourse, destination, offset) {
                var computedStyle = window.getComputedStyle ? getComputedStyle(sourse, "") : sourse.currentStyle,
                    width = parseInt(computedStyle.width, 10);

                if (isNaN(width))
                    width = sourse.clientWidth;

                destination.style.mozBoxSizing = computedStyle.mozBoxSizing;
                destination.style.webkitBoxSizing = computedStyle.webkitBoxSizing;
                destination.style.boxSizing = computedStyle.boxSizing;

                destination.style.width = width - offset + "px";
                destination.style.height = computedStyle.height;
                destination.style.lineHeight = computedStyle.height;
                //    parseInt(computedStyle.height, 10) - parseInt(computedStyle.paddingTop, 10) - parseInt(computedStyle.paddingBottom, 10) + "px";
                destination.style.marginLeft = computedStyle.marginLeft;
                destination.style.marginRight = computedStyle.marginRight;
                destination.style.marginTop = computedStyle.marginTop;
                destination.style.marginBottom = computedStyle.marginBottom;
                destination.style.borderLeftWidth = computedStyle.borderLeftWidth;
                destination.style.borderRightWidth = computedStyle.borderRightWidth;
                destination.style.borderTopWidth = computedStyle.borderTopWidth;
                destination.style.borderBottomWidth = computedStyle.borderBottomWidth;
                destination.style.paddingLeft = computedStyle.paddingLeft;
                destination.style.paddingRight = computedStyle.paddingRight;
                destination.style.paddingTop = computedStyle.paddingTop;
                destination.style.paddingBottom = computedStyle.paddingBottom;
            }

            function copyFontStyle(sourse, destination) {
                var computedStyle = window.getComputedStyle ? getComputedStyle(sourse, "") : sourse.currentStyle;

                destination.style.fontFamily = computedStyle.fontFamily;
                destination.style.fontSize = computedStyle.fontSize;
                destination.style.fontStyle = computedStyle.fontStyle;
            }

            function removeCover(element) {
                var wrapper = element.parentNode;
                if (wrapper.getAttribute("data-type") != "wrapper")
                    return;

                var parent = wrapper.parentNode;
                //caretPostion = Extensions.CaretPosition.get(element);
                parent.insertBefore(element, wrapper);
                parent.removeChild(wrapper);
                element.focus();
                //Extensions.CaretPosition.set(element, caretPostion);
            }

            function $createCover($element, text, className) {
                return $element.each(function () {
                    createCover(this, text, className);
                });
            }

            function $removeCover($element) {
                return $element.each(function () {
                    removeCover(this);
                });
            }
        };

        return {
            restrict: 'E',
            //require: 'ngModel',
            scope: {
                Adress: '=adress',
                label: '@'
            },
            link: function (scope, element, attrs) {
                var cityInput = $('.js-kladr-city-input', element),
                    cityInputParent = cityInput.parent('.input-block'),
                    streetInput = $('.js-kladr-street-input', element),
                    streetInputParent = streetInput.parent('.input-block'),
                    rajonInput = $('.js-kladr-rajon-input', element),
                    rajonInputParent = rajonInput.parent('.input-block'),
                    regionInput = $('.js-kladr-region-input', element),
                    regionInputParent = regionInput.parent('.input-block'),
                    inputCollection = cityInput.add(streetInput).add(rajonInput).add(regionInput),
                    inputParentCollection = inputCollection.parent('.input-block'),
                    domInput = $('.js-kladr-dom-input', element);

                inputCollection.on('focus', function () {
                    inputParentCollection.css('position', 'static');
                    $(this).parent('.input-block').css('position', 'relative');
                });

                cityInput.autocomplete({
                    serviceUrl: cityInput.data('autocomplete-url'),
                    type: 'POST',
                    dataType: 'json',
                    paramName: 'name',
                    maxHeight: 'auto',
                    deferRequestBy: 200,
                    minChars: 3,
                    tabDisabled: true,
                    autoSelectFirst: true,
                    preventBadQueries: false,
                    triggerSelectOnValidInput: false,
                    transformResult: function (response) {
                        return {
                            suggestions: $.map(response, function (item) {
                                return { value: item.Label, data: item };
                            })
                        };
                    },
                    appendTo: cityInputParent,
                    onSelect: function (suggestion) {
                        onSelectCity(suggestion);

                        streetInput.focus();
                    },
                    onSearchComplete: function (query, suggestions) {
                        if (suggestions.length == 0) {
                            setEmptyCodes();
                        } else if (suggestions.length == 1) {
                            cityInput.off('focusout.selectOneItem').one('focusout.selectOneItem', function () {
                                onSelectCity(suggestions[0]);
                            });
                        } else {
                            scope.$apply(scope.isNoneRegion = false);
                        }
                    },
                    beforeRender: function (container) {
                        inputCover.$remove(cityInput);
                    }
                });

                streetInput.autocomplete({
                    serviceUrl: streetInput.data('autocomplete-url'),
                    type: 'POST',
                    dataType: 'json',
                    paramName: 'name',
                    maxHeight: 'auto',
                    deferRequestBy: 200,
                    minChars: 3,
                    tabDisabled: true,
                    autoSelectFirst: true,
                    preventBadQueries: false,
                    triggerSelectOnValidInput: false,
                    params: {
                        regioncode: 0,
                        rajoncode: 0,
                        citycode: 0,
                        towncode: 0
                    },
                    transformResult: function (response) {
                        return {
                            suggestions: $.map(response, function (item) {
                                return { value: item.Label, data: item };
                            })
                        };
                    },
                    appendTo: streetInputParent,
                    onSelect: function (suggestion) {
                        scope.Adress.Street = suggestion.data.Street;
                        scope.Adress.Street.Name = suggestion.value;

                        scope.$apply();

                        domInput.focus();
                    },
                    onSearchStart: function (query) {

                    },
                    onSearchComplete: function (query, suggestions) {
                        if (suggestions.length == 0) {
                            scope.Adress.Street.Code = scope.Adress.Street.CodeType = 0;
                            scope.Adress.Street.NameType = null;
                            scope.$apply();
                        } else if (suggestions.length == 1) {
                            streetInput.off('focusout.selectOneItem').one('focusout.selectOneItem', function () {
                                scope.Adress.Street = suggestions[0].data.Street;

                                scope.$apply();
                            });
                        }
                    }
                });

                rajonInput.autocomplete({
                    serviceUrl: rajonInput.data('autocomplete-url'),
                    type: 'POST',
                    dataType: 'json',
                    paramName: 'name',
                    maxHeight: 'auto',
                    deferRequestBy: 200,
                    minChars: 3,
                    tabDisabled: true,
                    preventBadQueries: false,
                    triggerSelectOnValidInput: false,
                    params: {
                        regioncode: 0,
                        rajoncode: 0,
                        citycode: 0,
                        towncode: 0
                    },
                    transformResult: function (response) {
                        return {
                            suggestions: $.map(response, function (item) {
                                return { value: item.Label, data: item };
                            })
                        };
                    },
                    appendTo: rajonInputParent,
                    onSelect: function (suggestion) {
                        scope.Adress.Rajon = suggestion.data.Rajon;
                        scope.Adress.Region = suggestion.data.Region;

                        scope.$apply();

                        streetInput.focus();
                    },
                    onSearchStart: function (query) {

                    },
                    onSearchComplete: function (query, suggestions) {
                        if (suggestions.length == 0) {
                            scope.Adress.Rajon.Code = scope.Adress.Rajon.CodeType = 0;
                            scope.Adress.Rajon.NameType = null;
                            scope.$apply();
                        } else if (suggestions.length == 1) {
                            rajonInput.off('focusout.selectOneItem').one('focusout.selectOneItem', function () {
                                scope.Adress.Rajon = suggestions[0].data.Rajon;
                                scope.Adress.Region = suggestions[0].data.Region;

                                scope.$apply();
                            });
                        }
                    }
                });

                regionInput.autocomplete({
                    serviceUrl: regionInput.data('autocomplete-url'),
                    type: 'POST',
                    dataType: 'json',
                    paramName: 'name',
                    maxHeight: 'auto',
                    deferRequestBy: 200,
                    minChars: 3,
                    tabDisabled: true,
                    preventBadQueries: false,
                    triggerSelectOnValidInput: false,
                    transformResult: function (response) {
                        return {
                            suggestions: $.map(response, function (item) {
                                return { value: item.Label, data: item };
                            })
                        };
                    },
                    appendTo: regionInputParent,
                    onSelect: function (suggestion) {
                        scope.Adress.Rajon = suggestion.data.Rajon;
                        scope.Adress.Region = suggestion.data.Region;

                        scope.$apply();

                        rajonInput.focus();
                    },
                    onSearchStart: function (query) {

                    },
                    onSearchComplete: function (query, suggestions) {
                        if (suggestions.length == 0) {
                            scope.Adress.Region.Code = scope.Adress.Region.CodeType = 0;
                            scope.Adress.Region.NameType = null;
                            scope.$apply();
                        } else if (suggestions.length == 1) {
                            regionInput.off('focusout.selectOneItem').one('focusout.selectOneItem', function () {
                                scope.Adress.Rajon = suggestions[0].data.Rajon;
                                scope.Adress.Region = suggestions[0].data.Region;

                                scope.$apply();
                            });
                        }
                    }
                });

                scope.$watch('Adress', function (newValue, oldValue) {
                    if (newValue) {
                        var options = {
                            params: {
                                regioncode: scope.Adress.Region.Code,
                                rajoncode: scope.Adress.Rajon.Code,
                                citycode: scope.Adress.City.Code,
                                towncode: scope.Adress.Town.Code
                            }
                        };
                        streetInput.autocomplete('setOptions', options);
                        rajonInput.autocomplete('setOptions', options);

                        if (!newValue.CityTownName) {
                            scope.isNoneRegion = false;
                        }
                    }
                }, true);

                //удаляем вызов саджеста при фокусе
                inputCollection.off('focus.autocomplete');

                function onSelectCity(suggestion) {
                    scope.isNoneRegion = false;
                    scope.Adress.City = suggestion.data.City;
                    scope.Adress.Town = suggestion.data.Town;
                    scope.Adress.Rajon = suggestion.data.Rajon;
                    scope.Adress.Region = suggestion.data.Region;

                    if (suggestion.data.City.CodeType != 0) {
                        scope.Adress.CityTownName = suggestion.data.City.Name;
                    }
                    if (suggestion.data.Town.CodeType != 0) {
                        scope.Adress.CityTownName = suggestion.data.Town.Name;
                    }

                    scope.$apply();

                    inputCover.$remove(cityInput);
                    if (suggestion.data.Region.Code == 77 || suggestion.data.Region.Code == 78) {
                        //streetInput.focus();
                        return;
                    }

                    var cover = [];

                    if (suggestion.data.Region.CodeType != 0 && suggestion.data.Region.Name) cover.push(suggestion.data.Region.DisplayName || "");
                    if (suggestion.data.Rajon.CodeType != 0 && suggestion.data.Rajon.Name) cover.push(suggestion.data.Rajon.Name + " " + suggestion.data.Rajon.NameType);


                    inputCover.$create(cityInput, cover.join(", "), "text lightgray");
                }

                function setEmptyCodes() {
                    inputCover.$remove(cityInput);
                    scope.Adress.City.Code = scope.Adress.City.CodeType =
                        scope.Adress.Town.Code = scope.Adress.Town.CodeType =
                            scope.Adress.Rajon.Code = scope.Adress.Rajon.CodeType =
                                scope.Adress.Region.Code = scope.Adress.Region.CodeType =
                                    scope.Adress.Street.CodeType = 0;

                    scope.Adress.City.Name = null;

                    if (!scope.isNoneRegion) {
                        scope.Adress.Rajon.Name = scope.Adress.Region.Name = null;
                    }

                    scope.isNoneRegion = true;
                    scope.$apply();
                }

                scope.$on('$destroy', function () {
                    cityInput.autocomplete('dispose');
                    streetInput.autocomplete('dispose');
                    regionInput.autocomplete('dispose');
                    rajonInput.autocomplete('dispose');
                });
            },
            templateUrl: VIEWS_PATH + 'kladr.html',
            replace: true
        };
    });
;/**
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
 *  соответственно как {name}_Rub и {name}_Kop
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
            if (element.hasClass('select-dropdown')) return;

            var listItems = $('li:not(.list-title, .list-subtitle, .disabled)', element);
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

actiGuide.mainModule.directive('popupCaller', function ($document, layers) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
			angular.element(element).data('popupCaller', true);

			(function(attrs) {
				element.bind('click', function() {

					var popupElement = document.getElementById(attrs.popupCaller),
						popupScope = angular.element(popupElement).scope();

					/* Клик по элементу, вызывающему попап не из дерева активных слоёв игнорируется, передав при этом
					 управление слушателю кликов из сервиса layers */

					if (layers.layersList.length > 1 && !layers.isDownInTree(this)) {
						return;
					}

					/* Закрываем верхний слой, если он единственный и это не попап */

					if (layers.layersList.length == 1 && !angular.element(layers.layersList[0]).hasClass('popup')) {
						angular.element(layers.layersList[0]).scope().visible = false;
						layers.layersList.pop();
					}

					/* Делаем все нижние попапы невидимыми. Снова видимыми по закрытию верхних попапов они делаются в layers.popLastLayer() */

					angular.forEach(layers.layersList, function(item) {
						if (angular.element(item).hasClass('popup')) {
							angular.element(item).scope().visible = false;
						}
					});

					popupScope.visible = true;

					layers.layersList.push(popupElement);
					angular.element(element).data('targetPopup', popupElement);

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

actiGuide.mainModule.directive('popup', function (VIEWS_PATH) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: VIEWS_PATH + 'popup.html',
		replace: true,
		scope: true,
		controller: function($scope, $element, $attrs) {

			$scope.visible = false;

			/* Включаем параметры из popup-config в scope */

			if ($attrs.popupConfig) {
				var conf = JSON.parse($attrs.popupConfig);
				for (var i in conf) {
					if (conf.hasOwnProperty(i)) {
						$scope[i] = conf[i];
					}
				}
			}

			if ($scope.menu && !$scope.currentSection) {
				$scope.currentSection = $scope.menu[0];
			}

			$scope.setSection = function() {
				if (this.item.type !== 'divider') {
					$scope.currentSection = this.item;
				}
			};

		}
	}
}).directive('popupSection', function () {
	return {
		restrict: 'E',
		transclude: true,
		template: '<div ng-show="section === currentSection" ng-transclude />',
		replace: true,
		scope: true,
		controller: function($scope, $element, $attrs) {
			var $parent = angular.element($element).parent(),
				$parentScope = $parent.scope();

			$scope.section = $attrs.anchor;

			$parentScope.$watch('[currentSection, visible]', function() {
				if ($parentScope.visible) {
					touchSection();
				}
			}, true);

			function touchSection() {
				$scope.currentSection = $parentScope.currentSection.anchor;

				if ($scope.currentSection == $attrs.anchor) {
					if (typeof $scope[$attrs.onOpen] === 'function'){
						$scope[$attrs.onOpen]();
					}
				}
			}
		}
	}
});;/**
 *  @ngdoc directive
 *  @name select
 *  @restrict E
 *
 *  @description Кастомизированный селект.
 *
 *  @param {string} [autofocus] Указывается id элемента, в который нужно поставить фокус, после выбора значения из селекта
 *  @param {string} [autofocusList] Указывается список id элементов, фокус будет установлен в первый видимый элемент из списка
 *
 */
actiGuide.mainModule.directive('select', function ($timeout) {
    return {
        require: '?ngModel',
        restrict: 'E',
        link: function ($scope, $element, $attrs, ctrl) {
            var autofocus;
            if ($attrs.autofocus) {
                autofocus = function () {
                    $('#' + $attrs.autofocus).focus();
                };
            }

            if ($attrs.autofocusList) {
                autofocus = function () {
                    $($attrs.autofocusList).filter(':visible:first').focus();
                };
            }


            $element.coreUISelect({
                onClose: autofocus ? autofocus : null,
                onChange: $attrs.change ? $scope[$attrs.change] : null
            });

            if (ctrl) {
                var origRender = ctrl.$render;
                ctrl.$render = function () {
                    origRender();
                    return $element.coreUISelect('update');
                };
            }

            if ($attrs.ngOptions) {
                var optionList = $attrs.ngOptions.slice($attrs.ngOptions.lastIndexOf(' '));

                return $scope.$watch(optionList, function (newValue, oldValue) {
                    if (newValue) {
                        $element.coreUISelect('update');
                    }
                }, true);
            }
        }
    };
});;/**
 *  @ngdoc directive
 *  @name splitFields
 *  @restrict A
 *
 *  @description Директива для сплит полей. Вешается на родителя. Между полями можно переходить с помощью стрелок влево/вправо.
 *
 */
actiGuide.mainModule.directive('splitFields', function ($caretPosition, $timeout) {
    return {
        restrict: 'A',
        priority: 900,
        link: function (scope, element, attrs) {
            var fields = element.find('input:visible');

            if (fields.length < 2) return;

            //управление стрелками
            fields.each(function (index, item) {
                $(item).on('keydown', function (event) {
                    var key = event.keyCode,
                        caretPosition = $caretPosition.get(this),
                        valueLength = this.value.length;

                    if (key == 39 && caretPosition == valueLength && fields[index + 1]) {
                        $timeout(function() {
                            $caretPosition.set(fields[index + 1], 0);
                        }, 1);
                    }
                    if (key == 37 && caretPosition == 0 && fields[index - 1]) {
                        $timeout(function () {
                            $caretPosition.set(fields[index - 1], fields[index - 1].value.length);
                        }, 1);
                    }
                });

                var maxlength = $(this).attr('maxlength');
                if(maxlength) {
                    $(item).on('keyup', function (event) {
                        var key = event.keyCode;

                        if (key == 39 || key == 37) return;

                        if (maxlength == $(this).val().length && fields[index + 1]) {
                            $timeout(function() {
                                $caretPosition.set(fields[index + 1], 0);
                            }, 1);
                        }
                    });
                }
            });
        }
    };
});;/**
 *  @ngdoc directive
 *  @name switcher
 *  @restrict A
 *
 *  @description Переключатели
 *
 *
 */
actiGuide.mainModule.directive('switcher', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modelValue: '=ngModel'
        },
        controller: function ($scope, $element, $attrs) {
            var items = $scope.items = [];

            this.select = function (item) {
                angular.forEach(items, function (item) {
                    item.selected = false;
                });
                item.selected = true;

                if (angular.isDefined(item.modelValue)) {
                    $scope.modelValue = item.modelValue;

                } else if (item.handler) item.handler();
            };

            $scope.selectByValue = function () {
                var currentItem;
                angular.forEach(items, function (item) {
                    item.selected = false;

                    if (item.modelValue === 'true') item.modelValue = true;
                    if (item.modelValue === 'false') item.modelValue = false;

                    if (item.modelValue === $scope.modelValue) currentItem = item;
                });

                if (currentItem) {
                    currentItem.selected = true;
                    if (currentItem.handler) currentItem.handler();
                }
            };

            this.addItem = function (item, element, isDefault) {
                if (items.length == 0) this.select(item);
                if (isDefault) this.select(item);
                items.push(item);
            };
        },
        link: function($scope, $element, $attrs) {
            if ($attrs.ngModel) {
                $scope.$watch('modelValue', function(newValue) {
                    $scope.selectByValue();
                });
            }
        },
        template: '<div class="tab-btn-box" data-ng-transclude></div>',
        replace: true
    };
}).directive('item', function () {
    return {
        require: '^switcher',
        restrict: 'E',
        transclude: true,
        scope: {
            handler: '&',
            isDefault: '@',
            modelValue: '@'
        },
        link: function (scope, element, attrs, switcherCtrl) {
            switcherCtrl.addItem(scope, attrs.isDefault);

            scope.select = switcherCtrl.select;
        },
        template: '<button class="tab-btn" data-ng-class="{ active: selected }" data-ng-click="select(this)" data-ng-transclude></button>',
        replace: true
    };
});
;/**
 *  @ngdoc directive
 *  @name tabs
 *  @restrict E
 *
 *  @description Табы
 *
 *
 */
actiGuide.mainModule.directive('tabs', function (VIEWS_PATH, $timeout, layers) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modelValue: '=ngModel'
        },
        controller: function ($scope, $element, $attrs) {
            var tabs = $scope.tabs = [];

            $scope.select = function (tab) {
                angular.forEach(tabs, function (tab) {
                    tab.selected = false;
                });
                tab.selected = true;

                if (tab.handler) tab.handler();
            };

            this.addTab = function (tab, element, isDefault) {
                if (tabs.length == 0) $scope.select(tab);
                if (isDefault) $scope.select(tab);
                tabs.push(tab);
            };
        },
        link: function($scope, $element, $attrs) {
            if ($element.hasClass('nav-tabs')) {

                var boxWidth = $element.width(),
                    elementsWidthArray = [],
                    elementsWidth = 0;

                $timeout(function (){
                    $('button', $element).each(function (index, item){
                        var width = $(item).outerWidth();
                        elementsWidthArray.push({
                            element: item,
                            width: width,
                            hidden: false
                        });
                    });

                    var length = elementsWidthArray.length,
                        btnMoreWidth = $('.fake-btn',$element).outerWidth();

                    calculateTabsWidth();

                    $(window).on('resize', function () {
                        calculateTabsWidth();
                        $scope.$apply();
                    });

                    $scope.checkHiddenList = function (){
                        return $scope.hiddenList.some(function (item){
                            return item.selected;
                        });
                    };

                    $scope.selectHiddenItem = function (){
                        layers.popLastLayer();
                    };

                    function calculateTabsWidth () {

                        $scope.hiddenList = [];
                        elementsWidth = 0;
                        boxWidth = $element.width();

                        angular.forEach(elementsWidthArray, function (item){
                            item.hidden = false;
                            elementsWidth += item.width;
                        });

                        elementsWidth += btnMoreWidth;

                        if (elementsWidth > boxWidth) {
                            var i = 1;

                            elementsWidthArray[length - i].hidden = true;
                            i++;
                            elementsWidthArray[length - i].hidden = true;

                            elementsWidth = 0;
                            angular.forEach(elementsWidthArray, function (item){
                                if (!item.hidden) {
                                    elementsWidth += item.width;
                                }
                            });
                            elementsWidth += btnMoreWidth;

                            while (elementsWidth > boxWidth) {
                                elementsWidth = 0;
                                elementsWidthArray[length - i++].hidden = true;
                                angular.forEach(elementsWidthArray, function (item){
                                    if (!item.hidden) {
                                        elementsWidth += item.width;
                                    }
                                });
                                elementsWidth += btnMoreWidth;
                            }
                        }

                        angular.forEach($scope.tabs, function(item, index){
                            item.hidden = elementsWidthArray[index].hidden;

                            if (item.hidden) {
                                $scope.hiddenList.push(item);
                            }
                        });

                    };
                });
            }
        },
        templateUrl: VIEWS_PATH + 'tabs.html',
        replace: true
    };
}).directive('tab', function () {
    return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            handler: '&',
            isDefault: '@',
            modelValue: '@'
        },
        link: function (scope, element, attrs, tabsCtrl) {
            tabsCtrl.addTab(scope, attrs.isDefault);
        },
        template: '<div data-ng-show="selected" data-ng-transclude></div>',
        replace: true
    };
});
;/**
 *  @ngdoc directive
 *  @name tipBox
 *  @restrict E
 *
 *  @description Директива блока. Стилевое оформление указывается с помощью классов.
 *
 *  @param {string} [closeBtn] Показываем ссылку "Скрыть", если указан параметр
 *
 */
actiGuide.mainModule.directive('tipBox', function (VIEWS_PATH) {
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
		templateUrl: VIEWS_PATH + 'tipbox.html'
	};
});
;/**
 *  @ngdoc directive
 *  @name modifier
 *  @restrict A
 *
 *  @description Директива для модификаторов.
 *
 */
actiGuide.mainModule.directive('modifier', function ($filter, $caretPosition) {
    //TODO: избавиться от создания нового экземпляра caretPositionController при каждом событии input. Возможно вынести caretPositionController в отдельный сервис.
    var caretPositionController = function (textField, value) {

        this._textField = textField;

        if (value !== undefined) {
            this._textField.value = value;
        }

        this._value = this._textField.value;
        this._caretPosition = $caretPosition.get(this._textField);


        this.getValue = function () {
            return this._value;
        };

        this.append = function (position, string) {
            if (this._caretPosition >= position) this._caretPosition += string.length;
            this._value = this._value.substring(0, position) + string + this._value.substring(position);
        };

        this.remove = function (position, count) {
            if (this._caretPosition > position + count) this._caretPosition -= count;
            else if (this._caretPosition > position) this._caretPosition = position;

            if (isNaN(count)) count = this._value.length - position;
            this._value = this._value.substring(0, position) + this._value.substring(position + count);
        };

        this.replace = function (pattern, replacer) {
            this._replaceWith = angular.isFunction(replacer) ? replacer : function () { return replacer; };

            this._replacePositionOffset = 0;
            this._value.replace(pattern, this._replaceHandler);
        };

        this._replaceHandlerSource = function (substring) {
            var replaceWith = this._replaceWith.apply(null, arguments);
            var position = arguments[arguments.length - 2] - this._replacePositionOffset;
            var removeCount = substring.length;
            this.remove(position, removeCount);
            this._replacePositionOffset += removeCount;
            this.append(position, replaceWith);
        };

        this._replaceHandler = this._replaceHandlerSource.bind(this);
        this._replaceWith = null;
        this._replacePositionOffset = null;

        this.mask = function (mask, maskedChar) {
            mask = String(mask);
            maskedChar = maskedChar || "x";

            var maskedValue = "",
                valueCursor = 0,
                maskCursor = 0,
                maskChar,
                valueChar,
                originCaretPosition = this._caretPosition;

            if (this._value.length > 0) {
                //var is = (valueCursor + 1 < this._value.length || valueCursor < this._value.length)

                while (maskCursor < mask.length && valueCursor < this._value.length) {
                    maskChar = mask.charAt(maskCursor++),
                        valueChar = this._value.charAt(valueCursor);

                    if (maskChar == maskedChar || maskChar == valueChar) {
                        if (this._value.length > valueCursor) {
                            maskedValue += this._value.charAt(valueCursor++);
                        }
                    } else {
                        maskedValue += maskChar;
                        if (valueCursor < originCaretPosition) this._caretPosition++;
                    }
                }
            }
            this._value = maskedValue;
        };

        this.updateCaretPosition = function () {
            $caretPosition.set(this._textField, this._caretPosition);
        };

        this.getCaretPosition = function () {
            return this._caretPosition;
        };
    };

    function getChar(event) {
        if (event.which == null) {  // IE
            if (event.keyCode < 32) return null; // спец. символ
            return String.fromCharCode(event.keyCode);
        }

        if (event.which != 0 && event.charCode != 0) { // все кроме IE
            if (event.which < 32) return null; // спец. символ
            return String.fromCharCode(event.which); // остальные
        }

        return null; // спец. символ
    }

    var modifierTypes = {
        RegExpFilter: function (option, element) {
            if (!option) return;

            var regExpSingle = new RegExp(option),
                regExpGlobal = new RegExp(option, 'g');

            if (element) {
                //                element.on('keypress', function (e) {

                //                    var symbol = getChar(e);

                //                    if (e.ctrlKey || e.altKey || e.metaKey) return;

                //                    if (!symbol) return;

                //                    if (regExpSingle.test(symbol)) {
                //                        e.preventDefault();
                //                        return false;
                //                    }
                //                });
            }

            this.modify = function (value) {
                value.replace(regExpGlobal, "");
            };
        },
        Mask: function (option, element) {
            this.modify = function (value) {
                value.mask(option);
            };
        },
        DigitMask: function (option, element, ngModelCtrl) {
            var _this = this;

            this.modify = function (value) {
                value.mask(option);
            };

            ngModelCtrl.$parsers.unshift(function (viewValue) {
                if (!viewValue) return viewValue;
                viewValue = $filter('getDigits')(viewValue);
                return viewValue;
            });

            ngModelCtrl.$formatters.unshift(function (modelValue) {
                if (!modelValue) return modelValue;
                var value = new caretPositionController(element.get(0), modelValue);

                _this.modify(value);
                return value.getValue();
            });
        },
        Money: function (option, element, ngModelCtrl) {
            this.modify = function (value) {
                var string = value.getValue();

                string = $filter('getDigits')(string);
                string = $filter('currency')(string);

                value.remove(0);
                value.append(0, string);
            };

            if (!ngModelCtrl) return;

            ngModelCtrl.$parsers.push(function (viewValue) {
                if (!viewValue) return viewValue;
                viewValue = $filter('getDigits')(viewValue);
                return viewValue;
            });

            ngModelCtrl.$formatters.push(function (modelValue) {
                if (!modelValue) return modelValue;
                modelValue = $filter('currency')(modelValue);
                return modelValue;
            });
        },
        Decimal: function (option, element, ngModelCtrl) {
            this.modify = function (value) {
                var string = value.getValue();

                if (string > 1000000 || string === '1000000.' || string === '1000000,' || (!/^\d{1,7}([\.,])?$/.test(string) && !/^\d{1,7}([\.,]\d{1,3})?$/.test(string))) {
                    value.remove(string.length - 1);
                }

                var separator = value.getValue().indexOf(',') == -1 ? '.' : ',';
                string = value.getValue().split(separator);

                string[0] = string[0].replace('\s', '');
                string[0] = $filter('currency')(string[0]);

                value.remove(0);
                value.append(0, string.join(separator));
            };

            element.on('focusout', function () {
                var value = $(this).val();

                if (value != '' && value.indexOf(',') != -1) {
                    ngModelCtrl.$setViewValue(value.replace(',', '.'));
                    $(this).val(value.replace(',', '.'));
                }
            });

            if (!ngModelCtrl) return;

            ngModelCtrl.$parsers.push(function (viewValue) {
                if (!viewValue) return viewValue;
                return parseFloat(viewValue.replace(/\s/g, ''));
            });

            ngModelCtrl.$formatters.push(function (modelValue) {
                if (!modelValue) return modelValue;
                //modelValue = $filter('currency')(modelValue);
                return modelValue;
            });
        },
        Range: function (option, element, ngModelCtrl) {
            option = option.split('-');

            element.on('focusout', function () {
                var value = $(this).val();

                if (value != '' && option[0] > parseFloat(value)) {
                    ngModelCtrl.$setViewValue(String(option[0]));
                    $(this).val(option[0]);
                }
            });

            this.modify = function (value) {
                var gValue = value.getValue();
                gValue = gValue.replace(',', '.');

                if (option[1] < parseFloat(gValue))
                    value.replace(value.getValue(), String(option[1]));

                if (option[0].length == gValue.length && option[0] > parseFloat(gValue) && gValue != '')
                    value.replace(value.getValue(), String(option[0]));
            };
        },
        RangeFloat: function (option, element, ngModelCtrl) {
            option = option.split('-');

            element.on('focusout', function () {
                var value = $(this).val();

                if (value != '' && option[0] > parseFloat(value)) {
                    ngModelCtrl.$setViewValue(String(option[0]));
                    $(this).val(option[0]);
                }
            });

            this.modify = function (value) {
                var gValue = value.getValue();
                if (option[1] <= parseFloat(gValue))
                    value.replace(value.getValue(), String(option[1]));

                if (option[0].length == gValue.length && option[0] >= parseFloat(gValue) && gValue != '')
                    value.replace(value.getValue(), String(option[0]));

                var parsegValue = gValue.split(/[.,]/);
                if ((parsegValue[1] && parsegValue[1].length > option[2]) || parsegValue.length==3) {
                    value.replace(value.getValue(), gValue.substr(0, gValue.length-1));
                }
            };
        },
        EnToRu: function (option, element) {
            if (!this.lastEvent) {
                element.on("keydown", function (event) {
                    this.lastEvent = event;
                } .bind(this));
            }
            this.apostrophePosition = [];

            this.enToRuDictionary = {
                "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г", "i": "ш", "o": "щ", "p": "з",
                "a": "ф", "s": "ы", "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д",
                "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и", "n": "т", "m": "ь",
                "Q": "Й", "W": "Ц", "E": "У", "R": "К", "T": "Е", "Y": "Н", "U": "Г", "I": "Ш", "O": "Щ", "P": "З",
                "A": "Ф", "S": "Ы", "D": "В", "F": "А", "G": "П", "H": "Р", "J": "О", "K": "Л", "L": "Д",
                "Z": "Я", "X": "Ч", "C": "С", "V": "М", "B": "И", "N": "Т", "M": "Ь"
            };

            this.lastEvent = false;

            this.modify = function (value) {

                var self = this,
                    preLastSymbol = value._value[value._caretPosition - 2],
                    lastSymbol = value._value[value._caretPosition - 1],
                    lastSymbolCode = lastSymbol && lastSymbol.charCodeAt(0);

                // Берём во внимание keyCode события keyPress для определения текущей раскладки

                $(value._textField).off("keypress").on("keypress", function (e) {
                    self.lastKeypressCode = e.keyCode;
                }.bind(this));
                if (!self.lastKeypressCode) {
                    self.lastKeypressCode = lastSymbolCode;
                }


                // Берём во внимание keyCode собыитя keyDown

                if (!this.lastKeydownCode) {
                    $(value._textField).on("keydown", function (e) {
                        this.lastKeydownCode = e.keyCode;
                    }.bind(this));
                }


                // Делаем предположение о текущей раскладке

                if (self.lastKeypressCode >= 65 && self.lastKeypressCode <= 90 || self.lastKeypressCode >= 97 && self.lastKeypressCode <= 122) {
                    self.suggestedLayout = 'en';
                }
                if (self.lastKeypressCode >= 1040 && self.lastKeypressCode <= 1071 || self.lastKeypressCode >= 1072 && self.lastKeypressCode <= 1103) {
                    self.suggestedLayout = 'ru';
                }


                // Исключение невозможных кейсов

                if (self.suggestedLayout === 'ru' && lastSymbol === ',' ||
                    self.suggestedLayout === 'ru' && lastSymbol === "'" ||
                    self.suggestedLayout === 'ru' && lastSymbol === '"') {
                    self.suggestedLayout = 'en';
                }


                var layoutChanged = self.prevLayout && self.prevLayout != self.suggestedLayout;


                // Производим замену, если последнее нажатие не на "backspace"

                if (this.lastKeydownCode != 8) {
                    if (lastSymbol === ';') {
                        substituteSymbol('ж');
                    } else if (lastSymbol === ':') {
                        substituteSymbol('Ж');
                    } else if (lastSymbol === '>') {
                        substituteSymbol('Ю');
                    } else if (lastSymbol === '.' && self.suggestedLayout === 'en') {
                        substituteSymbol('ю');
                    } else if (lastSymbol === ',') {
                        substituteSymbol('б');
                    } else if (lastSymbol === '<') {
                        substituteSymbol('Б');
                    } else if (lastSymbol === '`') {
                        substituteSymbol('ё');
                    } else if (lastSymbol === '~') {
                        substituteSymbol('Ё');
                    } else if (lastSymbol === ']') {
                        substituteSymbol('ъ');
                    } else if (lastSymbol === '}') {
                        substituteSymbol('Ъ');
                    } else if (lastSymbol === '[') {
                        substituteSymbol('х');
                    } else if (lastSymbol === '{') {
                        substituteSymbol('Х');
                    } else if (lastSymbol === "'") {
                        substituteSymbol('э');
                    } else if (self.lastKeydownCode !== 50 && lastSymbol === '"') {
                        substituteSymbol('Э');
                    } else if (lastSymbol === '@') {
                        substituteSymbol('"');
                        //            } else if (lastSymbol === '/') {
                        //                substituteSymbol('.');
                    } else {
                        value.replace(/[a-zA-Z]/g, function (x) {
                            return self.enToRuDictionary[x];
                        });
                        self.busy = false;
                    }
                }

                function substituteSymbol(symbol) {
                    value.remove(value.getCaretPosition() - 1, 1);
                    value.append(value.getCaretPosition(), symbol);
                    self.busy = false;
                }


                // Частный случай для "Э" и апострафа

                if (value._caretPosition > 1 &&
                    layoutChanged &&
                    (!preLastSymbol || preLastSymbol != "'") &&
                    (lastSymbol === "'" || lastSymbol === 'э' || lastSymbol === '"' || lastSymbol === 'Э') &&
                    (value._value[value._caretPosition] != "'" && value._value[value._caretPosition - 1] != "'")
                    ) {
                    substituteSymbol("'");
                }


                // Запоминаем предыдущую раскладку
                self.prevLayout = self.suggestedLayout;

            };
        },
        Telefon: function (option, element, ngModelCtrl) {
            var _this = this;

            this.prefix = "8 ";

            this.modify = function (value) {
                value.replace(/[^\d]/g, "");
                value.replace(/^8/, "");
                value.mask("xxx xxx-xx-xx");
                value.append(0, "8 ");
            };

            ngModelCtrl.$parsers.unshift(function (viewValue) {
                if (!viewValue) return viewValue;
                return viewValue !== _this.prefix && viewValue !== _this.prefix.slice(0, _this.prefix.length - 1) ? $filter('getDigits')(viewValue.replace(_this.prefix, '')) : undefined;
            });

            ngModelCtrl.$formatters.unshift(function (modelValue) {
                modelValue = _this.prefix + (angular.isString(modelValue) ? modelValue : '');
                var value = new caretPositionController(element.get(0), modelValue);
                _this.modify(value);
                return value.getValue();
            });
        },
        FirstLetter: function (option, element) {
            this.modify = function (value) {
                value.replace(/^\s*([a-zа-я])/g, function ($1) {
                    return $1.toUpperCase();
                });
            };
        }
    };

    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var modifiers = element.data('modifier');
            element.modifierList = [];

            if (angular.isArray(modifiers)) {
                angular.forEach(modifiers, addModifier);
            }

            if (angular.isArray(element.modifierList)) {
                element.on('input', function (e) {
                    var value = new caretPositionController(this);

                    angular.forEach(element.modifierList, function (modifier) {
                        var originValue = value.getValue();
                        modifier.modify(value);
                        if (originValue !== value.getValue()) {
                            scope.$apply(function () {
                                element.val(value.getValue());
                                value.updateCaretPosition();
                                if (ngModelCtrl) {
                                    ngModelCtrl.$setViewValue(value.getValue());
                                }
                            });
                        }
                    });
                });
            }

            function addModifier(type) {
                type = type.split(':');

                element.modifierList.push(new modifierTypes[type[0]](type[1], element, ngModelCtrl));
            };
        }
    }
});
;/**
 *  @ngdoc directive validator
 *  @name checkRange
 *  @restrict A
 *
 *  @description Проверяет, находится ли значение в заданном диапазоне
 *
 */
actiGuide.mainModule.directive('checkRange', function () {

    var checkRange = function (value, min, max) {
        value = parseFloat(value);
        min = parseFloat(min);
        max = parseFloat(max);

        if (isNaN(value)) return true;

        if (!isNaN(min) && !isNaN(max)) {
            return min < value && max > value;
        } else if (!isNaN(min)) {
            return min < value;
        } else if (!isNaN(max)) {
            return max > value;
        }
    };

    return {
        require: '^ngModel',
        link: function (scope, elm, attrs, ngModelCtrl) {
            var params = attrs.checkRange;
            if (!params || elm.parent().data('zero-able')) return;

            params = params.split('-');

            ngModelCtrl.$parsers.unshift(function (viewValue) {
                ngModelCtrl.$setValidity('checkRange', checkRange(viewValue, params[0], params[1]));
                return viewValue;
            });

            ngModelCtrl.$formatters.unshift(function (modelValue) {
                ngModelCtrl.$setValidity('checkRange', checkRange(modelValue, params[0], params[1]));
                return modelValue;
            });
        }
    };
});/**
 *  @ngdoc directive
 *  @name validationTip
 *  @restrict A
 *
 *  @description Директива вешается на кнопку submit. При клике на кнопку показывается подсказка о невалидных полях и ставится фокус в первое невалидное поле
 *
 */
actiGuide.mainModule.directive('validationTip', function () {
    return {
        restrict: 'A',
        link: function ($scope, $element) {
            var parent = $element.parents('form').get(0) || $element.parents('.popup-modal').get(0) || $('body');
            $element.on('click', function() {
                $scope.$apply($scope.showTip = true);
                $('input.ng-invalid, textarea.ng-invalid, div.ng-invalid:not(.disabled) input', parent).not(':hidden, .disabled').first().focus();
            });
        }
    };
});

/**
 *  @ngdoc directive
 *  @name validationTip
 *  @restrict E
 *
 *  @description Подсказка о невалидных полях формы
 *
 */
actiGuide.mainModule.directive('validationTip', function (VIEWS_PATH) {
    return {
        priority: 900,
        require: '^form',
        scope: true,
        restrict: 'E',
        replace: true,
        link: function ($scope, $element, $attrs, formCtrl) {
            if (!formCtrl) return;

            $scope.tips = $scope.tips ? $scope.tips : [];

            angular.forEach(formCtrl, function(item) {
                if (angular.isObject(item) && item.$name) {
                    var tipText = item.$element ? item.$element.data('val-tip') : null;

                    if (tipText) {
                        $scope.tips.push({
                            $elName: item.$name,
                            $element: item.$element,
                            title: tipText,
                            showTip: item.$invalid
                        });

                        var currentIndex = $scope.tips.length - 1;

                        $scope.$watch(formCtrl.$name + '.' + item.$name + '.$invalid', function(newValue, oldValue) {
                            $scope.tips[currentIndex].showTip = newValue;

                            var isInvalid = false;
                            angular.forEach($scope.tips, function(tip) {
                                if (tip.showTip === true) {
                                    isInvalid = true;
                                }
                            });

                            $scope.isInvalid = isInvalid;
                        });
                    }
                }
            });

            $scope.$on('tipsChanged', function() {
                var isInvalid = false;
                angular.forEach($scope.tips, function(tip) {
                    if (tip.showTip === true) {
                        isInvalid = true;
                    }
                });

                $scope.isInvalid = isInvalid;
            });

            $scope.focusTo = function(tip) {
                if (tip.href) {
                    $scope[tip.href]($scope.popup);
                    return;
                }

                if (!tip.$element) return;

                angular.isString(tip.$element) ? $(tip.$element).first().focus() : tip.$element.focus();
            };
        },
        templateUrl: VIEWS_PATH + 'validationtip.html'
    };
});
;/**
 *  @ngdoc filter
 *  @name currency
 *
 *  @description Разбивает число по разрядам и округляет до второго знака
 *
 */
actiGuide.mainModule.filter('currency', function() {
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
});/**
 *  @ngdoc filter
 *  @name getDigits
 *
 *  @description Вырезает из строки все кроме цифр
 *
 */
actiGuide.mainModule.filter('getDigits', function() {
    return function(value) {
        if (!value || !String(value).match(/\d/g)) return value;
        return String(value).match(/\d/g).join('') || '';
    };
});actiGuide.mainModule.service('alertBox', function ($timeout) {
	var alertBoxes = [];

	return {
		push: function(text, config) {
			var additionalClasses = '';

			if (!config) {
				config = {};
			}

			if (document.getElementsByClassName('alert-box-wrap').length === 0) {
				angular.element(document.getElementsByTagName('BODY')).append('<div class="alert-box-wrap">');
			}

			if (config.color) {
				additionalClasses += ' ' + config.color;
			}

			var element = angular.element('<div class="alert-box' + additionalClasses + '">' + text + '</div>');

			if (config.target) {
				angular.element(document.getElementById(config.target)).html(element);
			} else {
				angular.element(document.getElementsByClassName('alert-box-wrap')).append(element);
			}

			$timeout(function() {
				element.addClass('opened');
			});

			var timeout = $timeout(function() {
				angular.element(element).removeClass('opened')
			}, config.timeout ? config.timeout : 3000);

			element.on('mouseover', function() {
				$timeout.cancel(timeout);
			});

			element.on('mouseout', function() {
				timeout = $timeout(function() {
					angular.element(element).removeClass('opened')
				}, config.timeout ? config.timeout : 3000);
			});
		}
	}
});;actiGuide.mainModule.factory('$caretPosition', function () {
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
}]);;actiGuide.mainModule.constant('VIEWS_PATH', 'js/app/modules/main/directives/views/');;/**
 *  @ngdoc service
 *  @name ranges
 *
 *  @description
 *  Сервис работы с периодами. Фундамент "умного календаря".
 *  Используется в директиве datepicker для получения заблокированных/активных периодов.
 *  К нему возможно получить доступ из любого контроллера для реализации сложных блокировок.
 */

;(function (ng, app) {

    /**
     * @author Vitaly Gridnev
     */

    app.service( 'ranges', ['$rootScope', function ($rootScope) {
        return new RangesService( $rootScope )
    } ] );

    var DATE_FORMAT = 'D.M.YYYY',// moment.js date format
        RANGE_TYPES = {},
        TODAY = moment();

    var RangesService = function ($scope) {

        var RANGES = [],
            DATEPICKERS = [],
            RANGE_MIN_VAL = moment( '01.01.1970', DATE_FORMAT ),
            RANGE_MAX_VAL = moment( '01.01.2100', DATE_FORMAT );


        /**
         * Добавляет период в сервис
         *
         * @param {Range} range
         * @returns {Range}
         */
        function addRange (range) {

            RANGES.push( range )
            return range

        }


        /**
         * Получение активного периода для конкретного дейтпикера
         *
         * @param datepicker имя дейтпикера
         * @param [date_selected] признак поиска активного периода, в который входит переданная дата
         * @returns {Range}
         */
        function getActiveRangeForDatepicker (datepicker, date_selected) {

            var _ranges = getRangesForDatepicker( datepicker ),
                date_selected = !!date_selected ? moment( date_selected, DATE_FORMAT ).toDate() : false,
                result = {
                    //from: RANGE_MIN_VAL.clone(),
                    //to: RANGE_MAX_VAL.clone()
                };


            _ranges.sort( function ( a, b ){
                return b.to.diff(b.from) > a.to.diff(a.from) ;
            })


            var __ranges = _ranges;

            for ( var i = 0, till = _ranges.length; i<_ranges.length; i++ ){

                var range1 = _ranges[i];

                for ( var j = i+1; j < till; j++ ){
                    var range2 = _ranges[j];

                    if ((range2.from.isSame(range1.from) || range2.from.isAfter(range1.from)) && (range2.to.isSame(range1.to) || range2.to.isBefore(range1.to))) {
                        __ranges = _.without(__ranges, range2);
                    }

                }


            }

            _ranges = __ranges;

            _ranges.sort( function (a, b) {

                var result = 0;

                if ( a.from.diff( b.from ) < 0 ) {
                    result = -1;
                } else if ( a.from.isSame( b.from ) ) {
                    if ( a.to.diff( b.to ) < 0 ) {
                        result = -1
                    } else
                        result = 1
                } else {
                    result = 1;
                }

                return result
            } )

            if ( date_selected ){
                if ( !_ranges[0].from.isSame( RANGE_MIN_VAL ) ) { // если период не сначала
                    if ( date_selected > RANGE_MIN_VAL.toDate() && date_selected < _ranges[0].from.toDate() ) { // если дата между минимумом и началом периода
                        result.from = RANGE_MIN_VAL.clone()
                        result.to = _ranges[0].from.clone();
                        return result;
                    }
                }
            }

            for ( var i = 0, till = _ranges.length - 1; i < till; i++ ) {

                var range1 = _ranges[i],
                    range2 = _ranges[i + 1];

                if ( range1.to.diff( range2.from ) < 0 ) { // если между ними есть разрыв
                    if ( date_selected ) {
                        if ( date_selected >= range1.to.toDate() && date_selected <= range2.from.toDate() ) { // если искомая дата входит в разрыв
                            result.from = range1.to;
                            result.to = range2.from;
                            break;
                        } else {
                            result.from = range2.to;
                        }
                    } else {
                        result.from = range1.to;
                        result.to = range2.from;
                        break;
                    }
                } else { // если нет разрыва
                    if ( range1.to.diff( range2.to ) < 0 ) { // если конец второго позже конца первого
                        result.from = range2.to;
                    } else {
                        if ( range1.from.diff( range2.from) < 0 ){
                            result.from = range1.to;
                        } else {
                            result.from = range2.to;
                        }
                    }
                }
            }


            result.from =  !!result.from ? result.from.clone() : RANGE_MIN_VAL.clone()
            result.to =  !!result.to ? result.to.clone() : RANGE_MAX_VAL.clone()

            return result
        }

        /**
         * Оповещаем об изменениях
         */
        function broadcastChange () {
            $scope.$broadcast( 'RangesChanged' )
        }


        function removeRange (range) {
            RANGES.splice( RANGES.indexOf( range ), 1 );
        }


        /**
         * сбросить периоды
         * @param {String} [type] название типа
         */
        function flush(type) {

            type = !!type ? type : undefined;

            var rangesToFlush = [];

            if (type) {

                rangesToFlush = _.filter(RANGES, function (range) {
                    return range.type == type
                });

                _.each(rangesToFlush, function (range) {
                    range.remove()
                })

            } else {
                // удаляем всё, кроме дефолтных ограничений
                var rangesToFlush = _.filter(RANGES, function (range) {
                    return range.type !== 'default'
                })

                _.each(rangesToFlush, function (range) {
                    range.remove()
                });

                broadcastChange();
            }
        }


        function getRangesForDatepicker (name) {

            var result = [];

            _.each( RANGES, function (range) {
                if ( !/datepicker/.test( range.type ) ) {
                    result.push( range )
                } else {
                    if ( range.type == 'datepicker_' + name ) {

                        if ( range.from === null ) {
                            range.from = RANGE_MIN_VAL.clone()
                        }

                        if ( range.to === null ) {
                            range.to = RANGE_MAX_VAL.clone();
                        }

                        result.push( range )
                    }
                }
            } )

            return result;
        }

        function isDateSelectable (date) {

            var datepicker = this,
                result = {
                    selectable: true,
                    message: ''
                },
                date = moment( date ),
                rangesToCheck = getRangesForDatepicker( datepicker );

            for ( var i in rangesToCheck ) {

                var range = rangesToCheck[i],
                    _d = date.toDate(),
                    _f = range.from.toDate(),
                    _t = range.to.toDate();

                if ( _d >= _f && _d <= _t ) {
                    result.selectable = false;
                    result.message = range.message;

                    break;
                }

            }

            return result;
        }


        /**
         * Создание зависимого периода
         * не отличается ничем, кроме типа, который устанавливается в 'datepicker_'+type
         *
         * @param from
         * @param to
         * @param type
         * @param message
         * @returns {Range}
         */
        function createDependentRange (from, to, type, message) {

            var range = createRange( from, to, type, message );

            range.type = 'datepicker_' + type;

            return range
        }


        /**
         * Парсинг даты
         * @param {Variant} obj может быть строкой, стампом с бэкэнда или объектом Moment JS
         * @returns {Moment}
         */
        function parseDate (obj) {

            if ( obj === null ) {
                return ''
            }

            // если строка
            if ( typeof obj == 'string' ) {

                var backendStampExp = /^\/Date\((\d+)\)\/$/, dependenceStampExp = /(\d+).(\d+).(\d+)/, date;

                if ( backendStampExp.test( obj ) ) {
                    date = new Date( parseInt( obj.match( backendStampExp )[1], 10 ) )
                } else if ( dependenceStampExp.test( obj ) ) {
                    var matches = obj.match( dependenceStampExp );
                    date = new Date( matches[3], matches[2] - 1, matches[1] )
                }
                return moment( new Date( date ) ).startOf( 'day' )
            }

            if ( moment.isMoment( obj ) ) {
                return obj.startOf( 'day' )
            }

            return ''
        }


        /**
         * Создаёт период
         *
         * @param {Variant} from дата начала, либо null, либо /Date/, либо moment
         * @param {Variant} to дата конца, либо null, либо /Date/, либо moment
         * @param {String} type тип периода
         * @param {String} message сообщение периода
         * @returns {Range}
         */
        function createRange (from, to, type, message) {


            var from = parseDate( from ),
                to = parseDate( to ),
                type = type,
                message = message;

            from = from == '' ? RANGE_MIN_VAL.clone() : from;
            to = to == '' ? RANGE_MAX_VAL.clone() : to;

            return {
                from: from,
                to: to,
                type: type,
                message: message,
                remove: function () {
                    removeRange( this )
                }
            }

        }

        /**
         * Понимает формат периодов с бэкэнда
         * Возвращает стандартный период
         *
         * @param _arr период с бэкэнда
         * @returns {Range}
         */
        function createBackendRange (_arr) {

            var from = _arr.DateStart,
                to = _arr.DateEnd,
                message = _arr.Reason;

            return createRange( from, to, 'backend', message )
        }


        /**
         * Возвращает весь список периодов
         * Для какого-нибудь хардкодинга
         *
         * @returns {Ranges[]}
         */
        function getList () {
            return RANGES;
        }


        /**
         * Добавляет в сервис ограничения по умолчанию
         */
        function addDefaultBounds () {

            var bounds = [];

            for ( var bound in bounds ) {
                addRange( bounds[bound] )
            }
        }


        function init () {

            addDefaultBounds()

            /**
             * @class RangesService
             * @constructor
             */
            return {
                addRange: addRange,
                removeRange: removeRange,
                createRange: createRange,
                createBackendRange: createBackendRange,
                broadcastChange: broadcastChange,
                getRangesForDatepicker: getRangesForDatepicker,
                getActiveRangeForDatepicker: getActiveRangeForDatepicker,
                createDependentRange: createDependentRange,
                isDateSelectable: isDateSelectable,
                flush: flush,
                getList: getList
            }
        }

        return init()
    }

}( angular, actiGuide.mainModule ));