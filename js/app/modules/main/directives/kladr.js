/**
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
