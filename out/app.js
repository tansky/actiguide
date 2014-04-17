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
;/**
 * jQuery CoreUISelect
 * Special thanks to Artem Terekhin, Yuriy Khabarov, Alexsey Shein
 *
 * @author      Gennadiy Ukhanov
 * @version     0.0.3
 */
(function ($) {

    var defaultOption = {
        appendToBody: false,
        jScrollPane: null,
        onInit: null,
        onFocus: null,
        onBlur: null,
        onOpen: null,
        onClose: null,
        onChange: null,
        onDestroy: null
    }

    var allSelects = [];

    $.browser.mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));
    $.browser.operamini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]";

    /**
     * CoreUISelect - stylized standard select
     * @constructor
     */
    function CoreUISelect(__elem, __options, __templates) {

        this.domSelect = __elem;
        this.settings = __options || defaultOption;
        this.isSelectShow = false;
        this.isSelectFocus = false;
        this.isJScrollPane = this.isJScrollPane();

        var autotestBut = '';
        var autotestItem = '';

        if ($(this.domSelect).attr('data-qa') != null) {
            autotestBut = "data-qa=" + $(this.domSelect).attr('data-qa') + ".but";
            autotestItem = "data-qa=" + $(this.domSelect).attr('data-qa') + ".item";
        }

        // templates
        this.templates = __templates ||
        {
            select: {
                container: '<div class="btn btn__select"></div>',
                value: '<span class="btn-in"' + autotestBut + '></span>',
                button: '<span class="btn-ugl"></span>'
            },
            dropdown: {
                container: '<div class="select-dropdown"></div>',
                wrapper: '<div class="select-dropdown-wrap"></div>',
                list: '<ul class="nav-list"></ul>',
                optionLabel: '<li class="select-item list-subtitle"></li>',
                item: '<li class="select-item" ' + autotestItem + '></li>'
            }
        };

        this.init(this.settings);
    }

    CoreUISelect.prototype.init = function () {
        if ($.browser.operamini) return this;
        this.buildUI();
        this.hideDomSelect();
        if (this.domSelect.is(':disabled')) {
            this.select.addClass('disabled');
            return this;
        }
        if (this.isJScrollPane) this.buildJScrollPane();
        this.bindUIEvents();
        this.settings.onInit && this.settings.onInit.apply(this, [this.domSelect, 'init']);

    }

    CoreUISelect.prototype.buildUI = function () {

        // Build select container
        this.select = $(this.templates.select.container)
            .insertBefore(this.domSelect);

        this.selectValue = $(this.templates.select.value)
            .appendTo(this.select);

        // TODO Add custom states for button
        this.selectButton = $(this.templates.select.button)
            .appendTo(this.select);

        // Build dropdown container
        this.dropdown = $(this.templates.dropdown.container);
        this.dropdownWrapper = $(this.templates.dropdown.wrapper).appendTo(this.dropdown);

        this.settings.appendToBody ? this.dropdown.appendTo($('body')) : this.dropdown.insertBefore(this.domSelect);

        // Build dropdown
        this.dropdownList = $(this.templates.dropdown.list).appendTo(this.dropdownWrapper);
        this.domSelect.find('option').each($.proxy(this, 'addItems'));


        // Build dropdown
        this.dropdownItem = this.dropdown.find('.' + $(this.templates.dropdown.item).attr('class'));

        // Add classes for dropdown
        this.dropdownItem.filter(':first-child').addClass('first');
        this.dropdownItem.filter(':last-child').addClass('last');

        this.addOptionGroup();

        // Add placeholder value by selected option
        this.setSelectValue(this.getSelectedItem().text());
        this.updateDropdownPosition();

        // Set current item form option:selected
        this.currentItemOfDomSelect = this.currentItemOfDomSelect || this.domSelect.find('option:selected');

    }

    CoreUISelect.prototype.hideDomSelect = function () {

        this.domSelect.addClass('select__state_hide');
        //        this.domSelect.css({
        //            'top' : this.select.position().top,
        //            'left' : this.select.position().left
        //        });
    }

    CoreUISelect.prototype.showDomSelect = function () {
        this.domSelect.css({
            'top': 'auto',
            'left': 'auto'
        })
        this.domSelect.removeClass('select__state_hide');
    }

    CoreUISelect.prototype.bindUIEvents = function () {
        // Bind plugin elements
        this.domSelect.bind('focus', $.proxy(this, 'onFocus'));
        this.domSelect.bind('blur', $.proxy(this, 'onBlur'));
        this.domSelect.bind('change', $.proxy(this, 'onChange'));
        this.domSelect.bind('keydown', $.proxy(this, 'onKeydown'))

        if ($.browser.mobile) this.domSelect.bind('change', $.proxy(this, 'changeDropdownData'));
        this.select.bind('click', $.proxy(this, 'onSelectClick'));
        this.dropdownItem.bind('click', $.proxy(this, 'onDropdownItemClick'));
    }

    CoreUISelect.prototype.getCurrentIndexOfItem = function (__item) {
        return this.domSelect.find('option').index($(this.domSelect).find('option:selected'));
    }

    CoreUISelect.prototype.scrollToCurrentDropdownItem = function (__item) {
        if (this.dropdownWrapper.data('jsp')) {
            this.dropdownWrapper.data('jsp').scrollToElement(__item);
            return this;
        }
        // Alternative scroll to element
        $(this.dropdownWrapper)
            .scrollTop($(this.dropdownWrapper)
                .scrollTop() + __item.position().top - $(this.dropdownWrapper).height() / 2 + __item.height() / 2);
    }

    CoreUISelect.prototype.buildJScrollPane = function () {
        this.dropdownWrapper.wrap($('<div class="j-scroll-pane"></div>'));
    }

    CoreUISelect.prototype.isJScrollPane = function () {
        if (this.settings.jScrollPane) {
            if ($.fn.jScrollPane) return true;
            else throw new Error('jScrollPane no found');
        }
    }

    CoreUISelect.prototype.initJScrollPane = function () {
        this.dropdownWrapper.jScrollPane(this.settings.jScrollPane);
    }

    CoreUISelect.prototype.showDropdown = function () {
        //this.domSelect.focus();
        this.settings.onOpen && this.settings.onOpen.apply(this, [this.domSelect, 'open']);
        if ($.browser.mobile) return this;
        //        if (this.dropdown.parents('.b_popup')) {
        //            this.dropdown.parents('.b_popup').css('overflow-y', 'visible');
        //        }
        if (!this.isSelectShow) {
            this.isSelectShow = true;
            this.select.addClass('active');
            this.dropdown.addClass('show').removeClass('hide');
            if (this.isJScrollPane) this.initJScrollPane();
            this.scrollToCurrentDropdownItem(this.dropdownItem.eq(this.getCurrentIndexOfItem()));
            this.updateDropdownPosition();
        }

    }

    CoreUISelect.prototype.hideDropdown = function () {
        //        if (this.dropdown.parents('.b_popup')) {
        //            this.dropdown.parents('.b_popup').css('overflow-y', 'auto');
        //        }
        if (this.isSelectShow) {
            this.isSelectShow = false;
            this.select.removeClass('active');
            this.dropdown.removeClass('show').addClass('hide');
            this.settings.onClose && this.settings.onClose.apply(this, [this.domSelect, 'close']);
        }

        if (this.isSelectFocus) this.domSelect.focus();

    }

    CoreUISelect.prototype.hideAllDropdown = function () {
        for (var i in allSelects) {
            if (allSelects[i].hasOwnProperty(i)) {
                allSelects.dropdown.isSelectShow = false;
                allSelects.dropdown.domSelect.blur();
                allSelects.dropdown.addClass('hide').removeClass('show');
            }
        }
    }

    CoreUISelect.prototype.changeDropdownData = function (event) {
        if ((this.isSelectShow || this.isSelectFocus)) {
            this.currentItemOfDomSelect = this.domSelect.find('option:selected');
            this.dropdownItem.removeClass("active");
            this.dropdownItem.eq(this.getCurrentIndexOfItem()).addClass("active");
            this.scrollToCurrentDropdownItem(this.dropdownItem.eq(this.getCurrentIndexOfItem()));
            this.setSelectValue(this.currentItemOfDomSelect.text());

        }
        if ($.browser.mobile) this.settings.onChange && this.settings.onChange.apply(this, [this.domSelect, 'change']);
    }

    CoreUISelect.prototype.onDomSelectChange = function (_is) {
        this.domSelect.bind('change', $.proxy(this, 'onChange'));
        dispatchEvent(this.domSelect.get(0), 'change');
        if (!_is) this.settings.onChange && this.settings.onChange.apply(this, [this.domSelect, 'change']);
    }

    CoreUISelect.prototype.addListenerByServicesKey = function (event) {
        if (this.isSelectShow) {
            switch (event.which) {
                case 9:   // TAB
                case 13:  // ESQ
                case 27:  // ENTER
                    this.hideDropdown();
                    break;
                case 38:  // ARROW UP
                    console.log(this.getCurrentIndexOfItem());
                    break;
                case 40:  // ARROW DOWN
                    console.log(this.getCurrentIndexOfItem());
                    break;
            }
        }
    }

    CoreUISelect.prototype.onSelectClick = function (event) {
        if (!this.isSelectShow) {
            event.stopPropagation();
            this.showDropdown();
        }
        else this.hideDropdown();
        //return false;
    }

    CoreUISelect.prototype.onFocus = function () {
        this.isDocumentMouseDown = false;
        this.isSelectFocus = true;
        this.select.addClass('focus');
        this.settings.onFocus && this.settings.onFocus.apply(this, [this.domSelect, 'focus']);
    }

    CoreUISelect.prototype.onBlur = function () {
        if (!this.isDocumentMouseDown) {
            this.isSelectFocus = false;
            this.select.removeClass('focus');
            this.settings.onBlur && this.settings.onBlur.apply(this, [this.domSelect, 'blur']);
            //this.hideDropdown();
        }
    }

    CoreUISelect.prototype.onChange = function () {
        this.settings.onChange && this.settings.onChange.apply(this, [this.domSelect, 'change']);
    }

    CoreUISelect.prototype.onKeydown = function (event) {
        if (event.which != 9) event.preventDefault();
        switch (event.which) {
            case 32:   // SPACE
                this.showDropdown();
                break;
        }

    }

    CoreUISelect.prototype.onDropdownItemClick = function (event) {
        var item = $(event.currentTarget);

        if (!(item.hasClass('disabled') || item.hasClass('active'))) {
            this.domSelect.unbind('change', $.proxy(this, 'onChange'));
            var index = this.dropdown.find('.' + $(this.templates.dropdown.item).attr('class')).index(item)
            this.dropdownItem.removeClass('active');
            this.dropdownItem.eq(index).addClass('active');
            this.domSelect.find('option').removeAttr('selected');
            this.domSelect.find('option').eq(index).attr('selected', true);
            this.setSelectValue(this.getSelectedItem().text());
            this.onDomSelectChange(true);
        }
        if (!(item.hasClass('disabled'))) this.hideDropdown();
        return false;
    }

    CoreUISelect.prototype.onDocumentMouseDown = function (event) {
        this.isDocumentMouseDown = true;
        if ($(event.target).closest(this.select).length == 0 && $(event.target).closest(this.dropdown).length == 0) {
            if ($(event.target).closest('option').length == 0) {  // Hack for Opera
                this.isDocumentMouseDown = false;
                this.hideDropdown();
            }
        }
        return false;
    }

    CoreUISelect.prototype.updateDropdownPosition = function () {
        if (this.isSelectShow) {
            if (this.settings.appendToBody) {
                this.dropdown.css({
                    'position': 'absolute',
                    'top': this.select.offset().top + this.select.outerHeight(true),
                    'left': this.select.offset().left,
                    'z-index': '9999'
                });
            } else {
                this.dropdown.css({
                    'position': 'absolute',
                    'top': this.select.position().top + this.select.outerHeight(true),
                    'left': this.select.position().left,
                    'z-index': '9999'
                });
            }

            var marginDifferenceBySelect = this.select.outerWidth() - this.select.width();
            var marginDifferenceByDropdown = this.dropdown.outerWidth() - this.dropdown.width();

            //this.dropdown.css('min-width', (this.select.outerWidth(true)));

            if (parseInt(this.dropdown.css('min-width')) == this.select.outerWidth()) {
                this.dropdown.css('min-width', (this.select.width() + marginDifferenceBySelect) - marginDifferenceByDropdown);
            }

            if (this.isJScrollPane) this.initJScrollPane();
        }
    }

    CoreUISelect.prototype.setSelectValue = function (_text) {
        this.selectValue.text(_text);
    }

    CoreUISelect.prototype.isOptionGroup = function () {
        return this.domSelect.find('optgroup').length > 0;
    }

    CoreUISelect.prototype.addOptionGroup = function () {
        var optionGroup = this.domSelect.find('optgroup');
        for (var i = 0; i < optionGroup.length; i++) {
            var index = this.domSelect.find("option").index($(optionGroup[i]).find('option:first-child'))
            $(this.templates.dropdown.optionLabel)
                .text($(optionGroup[i]).attr('label'))
                .insertBefore(this.dropdownItem.eq(index));
        }
    }

    CoreUISelect.prototype.addItems = function (index, el) {
        var el = $(el);
        var item = $(this.templates.dropdown.item).text(el.text());
        if (el.attr("disabled")) item.addClass('disabled');
        if (el.attr("selected")) {
            this.domSelect.find('option').removeAttr('selected');
            item.addClass('active');
            el.attr('selected', 'selected');
        }
        item.appendTo(this.dropdownList);
    }

    CoreUISelect.prototype.getSelectedItem = function () {
        return this.dropdown.find('.active').eq(0);
    }

    CoreUISelect.prototype.update = function () {
        this.destroy();
        this.init();
    }

    CoreUISelect.prototype.destroy = function () {
        // Unbind plugin elements
        this.domSelect.unbind('focus', $.proxy(this, 'onFocus'));
        this.domSelect.unbind('blur', $.proxy(this, 'onBlur'));
        this.domSelect.unbind('change', $.proxy(this, 'onChange'));
        this.domSelect.unbind('keydown', $.proxy(this, 'onKeydown'));
        this.select.unbind('click', $.proxy(this, 'onSelectClick'));
        this.dropdownItem.unbind('click', $.proxy(this, 'onDropdownItemClick'));
        // Remove select container
        this.select.remove();
        this.dropdown.remove();
        this.showDomSelect();
        this.settings.onDestroy && this.settings.onDestroy.apply(this, [this.domSelect, 'destroy']);
    }


    $.fn.coreUISelect = function (__options, __templates) {
        return this.each(function () {
            var select = $(this).data('coreUISelect');
            if (__options == 'destroy' && !select) return;
            if (select) {
                __options = (typeof __options == "string" && select[__options]) ? __options : 'update';
                select[__options].apply(select);
                if (__options == 'destroy') {
                    $(this).removeData('coreUISelect');
                    for (var i = 0; i < allSelects.length; i++) {
                        if (allSelects[i] == select) {
                            allSelects.splice(i, 1);
                            break;
                        }
                    }
                }
            } else {
                select = new CoreUISelect($(this), __options, __templates);
                allSelects.push(select);
                $(this).data('coreUISelect', select);
            }

        });
    };

    function dispatchEvent(obj, evt, doc) {
        var doc = doc || document;
        if (obj !== undefined || obj !== null) {
            if (doc.createEvent) {
                var evObj = doc.createEvent('MouseEvents');
                evObj.initEvent(evt, true, false);
                obj.dispatchEvent(evObj);
            } else if (doc.createEventObject) {
                var evObj = doc.createEventObject();
                obj.fireEvent('on' + evt, evObj);
            }
        }
    }

    $(document).bind('mousedown', function (event) {
        for (var i = 0; i < allSelects.length; i++) {
            allSelects[i].onDocumentMouseDown(event);
        }
    });

    $(document).bind('keyup', function (event) {
        for (var i = 0; i < allSelects.length; i++) {
            if ($.browser.safari || $.browser.msie || $.browser.opera) allSelects[i].changeDropdownData(event); // Hack for Safari
            allSelects[i].addListenerByServicesKey(event);
        }
    });

    $(document).bind($.browser.safari ? 'keydown' : 'keypress', function (event) {
        for (var i = 0; i < allSelects.length; i++) {
            allSelects[i].changeDropdownData(event);
        }
    });

    $(window).bind('resize', function (event) {
        for (var i = 0; i < allSelects.length; i++) {
            allSelects[i].updateDropdownPosition(event);
        }
    });



})(jQuery);;actiGuide.mainModule = angular.module('mainModule', []);;actiGuide.mainModule.controller('TestFormCtrl', function ($scope, $timeout) {

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

        $timeout(function (){
            $scope.sending = false;
            $timeout(function (){
                alert('Сохранение успешно');
            });
        }, 2000);
    };

    $scope.checkPaymentType = function (){
        return $scope.Model.PaymentType.Id == 4;
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

actiGuide.mainModule.directive('dateField', function($sniffer, $browser, $timeout, $filter, $caretPosition) {

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

            var inputDay = element.find('input:first'),
                inputMonth = element.find('input:eq(1)'),
                inputYear = element.find('input:last'),
                inputs = element.find('input');

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
                    year = parseInt(inputYear.val()),
                    totalValue;

                console.log(day, month, year);

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

                totalValue = day + '.' + month + '.' + year;

                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(totalValue);
                });
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
                    year = parseInt(inputYear.val()),
                    totalValue;

                if (day === 0) { inputDay.val('1'); }
                if (month === 0) { inputMonth.val('1'); }


                totalValue = day + '.' + month + '.' + year;

                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(totalValue);
                });
            });

            //управление стрелками
