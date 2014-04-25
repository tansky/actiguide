/**
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
