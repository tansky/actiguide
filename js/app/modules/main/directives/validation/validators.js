/**
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
})