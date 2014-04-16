/**
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