//            inputRub.on('keydown', function(event) {
//                if (!scope.showKop) return;
//
//                var key = event.keyCode,
//                    caretPosition = $caretPosition.get(this),
//                    valueLength = this.value.length;
//
//                if (key == 39 && caretPosition == valueLength) {
//                    $timeout(function () {
//                        $caretPosition.$set(inputKop, 0);
//                    }, 1);
//                }
//            });
//            inputKop.on('keydown', function(event) {
//                var key = event.keyCode,
//                    caretPosition = $caretPosition.get(this);
//
//                if (key == 37 && caretPosition == 0) {
//                    $timeout(function () {
//                        $caretPosition.$set(inputRub, inputRub.val().length);
//                    }, 1);
//                }
//            });

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
                '<input class="t-input t-input__micro first" placeholder="ДД" maxlength="2">' +
                '<input class="t-input t-input__micro" placeholder="ММ" maxlength="2">' +
                '<input class="t-input t-input__mini last" placeholder="ГГГГ" maxlength="4">' +
            '</div>',
        replace: true
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

				if (layers.layersList.length > 1 && !layers.isUpInTree(this)) {
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
});;actiGuide.mainModule.directive('dynLoad', function ($http, $sce) {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, $element, $attrs) {
			$scope.dynamic = true;
			$scope.loaded = false;

			$scope.$watch('visible', function(newVal) {
				if ($scope.currentSection) {
					if (newVal) {
						if (!$scope.sections[$scope.currentSection.section].loaded) {
							loadContent($scope.sections[$scope.currentSection.section], function() {
								if (typeof $scope.dynOnLoad === 'function') {
									$scope.dynOnLoad($scope.currentSection.section);
								}
							});
						} else {
							if (typeof $scope.dynOnOpen === 'function') {
								$scope.dynOnOpen($scope.currentSection.section);
							}
						}
					}
				} else {
					if (!$scope.loaded && newVal) {
						$http.get($attrs.dynLoad).success(function (response) {
							$scope.loaded = true;
							$scope.content = $sce.trustAsHtml(response);

							if (typeof $scope.dynOnLoad === 'function') {
								$scope.dynOnLoad();
							}
						});
					}

					if ($scope.loaded && newVal && typeof $scope.dynOnOpen === 'function') {
						$scope.dynOnOpen();
					}
				}
			});

			$scope.$watch('currentSection', function(newVal) {
				if ($scope.visible && newVal) {
					loadContent($scope.sections[newVal.section]);
				}

				if ($scope.visible && newVal && !$scope.sections[newVal.section].loaded && typeof $scope.dynOnLoad === 'function') {
					$scope.dynOnLoad(newVal.section);
				}

				if ($scope.visible && newVal && $scope.sections[newVal.section].loaded && typeof $scope.dynOnOpen === 'function') {
					$scope.dynOnOpen(newVal.section);
				}
			});

			function loadContent(currentSection, callback) {
				if (!currentSection.loaded) {
					$http.get(currentSection.dynLoad).success(function (response) {
						currentSection.loaded = true;
						currentSection.content = $sce.trustAsHtml(response);

						if (typeof callback === 'function') {
							callback(response);
						}
					});
				}
			}
		}
	}
});;/**
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

                    control.on('focusout', function() {
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
                    });
                }
            });
        },
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

actiGuide.mainModule.directive('popupCaller', function (layers) {
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

					if (layers.layersList.length > 0 && !layers.isDownInTree(this)) {
						return;
					}

					scope.noScroll = true;

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

actiGuide.mainModule.directive('popup', function ($document, layers) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'templates/popup.html',
		replace: true,
		scope: true,
		controller: function($scope, $element, $attrs) {

			$scope.visible = false;

			$element.bind('click', function (e) {
				if (angular.element(e.target).hasClass('pop-on-click')) {
					angular.element($document[0].body).scope().noScroll = false;
					layers.popLastLayer();
				}
			});

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
}).directive('popupSection', function ($sce) {
	return {
		restrict: 'E',
		controller: function($scope, $element, $attrs) {
			var $parent = angular.element($element).parent(),
				$parentScope = $parent.scope();

			if (!$parentScope.sections) {
				$parentScope.sections = {};
			}

			if (!$parentScope.sections[$attrs.target]) {
				$parentScope.sections[$attrs.target] = {}
			}

			$parentScope.sections[$attrs.target].content = $sce.trustAsHtml($element.html());

			if ($attrs.dynLoad) {
				$parentScope.sections[$attrs.target].dynLoad = $attrs.dynLoad;
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
            });
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
}]);;actiGuide.mainModule.constant('VIEWS_PATH', 'js/app/modules/main/directives/views/');