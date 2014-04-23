/**
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
});
