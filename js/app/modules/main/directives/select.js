/**
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
});