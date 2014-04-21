/**
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
});